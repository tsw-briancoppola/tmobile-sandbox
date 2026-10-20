// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/finalists/leaderboard/final_4";
const BEARER_TOKEN = "BRwrayCz7H1z3XJwMOpmnd9j";

// DOM references
const fn5glContainer = document.querySelector(".tsw-fn5gl-container");
const fn5glFinalFour = document.querySelector(".tsw-fn5gl-finalfour");

// Global variables
const REGIONS_ORDER = ["West", "Midwest", "South", "East"];

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render Final Four school lists
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderRegion = (region, apiData, regionName) => {
  const schools = region
    .map((school, index) => {
      return `
      <li class="school-name">
        <div class="school-name-rank">${school.rank_current}</div>
        <div class="school-name-text">
          <div>${school.name}</div>
          <div class="gray">${school.city}, ${school.state}</div>
          <div class="gray">Total Votes: ${school.votes_phase_1}</div>
        </div>

      </li>
    `;
    })
    .join("");

  const regionChampion = apiData.finalists.find((school) => school.region === regionName);
  const schoolName = regionChampion.name.replace(/High School/g, "H.S.");
  const schoolLockup = `img/lockup_${regionName.toLowerCase()}.png`;

  return `
    <div class="tsw-fn5gl-finalfour-region">
      <div class="tsw-fn5gl-finalfour-region-header">
        <h2>${regionName} <span class="subhead">Division</span></h2>

        <div class="tsw-region-champion-lockup">
          <img src="${schoolLockup}" alt="${schoolName}" />
          <div class="tsw-region-champion-lockup-text">
            <h4>${schoolName}</h4>
            <p>${regionChampion.city}, ${regionChampion.state}</p>
          </div>
        </div>

        <div class="tsw-region-champion-votes">Total Votes: ${regionChampion.votes_phase_2}</div>        
        <button type="button" class="magenta-button">Vote for this school</button>
      </div>

      <div class="tsw-fn5gl-finalfour-region-schools">
        <button type="button" class="tsw-fn5gl-accordion-button" aria-expanded="true">
          <span>${regionName} Division Finalists</span>
          <svg width="24" height="24" aria-hidden="true">
            <use href="#tsw-fn5gl-caret-svg"></use>
          </svg>
        </button>
        <div class="tsw-fn5gl-finalfour-region-school-names">
          <ol class="tsw-fn5gl-finalfour-region-school-names-inner">${schools || "No schools yet"}</ol>
        </div>
      </div>
    </div>
  `;
};

const sortRegion = (regionData) => {
  return regionData.sort((a, b) => (b.votes_phase_1 || 0) - (a.votes_phase_1 || 0));
};

const renderAllRegions = (apiData, accordionData) => {
  // Create new object that groups the schools by region
  const allRegionsHTML = REGIONS_ORDER.map((region) => {
    const sortedRegion = sortRegion(accordionData[region]);
    return sortedRegion ? renderRegion(sortedRegion, apiData, region) : "";
  }).join("");

  fn5glFinalFour.innerHTML = allRegionsHTML;
};

// =-=-=-=-=-=-=-
// Event handlers
// =-=-=-=-=-=-=-

// Clicking on week accordion buttons

fn5glFinalFour.addEventListener("click", (event) => {
  const accordionBtn = event.target.closest(".tsw-fn5gl-accordion-button");
  if (!accordionBtn) return;

  const isExpanded = accordionBtn.getAttribute("aria-expanded") === "true";
  accordionBtn.setAttribute("aria-expanded", String(!isExpanded));
});

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

    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

const init = async () => {
  const apiData = await fetchData();

  renderAllRegions(apiData, accordionSchoolData);
};

init();
