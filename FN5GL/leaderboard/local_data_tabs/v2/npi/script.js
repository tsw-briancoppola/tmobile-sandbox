// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Data sources and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/verified-schools";
let schoolData;
let schoolDataPrevious;

// DOM references
const fn5glContainer = document.querySelector("#tsw-fn5gl-test").querySelector("xpr-npi-content").shadowRoot;

const fn5glLeaderboard = fn5glContainer.querySelector(".tsw-fn5gl-leaderboard");
const fn5glRegionTabs = fn5glContainer.querySelector(".tsw-fn5gl-tablist-container");
const fn5glRegions = fn5glContainer.querySelector(".tsw-fn5gl-leaderboard-regions");
const fn5glLoader = fn5glContainer.querySelector(".tsw-fn5gl-loader");
const fn5glUSAMap = fn5glContainer.querySelector(".tsw-fn5gl-usa-map");
const fn5glUSAMapRegions = fn5glContainer.querySelectorAll(".tsw-fn5gl-usa-map g");
const fn5glTooltip = fn5glContainer.querySelector(".tsw-tooltip");

// Region config
const REGIONS_ORDER = ["West", "Midwest", "South", "East"];

// Tab state - default
let currentRegion = REGIONS_ORDER[0];

// =-=-=-=-=
// Data prep
// =-=-=-=-=

// Add votes property to each school object
// const updateSchoolData = (data) => {
//   return data.map((d) => ({
//     ...d,
//     votes: 0,
//   }));
// };

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render leaderboard functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

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

const renderRegion = (region, schools) => {
  let schoolRows;

  if (schools) {
    const schoolsSorted = [...(schools || [])].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const schoolsPrevious = schoolDataPrevious.filter((school) => school.region === region);
    const schoolsPreviousSorted = schoolsPrevious.sort((a, b) => b.votes - a.votes);

    schoolRows = schoolsSorted
      .map((school, index) => {
        const trendValue = schoolsPreviousSorted.findIndex((s) => s.name === school.name) - index;

        return `
        <li class="tsw-fn5gl-region-row">
          <div class="tsw-fn5gl-region-rank">${index + 1}</div>
          <div class="tsw-fn5gl-region-info">
            <div class="tsw-fn5gl-region-school">${school.name}</div>
            <div class="tsw-fn5gl-region-location">${school.city}, ${school.state}</div>
          </div>
          <div class="tsw-fn5gl-region-votes">${school.votes.toLocaleString("en-US")}</div>
          <div class="tsw-fn5gl-region-trend">${renderTrend(trendValue)}</div>
          <button typ="button" class="magenta-button" data-vote-id="${school.id}">Vote</button>
        </li>
      `;
      })
      .join("");
  }

  return `
    <div class="tsw-fn5gl-region" role="tabpanel" aria-labelledby="${region}" ${region !== currentRegion ? "hidden" : ""}>
      <h3>${region}</h3>
      <ol role="list" class="tsw-fn5gl-region-list">${schoolRows || "No schools yet"}</ol>
    </div>
  `;
};

const renderAllRegions = () => {
  const grouped = Object.groupBy(schoolData, (school) => school.region);

  // const allRegionsHTML = REGIONS_ORDER.map((region) => {
  //   return grouped[region] ? renderRegion(region, grouped[region]) : "";
  // }).join("");

  const allRegionsHTML = REGIONS_ORDER.map((region) => {
    return renderRegion(region, grouped[region]);
  }).join("");

  fn5glRegions.innerHTML = allRegionsHTML;
};

// =-=-=-=-=-=-=-=-=-=-=-=-
// Render bracket functions
// =-=-=-=-=-=-=-=-=-=-=-=-

const getRegionLeaders = (schools) => {
  const leaders = REGIONS_ORDER.map((region) => {
    const regionSchools = schools.filter((school) => school.region === region);
    return regionSchools.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
  });

  return leaders;
};

const getMatchWinner = (team1, team2) => {
  return team1.votes >= team2.votes ? team1 : team2;
};

// =-=-=-=-=-=-=
// Map functions
// =-=-=-=-=-=-=

const handleTooltip = (target, isHovering) => {
  const region = target.dataset.mapRegion;

  // Build tooltip
  const rect = target.getBoundingClientRect();
  const containerRect = fn5glUSAMap.getBoundingClientRect();
  fn5glTooltip.innerHTML = `
    <p class="tsw-tooltip-state">${region}</p>
  `;

  // Position tooltip on map
  fn5glTooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
  fn5glTooltip.style.top = `${rect.bottom - containerRect.top - rect.height / 2}px`;
  // Determine whether tooltip should be active
  fn5glTooltip.classList.toggle("active", isHovering);
};

// =-=-=-=-=-=-=-=-=-=-=-
// Event listener helpers
// =-=-=-=-=-=-=-=-=-=-=-

const toggleRegionHighlight = (regionId, isHovering) => {
  if (regionId === currentRegion) return;

  const mapGroup = fn5glUSAMap.querySelector(`g[data-map-region="${regionId}"]`);
  const tab = fn5glRegionTabs.querySelector(`button[aria-controls="${regionId}"]`);

  if (mapGroup) mapGroup.classList.toggle("hover", isHovering);
  if (tab) tab.classList.toggle("hover", isHovering);
};

const setActiveRegion = (regionId) => {
  // Removes hover class so it doesn't get 'stuck'
  toggleRegionHighlight(regionId, false);

  currentRegion = regionId;

  const allTabs = fn5glRegionTabs.querySelectorAll('[role="tab"]');
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

  renderAllRegions(schoolData);
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

// Vote buttons
fn5glLeaderboard.addEventListener("click", (event) => {
  const button = event.target.closest(".magenta-button");
  if (!button) return;

  const schoolId = button.dataset.voteId;
  addVote(schoolId);

  // Restore focus to the clicked vote button
  const newButton = fn5glLeaderboard.querySelector(`[data-vote-id="${schoolId}"]`);
  if (newButton) {
    newButton.focus();
  }
});

// Clicking on tabs and map

fn5glRegionTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.getAttribute("aria-selected") === "true") return;

  const newRegion = button.getAttribute("aria-controls");
  setActiveRegion(newRegion);
  updateRegionParam(newRegion);
});

fn5glUSAMap.addEventListener("click", (event) => {
  const group = event.target.closest("g[data-map-region]");
  if (!group || group.dataset.mapRegion === currentRegion) return;

  const newRegion = group.dataset.mapRegion;
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

// Hover over tabs

fn5glRegionTabs.addEventListener("mouseover", (e) => {
  const button = e.target.closest("button");
  if (button) toggleRegionHighlight(button.getAttribute("aria-controls"), true);
});

fn5glRegionTabs.addEventListener("mouseout", (e) => {
  const button = e.target.closest("button");
  if (button) toggleRegionHighlight(button.getAttribute("aria-controls"), false);
});

// Hover over map

fn5glUSAMap.addEventListener("mouseover", (e) => {
  const group = e.target.closest("g[data-map-region]");
  if (group) {
    toggleRegionHighlight(group.dataset.mapRegion, true);
    handleTooltip(group, true);
  }
});

fn5glUSAMap.addEventListener("mouseout", (e) => {
  const group = e.target.closest("g[data-map-region]");
  if (group) {
    toggleRegionHighlight(group.dataset.mapRegion, false);
    handleTooltip(group, false);
  }
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Event listener for viewport changes
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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

// =-=-=-=
// On load
// =-=-=-=

const setOnLoadRegion = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlParamsArray = Object.fromEntries(urlParams.entries());

  const urlRegion = urlParamsArray.region || "west";
  const urlRegionCapitalized = urlRegion.charAt(0).toUpperCase() + urlRegion.slice(1);

  if (REGIONS_ORDER.includes(urlRegionCapitalized)) {
    currentRegion = urlRegionCapitalized;
  } else {
    updateRegionParam("west");
  }
};

const initTabs = () => {
  const allTabs = REGIONS_ORDER.map((region) => {
    return `
      <button role="tab" aria-selected="${region === currentRegion}" aria-controls="${region}">${region}</button>
    `;
  }).join("");

  const allTabsDiv = `
    <div class="tsw-fn5gl-tablist" role="tablist" aria-label="Friday Night Lights 5G High School regions">${allTabs}</div>
  `;

  fn5glRegionTabs.innerHTML = allTabsDiv;
};

const initMap = () => {
  fn5glUSAMap.innerHTML = usaMapSVG;
  const fn5glUSAMapSVG = fn5glUSAMap.querySelector("#tsw-fn5gl-usa-map-svg");
  fn5glUSAMapSVG.setAttribute("aria-hidden", "true");
  fn5glUSAMapSVG.setAttribute("tabindex", "-1");

  focusOverlay = document.createElementNS("http://www.w3.org/2000/svg", "g");
  focusOverlay.classList.add("tsw-focus-overlay");
  focusOverlay.setAttribute("pointer-events", "none");
  fn5glUSAMapSVG.appendChild(focusOverlay);

  const allMapG = fn5glUSAMap.querySelectorAll("g");
  allMapG.forEach((g) => {
    g.setAttribute("tabindex", "0");

    if (g.dataset.mapRegion === currentRegion) {
      g.classList.add("active");
    }
  });
};

const renderUI = (isLoading) => {
  if (isLoading) {
    fn5glLoader.classList.remove("hidden");
    fn5glLeaderboard.classList.add("hidden");
  }
  if (!isLoading && schoolData) {
    fn5glLoader.classList.add("hidden");
    fn5glLeaderboard.classList.remove("hidden");

    setOnLoadRegion();
    renderAllRegions();
    initTabs();
    initMap();
  }
};

const init = () => {
  schoolData = structuredClone(highSchoolData);
  schoolDataPrevious = structuredClone(highSchoolData);

  let isLoading = true;
  setTimeout(() => {
    isLoading = false;
    renderUI(isLoading);
  }, 1500);
};

init();
