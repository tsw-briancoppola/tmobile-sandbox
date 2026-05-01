// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Data sources and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/verified-schools";
// const DATA_SOURCE_PREVIOUS = highSchoolDataPrevious;
let schoolData;
let schoolDataPrevious;

// DOM references
const fn5glLeaderboard = document.querySelector(".tsw-fn5gl-leaderboard");
const fn5glRegions = document.querySelector(".tsw-fn5gl-leaderboard-regions");
const fn5glLoader = document.querySelector(".tsw-fn5gl-loader");
const fn5glUSAMap = document.querySelector(".tsw-fn5gl-usa-map");
const fn5glUSAMapRegions = document.querySelectorAll(".tsw-fn5gl-usa-map g");

// Region config
const REGIONS_ORDER = ["West", "Midwest", "South", "East"];

// Tab state - default
let currentRegion = REGIONS_ORDER[0];

// =-=-=-=-=
// Data prep
// =-=-=-=-=

// Add votes property to each school object
const updateSchoolData = (data) => {
  return data.map((d) => ({
    ...d,
    votes: 0,
  }));
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render leaderboard functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderTrend = (trendValue) => {
  if (trendValue === 0) {
    return `<span class="gray">—</span>`;
  }

  const isUp = trendValue > 0;
  return `
    <span class="${isUp ? "green" : "red"}">
      ${isUp ? "▲" : "▼"} ${Math.abs(trendValue)}
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
    <div class="tsw-fn5gl-region" role="tabpanel" aria-labelledby="${region}">
      <button type="button" class="tsw-fn5gl-region-accordion-button" aria-expanded=${region === currentRegion} data-map-region="${region.toLowerCase()}">${region}</button>
      <div class="tsw-fn5gl-region-list">
        <ul class="tsw-fn5gl-region-list-inner">${schoolRows || "No schools yet"}</ul>
      </div>
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
  const tooltip = document.querySelector(".tsw-tooltip");
  const region = target.dataset.mapRegion;

  // Build tooltip
  const rect = target.getBoundingClientRect();
  const containerRect = fn5glUSAMap.getBoundingClientRect();
  tooltip.innerHTML = `
    <p class="tsw-tooltip-state">${region}</p>
  `;

  // Position tooltip on map
  tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.bottom - containerRect.top - rect.height / 2}px`;
  // Determine whether tooltip should be active
  tooltip.classList.toggle("active", isHovering);
};

// =-=-=-=-=-=-=-=-=-=-=-
// Event listener helpers
// =-=-=-=-=-=-=-=-=-=-=-

const toggleRegionHighlight = (regionId, isHovering) => {
  if (regionId === currentRegion) return;

  const mapGroup = fn5glUSAMap.querySelector(`g[data-map-region="${regionId}"]`);
  // const tab = fn5glRegionTabs.querySelector(`button[aria-controls="${regionId}"]`);

  if (mapGroup) mapGroup.classList.toggle("hover", isHovering);
  // if (tab) tab.classList.toggle("hover", isHovering);
};

const setActiveRegion = (regionId) => {
  // Removes hover class so it doesn't get 'stuck'
  toggleRegionHighlight(regionId, false);

  currentRegion = regionId;

  const fn5glRegionAccordions = document.querySelectorAll(".tsw-fn5gl-region-accordion-button");
  fn5glRegionAccordions.forEach((accordion) => {
    console.log(accordion);
    accordion.setAttribute("aria-expanded", accordion.dataset.mapRegion === regionId);
  });

  // const allRegions = fn5glRegions.querySelectorAll('[role="tabpanel"]');
  // allRegions.forEach((panel) => {
  //   panel.hidden = panel.getAttribute("aria-labelledby") !== regionId;
  // });

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
});

// Clicking on map

fn5glUSAMap.addEventListener("click", (event) => {
  const group = event.target.closest("g[data-map-region]");
  if (!group || group.dataset.mapRegion === currentRegion) return;

  const newRegion = group.dataset.mapRegion;
  setActiveRegion(newRegion);
  updateRegionParam(newRegion);
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

// Clicking on region accordions

fn5glLeaderboard.addEventListener("click", (event) => {
  const accordionBtn = event.target.closest(".tsw-fn5gl-region-accordion-button");
  if (!accordionBtn) return;

  // const isExpanded = accordionBtn.getAttribute("aria-expanded") === "true";
  // accordionBtn.setAttribute("aria-expanded", String(!isExpanded));

  const newRegion = accordionBtn.dataset.mapRegion;
  setActiveRegion(newRegion);
  updateRegionParam(newRegion);
});

// Hover over region accordions

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

const initMap = () => {
  fn5glUSAMap.innerHTML = usaMapSVG;

  const allMapG = fn5glUSAMap.querySelectorAll("g");
  allMapG.forEach((g) => {
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
