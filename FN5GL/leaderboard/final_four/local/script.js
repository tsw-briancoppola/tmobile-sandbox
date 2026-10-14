// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const DATA_SOURCE = "https://fn5gl.t-mobile.com/api/finalists/leaderboard";
const BEARER_TOKEN = "BRwrayCz7H1z3XJwMOpmnd9j";

// DOM references
const fn5glContainer = document.querySelector(".tsw-fn5gl-container");
const fn5glFinalFour = document.querySelector(".tsw-fn5gl-finalfour");
// const fiveKFridays = document.querySelector(".tsw-5kfriday");
// const fiveKFridaysAccordionButtons = document.querySelectorAll(".tsw-5kfriday-accordion-button");

// Global variables
const REGIONS_ORDER = ["West", "Midwest", "South", "East"];

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render Final Four school lists
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderRegion = (region, regionName) => {
  const schools = region
    .map((school) => {
      return `
      <li class="">
        <div>${school.name}</div>
        <div>${school.city}, ${school.state}</div>
      </li>
    `;
    })
    .join("");

  const regionLockup = `img/lockup_${regionName.toLowerCase()}.png`;

  return `
    <div class="tsw-fn5gl-finalfour-region">
      <div class="tsw-fn5gl-finalfour-region-header">
        <h2>${regionName} <span class="subhead">Division</span></h2>
        <img src="${regionLockup}" alt="" />
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

const renderAllRegions = (schoolData) => {
  // Create new object that groups the schools by region
  const allRegionsHTML = REGIONS_ORDER.map((region) => {
    return schoolData[region] ? renderRegion(schoolData[region], region) : "";
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
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
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
  const APIData = await fetchData();

  // console.log(APIData);

  renderAllRegions(APIData);
};

init();
