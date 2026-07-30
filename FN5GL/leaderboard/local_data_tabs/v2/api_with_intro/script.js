// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/verified-schools";
// const DATA_SOURCE = "https://fn5gl.t-mobile.com/api/5k-fridays";
const BEARER_TOKEN = "FzGJtOcibwWWQNU2";

let schoolData;
let schoolDataPrevious;

// DOM references
const fn5glIntroContainer = document.querySelector(".tsw-fn5gl-intro-container");
const fn5glIntro = document.querySelector(".tsw-fn5gl-intro");
const fn5glIntroButtons = document.querySelector(".tsw-fn5gl-intro-buttons");
const fn5glIntroLoader = document.querySelector(".tsw-fn5gl-intro-loader");
const fn5glLeaderboard = document.querySelector(".tsw-fn5gl-leaderboard");
const fn5glRegionTabList = document.querySelector(".tsw-fn5gl-tablist");
const fn5glLeaderboardRegionsContainer = document.querySelector(".tsw-fn5gl-leaderboard-regions-container");
const fn5glRegions = document.querySelector(".tsw-fn5gl-leaderboard-regions");
const fn5glLeaderboardLoader = document.querySelector(".tsw-fn5gl-leaderboard-loader");
const fn5glMapLoader = document.querySelector(".tsw-fn5gl-map-loader");
const fn5glUSAMapContainer = document.querySelector(".tsw-fn5gl-usa-map-container");
const fn5glUSAMap = document.querySelector(".tsw-fn5gl-usa-map");
const fn5glUSAMapStats = document.querySelector(".tsw-fn5gl-usa-map-stats");
const fn5glTooltip = document.querySelector(".tsw-tooltip");

const fn5glModal = document.querySelector(".tsw-modal");
const fn5glModalOverlay = document.querySelector(".tsw-modal-overlay");
const fn5glModalMain = document.querySelector(".tsw-modal-main");
const fn5glModalClose = document.querySelector(".tsw-modal-close");

// Region config
const REGIONS_ORDER = ["West", "Midwest", "South", "East"];

// Tab state - default
let currentRegion = null;

// Focus overlay element
let focusOverlay = null;

// Modal state
let modalState = {
  trigger: null,
  focusableElements: [],
};

// Feature toggles
const LEADERBOARD_FIRST = false;
const SHOW_MAP_STATS = false;

const SHOW_VOTE_TOTALS = true;
const SHOW_TREND = true;
const SHOW_MODAL_IMAGE = true;
const ANIMATE_VOTE_COUNTER = true;

// =-=-=-=-=
// Data prep
// =-=-=-=-=

// Add votes property to each school object
const updateSchoolData = (data) => {
  return data.map((d) => ({
    ...d,
    votes: 10000,
    description: "Awesome place",
    home_game: {
      datetime: "2026-07-29T20:38:15.123Z",
      address: "33 Sassy Street",
    },
  }));
};

// =-=-=-=-=-=-=-=-=-=-=-
// Render intro functions
// =-=-=-=-=-=-=-=-=-=-=-

const renderIntroButtons = () => {
  const introHTML = REGIONS_ORDER.map((region) => {
    return `
      <button type="button" class="magenta-button" data-region="${region.toLowerCase()}" aria-controls="${region}">${region}</button>
    `;
  }).join("");

  fn5glIntroButtons.innerHTML = introHTML;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render leaderboard functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

const getSortedRegionSchools = (region, data = schoolData) => {
  return data.filter((s) => s.region === region).sort((a, b) => (b.votes || 0) - (a.votes || 0));
};

const getSchoolRank = (schoolId) => {
  const school = schoolData.find((s) => s.id === schoolId);
  return getSortedRegionSchools(school.region).findIndex((s) => s.id === schoolId) + 1;
};

const renderTrend = (trendValue) => {
  if (trendValue === 0) {
    return `<span role="status" aria-label="Rank unchanged" class="gray">—</span>`;
  }

  const isUp = trendValue > 0;
  const absTrendValue = Math.abs(trendValue);

  const places = absTrendValue === 1 ? "place" : "places";
  const trendDescription = `Moved ${isUp ? "up" : "down"} ${absTrendValue} ${places}`;

  return `
    <span role="status" class="${isUp ? "green" : "red"}" aria-label="${trendDescription}">
      <span aria-hidden="true">${isUp ? "▲" : "▼"}</span> ${absTrendValue}
    </span>`;
};

const renderRegion = (region) => {
  let schoolRows;

  const schoolsSorted = getSortedRegionSchools(region);
  const schoolsPreviousSorted = getSortedRegionSchools(region, schoolDataPrevious);

  const rowClasses = ["tsw-fn5gl-region-row", !SHOW_VOTE_TOTALS && "no-votes", !SHOW_TREND && "no-trend"]
    .filter(Boolean)
    .join(" ");

  schoolRows = schoolsSorted
    .map((school, index) => {
      const trendValue = schoolsPreviousSorted.findIndex((s) => s.name === school.name) - index;

      return `
        <li class="${rowClasses}">
          <div class="tsw-fn5gl-region-rank">${index + 1}</div>
          <div class="tsw-fn5gl-region-info">
            <div class="tsw-fn5gl-region-school"><a href="#" data-school-id="${school.id}">${school.name}</a></div>
            <div class="tsw-fn5gl-region-location">${school.city}, ${school.state}</div>
          </div>
          ${SHOW_VOTE_TOTALS ? `<div class="tsw-fn5gl-region-votes">${school.votes.toLocaleString("en-US")}</div>` : ""}
          ${SHOW_TREND ? `<div class="tsw-fn5gl-region-trend">${renderTrend(trendValue)}</div>` : ""}
          <button type="button" class="tsw-fn5gl-region-row-button magenta-button" data-vote-id="${school.id}">Vote</button>
        </li>
      `;
    })
    .join("");

  return `
    <div class="tsw-fn5gl-region" role="tabpanel" aria-labelledby="${region}" ${region !== currentRegion ? "hidden" : ""}>
      <ol role="list" class="tsw-fn5gl-region-list">${schoolRows || "No schools yet"}</ol>
    </div>
  `;
};

const renderAllRegions = () => {
  // Create new object that groups the schools by region
  const grouped = Object.groupBy(schoolData, (school) => school.region);

  const allRegionsHTML = REGIONS_ORDER.map((region) => {
    return grouped[region] ? renderRegion(region) : "";
  }).join("");

  fn5glRegions.innerHTML = allRegionsHTML;
};

// =-=-=-=-=-=-=-=
// Modal functions
// =-=-=-=-=-=-=-=

// Modal functions and event listeners

const parseGameDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  const timeZone = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
  })
    .format(date)
    .split(", ")[1]; // extracts "EDT"

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).format(date);

  return { time, timeZone, formattedDate };
};

const parseAddress = (address) => {
  const parts = address.split(", ");
  const [state, zip] = parts[2].split(" ");
  return {
    street: parts[0],
    cityState: `${parts[1]}, ${state}`,
    zip,
  };
};

const renderModal = (school) => {
  const { time, timeZone, formattedDate } = parseGameDateTime(school.home_game.datetime);
  const { street, cityState, zip } = parseAddress(school.home_game.stadium_address);

  return `
    <div class="tsw-modal-school-header">
      <p class="tsw-modal-school-location">${school.city}, ${school.state}</p>
      <h2 class="tsw-modal-school-name">${school.name}</h2>
      <div class="tsw-modal-school-desc-logo">
        <p class="tsw-modal-school-description">${school.description}</p>
        <div class="tsw-modal-school-logo"></div>
        <!-- <img src="" alt="${school.name} logo" /> -->
      </div>
    </div>

    <div class="tsw-modal-school-stats">
      <div class="tsw-modal-school-stat">
        <span class="tsw-modal-school-stat-value">${getSchoolRank(school.id)}</span>
        <span class="tsw-modal-school-stat-label">Rank</span>
      </div>
      <div class="tsw-modal-school-stat">
        <span class="tsw-modal-school-stat-value">${school.votes.toLocaleString("en-US")}</span>
        <span class="tsw-modal-school-stat-label">Total Votes</span>
      </div>
      <div>
        <button type="button" class="tsw-modal-school-stat-button magenta-button" data-vote-id="${school.id}">Vote for this school</button>
      </div>
    </div>

    <div class="tsw-modal-game">
      <div class="tsw-modal-game-header">
        <h3 class="tsw-modal-game-title">T-Mobile Home Game</h3>
        <p class="tsw-modal-game-description">
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat.
        </p>
      </div>
      <div class="tsw-modal-game-details">
        <div class="tsw-modal-game-detail">
          <span class="tsw-modal-game-detail-value">${time} ${timeZone}</span>
          <span class="tsw-modal-game-detail-label">Time</span>
        </div>
        <div class="tsw-modal-game-detail">
          <span class="tsw-modal-game-detail-value">${formattedDate}</span>
          <span class="tsw-modal-game-detail-label">Date</span>
        </div>
        <div class="tsw-modal-game-detail">
          <span class="tsw-modal-game-detail-value">${school.home_game.stadium_name}</span>
          <span class="tsw-modal-game-detail-label">${street}<br />${cityState}<br />${zip}</span>
        </div>
      </div>
      <div class="tsw-modal-game-image">
        <!-- <img src="" alt="${school.home_game.stadium_name}" /> -->
      </div>
    </div>
  `;
};

const openModal = (schoolId, triggerElement) => {
  const school = schoolData.find((s) => s.id === Number(schoolId));
  if (!school) return;

  fn5glModalMain.innerHTML = renderModal(school);

  modalState.trigger = triggerElement;
  modalState.focusableElements = [
    ...fn5glModal.querySelectorAll(`a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])`),
  ];

  fn5glModal.show();
  fn5glModal.classList.add("is-visible");
  fn5glModalOverlay.classList.add("is-visible");
  // modalState.focusableElements[0]?.focus();
  fn5glModal.focus();
};

const closeModal = () => {
  fn5glModal.classList.remove("is-visible");
  fn5glModalOverlay.classList.remove("is-visible");

  fn5glModalOverlay.addEventListener(
    "transitionend",
    () => {
      fn5glModal.close();
      modalState.trigger?.focus();
      modalState = { trigger: null, focusableElements: [] };
    },
    { once: true },
  );
};

fn5glModalOverlay.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    closeModal(); // Only runs if you click the overlay, not the modal itself
  }
});

fn5glModalClose.addEventListener("click", () => {
  closeModal();
});

// Modal tabbing and focus trapping

fn5glModal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
  if (event.key !== "Tab") return;

  const { focusableElements } = modalState;

  if (!focusableElements.length) return;

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  // Prevent tabbing out of the modal if there's only one focusable element
  if (first === last) {
    if (document.activeElement === first) {
      event.preventDefault();
    }
    return;
  }

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// =-=-=-=-=-=-=
// Map functions
// =-=-=-=-=-=-=

const animateCounter = (element, targetValue, duration = 5000) => {
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out — starts fast, slows toward the end
    const eased = 1 - Math.pow(1 - progress, 20);
    const currentValue = Math.round(eased * targetValue);

    element.textContent = currentValue.toLocaleString("en-US");

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const renderMapStats = () => {
  if (!SHOW_MAP_STATS) return;

  const totalVotes = schoolData.map((school) => school.votes).reduce((acc, curr) => acc + curr, 0);
  const stateWithMostVotes = Object.entries(
    schoolData.reduce((acc, { state, votes }) => {
      acc[state] = (acc[state] || 0) + votes;
      return acc;
    }, {}),
  ).reduce((max, curr) => (curr[1] > max[1] ? curr : max))[0];

  const boxes = fn5glUSAMapStats.querySelectorAll(".tsw-fn5gl-usa-map-stats-box");

  boxes[0].innerHTML = `
    <div class="tsw-fn5gl-usa-map-stats-box-stat">${ANIMATE_VOTE_COUNTER ? "0" : totalVotes.toLocaleString("en-US")}</div>
    <div class="tsw-fn5gl-usa-map-stats-box-text">Total votes cast</div>
  `;

  boxes[1].innerHTML = `
    <div class="tsw-fn5gl-usa-map-stats-box-stat">${stateWithMostVotes}</div>
    <div class="tsw-fn5gl-usa-map-stats-box-text">Most active state</div>
  `;

  // Animate after the element exists in the DOM
  if (ANIMATE_VOTE_COUNTER) {
    const totalVotesEl = boxes[0].querySelector(".tsw-fn5gl-usa-map-stats-box-stat");
    animateCounter(totalVotesEl, totalVotes);
  }
};

const handleTooltip = (target, isHovering) => {
  const region = target.dataset.mapRegion;

  // Build tooltip
  const rect = target.getBoundingClientRect();
  const mapRect = fn5glUSAMap.getBoundingClientRect();
  const containerRect = fn5glUSAMapContainer.getBoundingClientRect();
  fn5glTooltip.innerHTML = `
    <p class="tsw-tooltip-state">${region}</p>
  `;

  const mapOffsetTop = mapRect.top - containerRect.top;
  const mapOffsetLeft = mapRect.left - containerRect.left;

  // Position tooltip on map
  fn5glTooltip.style.left = `${rect.left - mapRect.left + rect.width / 2 + mapOffsetLeft}px`;
  fn5glTooltip.style.top = `${rect.bottom - mapRect.top - rect.height / 2 + mapOffsetTop}px`;
  // Determine whether tooltip should be active
  fn5glTooltip.classList.toggle("active", isHovering);
};

// =-=-=-=-=-=-=-=-=-=-=-
// Event listener helpers
// =-=-=-=-=-=-=-=-=-=-=-

const toggleRegionHighlight = (regionId, isHovering) => {
  if (regionId === currentRegion) return;

  const mapGroup = fn5glUSAMap.querySelector(`g[data-map-region="${regionId}"]`);
  const tab = fn5glRegionTabList.querySelector(`button[aria-controls="${regionId}"]`);
  const introButton = fn5glIntroButtons.querySelector(`button[aria-controls="${regionId}"]`);

  if (mapGroup) mapGroup.classList.toggle("hover", isHovering);
  if (tab) tab.classList.toggle("hover", isHovering);
  if (introButton) introButton.classList.toggle("hover", isHovering);
};

const setActiveRegion = (regionId) => {
  // Removes hover class so it doesn't get 'stuck'
  toggleRegionHighlight(regionId, false);

  currentRegion = regionId;

  const allTabs = fn5glRegionTabList.querySelectorAll('[role="tab"]');
  allTabs.forEach((tab) => {
    tab.setAttribute("aria-selected", tab.getAttribute("aria-controls") === regionId);
  });

  const allRegions = fn5glRegions.querySelectorAll('[role="tabpanel"]');
  allRegions.forEach((panel) => {
    panel.hidden = panel.getAttribute("aria-labelledby") !== regionId;
  });

  const allMapGroups = fn5glUSAMap.querySelectorAll("g[data-map-region]");
  allMapGroups.forEach((g) => {
    g.classList.toggle("active", g.dataset.mapRegion === regionId);
  });
};

const updateRegionParam = (newRegion) => {
  const url = new URL(window.location);
  url.searchParams.set("region", newRegion.toLowerCase());
  window.history.replaceState({}, "", url); // or use pushState?
};

const addVote = (id) => {
  const targetSchool = schoolData.find((school) => school.id === Number(id));
  targetSchool.votes += 1000;

  renderAllRegions();
  renderMapStats();
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

// Clicking on intro buttons, tabs, and map

/* Intro buttons event listener */

fn5glIntroButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-region]");
  if (!button) return;

  fn5glUSAMap.querySelectorAll("g[data-map-region]").forEach((g) => {
    g.classList.remove("hover");
  });

  initWithRegion(button.dataset.region);
});

fn5glRegionTabList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.getAttribute("aria-selected") === "true") return;

  const newRegion = button.getAttribute("aria-controls");
  setActiveRegion(newRegion);
  updateRegionParam(newRegion);
});

fn5glUSAMap.addEventListener("click", (event) => {
  const group = event.target.closest("g[data-map-region]");
  if (!group) return;

  const newRegion = group.dataset.mapRegion;
  if (!schoolData) return; // data not loaded yet, ignore clicks

  // Still in intro phase — treat like intro button click
  if (fn5glLeaderboardRegionsContainer.classList.contains("hidden")) {
    fn5glUSAMap.querySelectorAll("g[data-map-region]").forEach((g) => {
      g.classList.remove("hover");
    });
    initWithRegion(newRegion);
    return;
  }

  // Normal leaderboard phase
  if (newRegion === currentRegion) return;
  setActiveRegion(newRegion);
  updateRegionParam(newRegion);
});

// Map focus

fn5glUSAMap.addEventListener("focusin", (event) => {
  const mapGroup = event.target;
  if (mapGroup.tagName !== "g") return;

  focusOverlay.innerHTML = "";

  // Create clone of state group that will render focus stroke
  const pathClone = mapGroup.cloneNode(true);
  pathClone.removeAttribute("tabindex");
  pathClone.removeAttribute("role");
  pathClone.removeAttribute("aria-label");
  pathClone.classList.add("tsw-focus-overlay-stroke");
  pathClone.classList.remove("hover");
  pathClone.classList.remove("highlight");
  focusOverlay.appendChild(pathClone);
});

fn5glUSAMap.addEventListener("focusout", () => {
  focusOverlay.innerHTML = "";
});

// Map focus + return key pressed

fn5glUSAMap.addEventListener("keydown", (event) => {
  const mapGroup = event.target;
  if (mapGroup.tagName !== "g") return;

  if (event.key === "Enter") {
    const newRegion = mapGroup.dataset.mapRegion;
    setActiveRegion(newRegion);
    updateRegionParam(newRegion);
  }
});

// Map loses focus stroke when Escape key is pressed
fn5glUSAMap.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    focusOverlay.innerHTML = "";
  }
});

// Hover over intro buttons

fn5glIntroButtons.addEventListener("mouseover", (event) => {
  const button = event.target.closest("button");
  if (button) toggleRegionHighlight(button.getAttribute("aria-controls"), true);
});

fn5glIntroButtons.addEventListener("mouseout", (event) => {
  const button = event.target.closest("button");
  if (button) toggleRegionHighlight(button.getAttribute("aria-controls"), false);
});

// Hover over tabs

fn5glRegionTabList.addEventListener("mouseover", (event) => {
  const button = event.target.closest("button");
  if (button) toggleRegionHighlight(button.getAttribute("aria-controls"), true);
});

fn5glRegionTabList.addEventListener("mouseout", (event) => {
  const button = event.target.closest("button");
  if (button) toggleRegionHighlight(button.getAttribute("aria-controls"), false);
});

// Hover over map

fn5glUSAMap.addEventListener("mouseover", (event) => {
  const group = event.target.closest("g[data-map-region]");
  if (group) {
    toggleRegionHighlight(group.dataset.mapRegion, true);
    handleTooltip(group, true);
  }
});

fn5glUSAMap.addEventListener("mouseout", (event) => {
  const group = event.target.closest("g[data-map-region]");
  if (group) {
    toggleRegionHighlight(group.dataset.mapRegion, false);
    handleTooltip(group, false);
  }
});

// Open modal when high school name is clicked

fn5glLeaderboard.addEventListener("click", (event) => {
  const link = event.target.closest(".tsw-fn5gl-region-school a");
  if (!link) return;

  event.preventDefault();
  const thisSchoolId = Number(event.target.dataset.schoolId);
  openModal(thisSchoolId, link);
});

// Open modal when high school vote button is clicked

fn5glRegions.addEventListener("click", (event) => {
  const button = event.target.closest(".magenta-button");
  if (!button) return;

  const schoolId = Number(button.dataset.voteId);
  openModal(schoolId, button);
});

// Vote for school buttons in modal
fn5glModal.addEventListener("click", (event) => {
  const button = event.target.closest(".magenta-button");
  if (!button) return;

  const schoolId = button.dataset.voteId;
  addVote(schoolId);
  closeModal();
});

// Event listener for viewport changes

const debounce = (func, wait) => {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), wait);
  };
};

const breakpoint = window.matchMedia("(min-width: 768px)");

const handleBreakpointChange = (event) => {
  fn5glTooltip.classList.remove("active");
};

const debouncedHandleChange = debounce(handleBreakpointChange, 250);
breakpoint.addEventListener("change", debouncedHandleChange);

// =-=-=-=-=-=-=-=-=
// On load functions
// =-=-=-=-=-=-=-=-=

const setOnLoadRegion = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const region = urlParams.get("region");
  const regionCapitalized = region ? region.charAt(0).toUpperCase() + region.slice(1) : null;

  if (regionCapitalized && REGIONS_ORDER.includes(regionCapitalized)) {
    currentRegion = regionCapitalized;
  }
};

const initTabs = () => {
  const allTabs = REGIONS_ORDER.map((region) => {
    return `
      <button role="tab" aria-selected="${region === currentRegion}" aria-controls="${region}">${region}</button>
    `;
  }).join("");

  fn5glRegionTabList.innerHTML = allTabs;
};

let mapInitialized = false;

const initMap = () => {
  if (mapInitialized) return;
  mapInitialized = true;

  fn5glUSAMap.innerHTML = usaMapSVG;
  const fn5glUSAMapSVG = fn5glUSAMap.querySelector("#tsw-fn5gl-usa-map-svg");
  // Hides map from screen readers but allows child regions to be focusable
  fn5glUSAMapSVG.setAttribute("inert", "");
  fn5glUSAMapSVG.setAttribute("tabindex", "-1");

  focusOverlay = document.createElementNS("http://www.w3.org/2000/svg", "g");
  focusOverlay.classList.add("tsw-focus-overlay");
  focusOverlay.setAttribute("pointer-events", "none");
  fn5glUSAMapSVG.appendChild(focusOverlay);

  const allMapG = fn5glUSAMap.querySelectorAll("g");
  allMapG.forEach((g) => {
    g.setAttribute("tabindex", "0");
  });
};

const updateMapActiveRegion = () => {
  const allMapGroups = fn5glUSAMap.querySelectorAll("g[data-map-region]");
  allMapGroups.forEach((g) => {
    g.classList.toggle("active", g.dataset.mapRegion === currentRegion);
  });
};

const initMapAndStats = () => {
  initMap();
  updateMapActiveRegion();
  renderMapStats();
};

/* Render UI */

let dataPromise;

const initIntroData = async () => {
  schoolData = await dataPromise;
  if (!schoolData) {
    console.error("Failed to load school data");
    return;
  }
  schoolDataPrevious = structuredClone(schoolData);

  initMap();
  renderMapStats();
  renderIntroButtons();

  fn5glIntro.classList.remove("hidden");
  fn5glIntroLoader.classList.add("hidden");
  fn5glMapLoader.classList.add("hidden");
  fn5glUSAMap.classList.remove("hidden");
  // fn5glUSAMapStats.classList.remove("hidden");
};

const renderUI = (phase) => {
  if (phase === "intro") {
    fn5glIntro.classList.add("hidden");
    fn5glIntroLoader.classList.remove("hidden");
    fn5glMapLoader.classList.remove("hidden");
    fn5glLeaderboardRegionsContainer.classList.add("hidden");
    // fn5glUSAMapStats.classList.add("hidden");
    fn5glRegionTabList.classList.add("hidden");

    initIntroData();
  }

  if (phase === "loading") {
    fn5glIntroContainer.classList.add("hidden");
    fn5glIntro.classList.add("hidden");
    fn5glLeaderboardRegionsContainer.classList.remove("hidden");
    fn5glLeaderboardLoader.classList.remove("hidden");
    fn5glMapLoader.classList.remove("hidden"); // if map is also re-initializing
    fn5glRegionTabList.classList.add("hidden");
    fn5glRegions.classList.add("hidden");
    fn5glUSAMap.classList.add("hidden");
    // fn5glUSAMapStats.classList.add("hidden");
  }

  if (phase === "ready") {
    const isMobile = !breakpoint.matches;

    const tabStep = { fn: initTabs, els: [fn5glRegionTabList] };
    const regionsStep = { fn: renderAllRegions, els: [fn5glRegions, fn5glLeaderboardRegionsContainer] };
    const mapStep = { fn: initMapAndStats, els: [fn5glUSAMap, fn5glUSAMapStats] };

    const steps = isMobile
      ? LEADERBOARD_FIRST
        ? [tabStep, regionsStep, mapStep]
        : [tabStep, mapStep, regionsStep]
      : LEADERBOARD_FIRST
        ? [tabStep, regionsStep, mapStep]
        : [tabStep, mapStep, regionsStep];

    steps.forEach(({ fn, els }, i) => {
      setTimeout(() => {
        fn();
        els.forEach((el) => el.classList.remove("hidden"));
      }, i * 250);
    });

    setTimeout(() => {
      fn5glLeaderboardLoader.classList.add("hidden");
      fn5glMapLoader.classList.add("hidden");
    }, steps.length * 250);
  }
};

// =-=-=-=-=-=-=-
// Init functions
// =-=-=-=-=-=-=-

/* Fetch data */

const fetchData = async () => {
  try {
    const response = await fetch(DATA_SOURCE, {
      method: "GET", // Default method
      // headers: {
      //   Authorization: `Bearer ${BEARER_TOKEN}`,
      //   "Content-Type": "application/json",
      // },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);

    return transformData(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

// Filtering API data to get it to 40 and adding properties
// Delete when the data is final.
const transformData = (data) => {
  return data
    .filter(
      (school) => {
        const schoolsInRegion = data.filter((s) => s.region === school.region);
        const schoolIndex = schoolsInRegion.findIndex((s) => s.name === school.name);

        return schoolIndex < 10;
      } /* your filter conditions */,
    )
    .map((school) => ({
      ...school,
      votes: 10000,
      description: "Awesome place! It's pretty sweet.",
      home_game: {
        datetime: "2026-07-29T20:38:15.123Z",
        stadium_name: "A Football Stadium",
        stadium_address: "33 Sassy Street, Ball City, WA 98002",
      },
    }));
};
// -- End delete

// Run if there's a region URL parameter set
const initWithRegion = async (region) => {
  currentRegion = region;
  updateRegionParam(region);

  if (!schoolData) {
    // Coming from URL param — full load flow needed
    renderUI("loading");

    schoolData = await dataPromise;
    if (!schoolData) {
      console.error("Failed to load school data");
      return;
    }

    schoolDataPrevious = structuredClone(schoolData);

    setOnLoadRegion();
    renderUI("ready");
    return;
  }

  fn5glIntro.classList.add("hidden");
  fn5glIntroContainer.classList.add("hidden");
  fn5glLeaderboardRegionsContainer.classList.remove("hidden");

  setOnLoadRegion();

  const steps = [
    { fn: initTabs, els: [fn5glRegionTabList] },
    { fn: renderAllRegions, els: [fn5glRegions] },
  ];

  steps.forEach(({ fn, els }, i) => {
    setTimeout(() => {
      fn();
      els.forEach((el) => el.classList.remove("hidden"));
    }, i * 250);
  });

  setTimeout(() => {
    fn5glLeaderboardLoader.classList.add("hidden");
  }, steps.length * 250);

  updateMapActiveRegion();
};

const init = () => {
  if (!LEADERBOARD_FIRST) {
    fn5glLeaderboard.querySelector(".tsw-fn5gl-leaderboard-data").classList.add("map-first");
  }
  if (!SHOW_MAP_STATS) {
    fn5glUSAMapStats.style.display = "none";
  }

  dataPromise = fetchData(); // start fetching immediately
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("region")) {
    initWithRegion(urlParams.get("region"));
    return;
  }

  renderUI("intro");
};

init();
