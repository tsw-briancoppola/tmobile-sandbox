// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/finalists/leaderboard";
// const DATA_SOURCE = "https://fn5gl.t-mobile.com/api/finalists/leaderboard";
const BEARER_TOKEN = "BRwrayCz7H1z3XJwMOpmnd9j";

let schoolData;
let schoolDataPrevious;

// DOM references
const fn5glIntroContainer = document.querySelector(".tsw-fn5gl-intro-container");
const fn5glIntro = document.querySelector(".tsw-fn5gl-intro");
const fn5glIntroButtons = document.querySelector(".tsw-fn5gl-intro-buttons");
const fn5glLeaderboard = document.querySelector(".tsw-fn5gl-leaderboard");
const fn5glLeaderboardData = document.querySelector(".tsw-fn5gl-leaderboard-data");
const fn5glLeaderboardRegionsContainer = document.querySelector(".tsw-fn5gl-leaderboard-regions-container");
const fn5glRegions = document.querySelector(".tsw-fn5gl-leaderboard-regions");
const fn5glLeaderboardLoader = document.querySelector(".tsw-fn5gl-leaderboard-loader");
// const fn5glMapLoader = document.querySelector(".tsw-fn5gl-map-loader");
const fn5glUSAMapContainer = document.querySelector(".tsw-fn5gl-usa-map-container");
const fn5glUSAMap = document.querySelector(".tsw-fn5gl-usa-map");
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
const VOTING_ACTIVE = true;
const SHOW_VOTES_IN_MOBILE = true;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

const generateGroupClone = () => {
  const clone = (clone.innerHTML = "");

  // Create clone of state group that will render focus stroke
  const pathClone = mapGroup.cloneNode(true);
  pathClone.removeAttribute("tabindex");
  pathClone.removeAttribute("role");
  pathClone.removeAttribute("aria-label");
  pathClone.classList.add("tsw-focus-overlay-stroke");
  pathClone.classList.remove("hover");
  pathClone.classList.remove("highlight");
  focusOverlay.appendChild(pathClone);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render leaderboard functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

const getSortedRegionSchools = (region, data = schoolData) => {
  return data[region].sort((a, b) => (b.votes_phase_1 || 0) - (a.votes_phase_1 || 0));
};

const findSchoolById = (schoolId) => {
  const schoolDataFlat = Object.values(schoolData).flat();
  return schoolDataFlat.find((s) => s.id === schoolId);
};

const getSchoolRank = (schoolId) => {
  const schoolDataFlat = Object.values(schoolData).flat();
  const school = schoolDataFlat.find((s) => s.id === schoolId);
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

  // const rowClasses = ["tsw-fn5gl-region-row", !SHOW_VOTE_TOTALS && "no-votes", !SHOW_TREND && "no-trend"]
  //   .filter(Boolean)
  //   .join(" ");

  schoolRows = schoolsSorted
    .map((school, index) => {
      return `
        <li class="tsw-fn5gl-region-row">
          <div class="tsw-fn5gl-region-rank">${index + 1}</div>
          <div class="tsw-fn5gl-region-info">
            <div class="tsw-fn5gl-region-school"><a href="#" data-school-id="${school.id}">${school.name}</a></div>
            <div class="tsw-fn5gl-region-location">${school.city}, ${school.state}</div>
            ${SHOW_VOTES_IN_MOBILE ? `<div class="tsw-fn5gl-region-votes-mobile">Votes: <span class="bold">${school.votes_phase_1.toLocaleString("en-US")}</span></div>` : ""}
          </div>
          <div class="tsw-fn5gl-region-votes votes-column">${school.votes_phase_1.toLocaleString("en-US")}</div>
          <a href="${school.voting_page_url}" class="tsw-fn5gl-region-row-button magenta-button" ${!VOTING_ACTIVE ? 'aria-disabled="true" tabindex="-1"' : ""}>Vote</a>
        </li>
      `;
    })
    .join("");

  return `
    <div class="tsw-fn5gl-region" role="tabpanel" aria-labelledby="${region}" ${region !== currentRegion ? "hidden" : ""}>
      <div class="tsw-fn5gl-leaderboard-regions-header">
        <span>Rank</span>
        <span>School</span>
        <span class="votes-column">Votes</span>
        <span></span>
      </div>
      <ol role="list" class="tsw-fn5gl-region-list">${schoolRows || "No schools yet"}</ol>
    </div>
  `;
};

const renderAllRegions = () => {
  // Create new object that groups the schools by region
  const allRegionsHTML = REGIONS_ORDER.map((region) => {
    return schoolData[region] ? renderRegion(region) : "";
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

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).format(date);

  return { time, formattedDate };
};

const renderModal = (school) => {
  const { stadium_name, stadium_address, stadium_city, stadium_state, stadium_zip, datetime, timezone } =
    school.home_game;
  const cityState = `${stadium_city}, ${stadium_state}`;
  const { time, formattedDate } = parseGameDateTime(datetime);

  const schoolImageBasePath =
    "/content/dam/digx/tmobile/us/en/sandbox/alex-park/fn5gl/testing-and-reserve/top-40-logos-testing/";
  const schoolImageName = `FN5GL_${school.region}_${school.id}_${school.state}_logo.png`;
  const schoolImageFullPath = schoolImageBasePath + schoolImageName;

  return `
    <div class="tsw-modal-school-header">
      <div class="tsw-modal-school-location">
        <p class="tsw-modal-school-city-state">${school.city}, ${school.state}</p>
        <h2 class="tsw-modal-school-name">${school.name}</h2>
      </div>
      <div class="tsw-modal-school-desc-logo">
        <p class="tsw-modal-school-description">${school.description}</p>
        <div class="tsw-modal-school-logo">
          <img src="${schoolImageFullPath}" alt="${school.name} logo" />
        </div>
      </div>
    </div>

    <div class="tsw-modal-school-stats">
      <div class="tsw-modal-school-stat">
        <span class="tsw-modal-school-stat-value">${getSchoolRank(school.id)}</span>
        <span class="tsw-modal-school-stat-label">Rank</span>
      </div>
      <div class="tsw-modal-school-stat">
        <span class="tsw-modal-school-stat-value">${school.votes_phase_1.toLocaleString("en-US")}</span>
        <span class="tsw-modal-school-stat-label">Total Votes</span>
      </div>
      <div>
        <a href="${school.voting_page_url}" class="tsw-modal-school-stat-button magenta-button" ${!VOTING_ACTIVE ? 'aria-disabled="true" tabindex="-1"' : ""}>Vote for this school</a>
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
          <span class="tsw-modal-game-detail-value">${time} ${timezone || ""}</span>
          <span class="tsw-modal-game-detail-label">Time</span>
        </div>
        <div class="tsw-modal-game-detail">
          <span class="tsw-modal-game-detail-value">${formattedDate || TBD}</span>
          <span class="tsw-modal-game-detail-label">Date</span>
        </div>
        <div class="tsw-modal-game-detail">
          <span class="tsw-modal-game-detail-value">${stadium_name || "Location TBD"}</span>
          ${stadium_name ? `<span class="tsw-modal-game-detail-label">${stadium_address}<br />${cityState}<br />${stadium_zip}</span>` : ""}
        </div>
      </div>
    </div>
  `;
};

const openModal = (schoolId, triggerElement) => {
  const schoolDataFlat = Object.values(schoolData).flat();
  const school = schoolDataFlat.find((s) => s.id === schoolId);
  if (!school) return;

  fn5glModalMain.innerHTML = renderModal(school);

  modalState.trigger = triggerElement;
  modalState.focusableElements = [
    ...fn5glModal.querySelectorAll(`a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])`),
  ];

  fn5glModal.show();
  fn5glModal.classList.add("is-visible");
  fn5glModalOverlay.classList.add("is-visible");
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
  const introButton = fn5glIntroButtons.querySelector(`button[aria-controls="${regionId}"]`);

  if (mapGroup) mapGroup.classList.toggle("hover", isHovering);
  if (introButton) introButton.classList.toggle("hover", isHovering);
};

const setActiveRegion = (regionId) => {
  // Clear hover from all map groups and intro buttons
  fn5glUSAMap.querySelectorAll("g[data-map-region]").forEach((g) => {
    g.classList.remove("hover");
  });
  fn5glIntroButtons.querySelectorAll("[data-region]").forEach((button) => {
    button.classList.remove("hover");
  });

  currentRegion = regionId;

  const allRegions = fn5glRegions.querySelectorAll('[role="tabpanel"]');
  allRegions.forEach((panel) => {
    panel.hidden = panel.getAttribute("aria-labelledby") !== regionId;
  });

  const allMapGroups = fn5glUSAMap.querySelectorAll("g[data-map-region]");
  allMapGroups.forEach((g) => {
    g.classList.toggle("active", g.dataset.mapRegion === regionId);
  });

  const allIntroButtons = fn5glIntroButtons.querySelectorAll("[data-region]");
  allIntroButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.region === regionId);
  });
};

const updateRegionParam = (newRegion) => {
  const url = new URL(window.location);
  url.searchParams.set("region", newRegion.toLowerCase());
  window.history.replaceState({}, "", url); // or use pushState?
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

// Clicking on intro buttons, tabs, and map

// Intro buttons event listener

fn5glIntroButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-region]");
  if (!button) return;

  fn5glUSAMap.querySelectorAll("g[data-map-region]").forEach((g) => {
    g.classList.remove("hover");
  });

  if (!fn5glLeaderboardData.classList.contains("is-open")) {
    // Still in intro phase
    initWithRegion(button.dataset.region);
    return;
  }

  setActiveRegion(button.dataset.region);
  updateRegionParam(button.dataset.region);
});

// Map event listener

fn5glUSAMap.addEventListener("click", (event) => {
  const group = event.target.closest("g[data-map-region]");
  if (!group) return;

  const newRegion = group.dataset.mapRegion;
  if (!schoolData) return; // data not loaded yet, ignore clicks

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
  const thisSchoolId = event.target.dataset.schoolId;
  openModal(thisSchoolId, link);
});

// Open modal when high school vote button is clicked

// fn5glRegions.addEventListener("click", (event) => {
//   const button = event.target.closest(".magenta-button");
//   if (!button) return;

//   const schoolId = Number(button.dataset.voteId);
//   openModal(schoolId, button);
// });

// // Vote for school buttons in modal
// fn5glModal.addEventListener("click", (event) => {
//   const button = event.target.closest(".magenta-button");
//   if (!button) return;

//   const schoolId = button.dataset.voteId;
//   addVote(schoolId);
//   closeModal();
// });

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

  fn5glIntro.classList.remove("hidden");
};

const renderUI = (phase) => {
  if (phase === "intro") {
    fn5glIntroContainer.classList.remove("hidden");

    if (!breakpoint.matches) {
      fn5glLeaderboardRegionsContainer.classList.add("hidden");
      fn5glUSAMapContainer.classList.add("hidden");
    }

    initIntroData();
  }

  if (phase === "loading") {
    fn5glIntroContainer.classList.add("hidden");
    fn5glIntro.classList.add("hidden");
    fn5glLeaderboardRegionsContainer.classList.remove("hidden");
    fn5glLeaderboardLoader.classList.remove("hidden");
    // fn5glMapLoader.classList.remove("hidden"); // if map is also re-initializing
    fn5glRegions.classList.add("hidden");
    // fn5glUSAMap.classList.add("hidden");
  }

  if (phase === "ready") {
    // const isMobile = !breakpoint.matches;
    fn5glLeaderboardData.classList.add("no-transition");
    fn5glLeaderboardData.classList.add("is-open");

    // Remove no-transition after the next paint so it doesn't affect future transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fn5glLeaderboardData.classList.remove("no-transition");
      });
    });

    const regionsStep = { fn: renderAllRegions, els: [fn5glRegions, fn5glLeaderboardRegionsContainer] };
    const mapStep = { fn: initMapAndStats, els: [fn5glUSAMap] };

    const steps = [mapStep, regionsStep];

    steps.forEach(({ fn, els }, i) => {
      setTimeout(() => {
        fn();
        els.forEach((el) => el.classList.remove("hidden"));
      }, i * 250);
    });

    setTimeout(() => {
      fn5glLeaderboardLoader.classList.add("hidden");
      // fn5glMapLoader.classList.add("hidden");
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

    return transformData(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

// Filtering API data to get it to 40 and adding properties
const transformData = (data) => {
  const { phase, ...regions } = data; // destructure phase out

  // store phase if needed
  // gamePhase = phase;

  return regions;
};

// Run if there's a region URL parameter set
const initWithRegion = async (region) => {
  currentRegion = region;
  updateRegionParam(region);

  if (!schoolData) {
    // URL param path
    renderUI("loading");
    schoolData = await dataPromise;
    if (!schoolData) {
      console.error("Failed to load school data");
      return;
    }
    schoolDataPrevious = structuredClone(schoolData);
    setOnLoadRegion();
    renderUI("ready");
    setActiveRegion(currentRegion);
    return;
  }

  fn5glLeaderboardData.classList.add("is-open");
  fn5glUSAMapContainer.classList.remove("hidden");

  setTimeout(() => {
    initMap();
    updateMapActiveRegion();
    setOnLoadRegion();
    setActiveRegion(currentRegion);

    const steps = [
      { fn: () => {}, els: [fn5glUSAMap] },
      { fn: renderAllRegions, els: [fn5glRegions, fn5glLeaderboardRegionsContainer] },
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
  }, 400); // Set delay to match
};

const init = () => {
  dataPromise = fetchData();
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("region")) {
    initWithRegion(urlParams.get("region"));
    return;
  }

  renderUI("intro");
};

init();
