// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// DOM references
const fn5glContainer = document.querySelector(".tsw-fn5gl-container");
const fn5glFinalFour = document.querySelector(".tsw-fn5gl-finalfour");

const fn5glModal = document.querySelector(".tsw-modal");
const fn5glModalOverlay = document.querySelector(".tsw-modal-overlay");
const fn5glModalMain = document.querySelector(".tsw-modal-main");
const fn5glModalClose = document.querySelector(".tsw-modal-close");

// Global variables
const REGIONS_ORDER = ["West", "Midwest", "South", "East"];
let schoolData;

// Modal state
let modalState = {
  trigger: null,
  focusableElements: [],
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render final four school lists
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderRegion = (region, finalFourData, regionName) => {
  const schools = region
    .map((school) => {
      return `
      <li class="school-name">
        <div class="school-name-rank">${school.rank_current}</div>
        <div class="school-name-text">
          <div>${school.name}</div>
          <div class="gray">${school.city}, ${school.state}</div>
          <div class="gray">Total Votes: ${school.votes_phase_1.toLocaleString("en-US")}</div>
        </div>
      </li>
    `;
    })
    .join("");

  const regionChampion = finalFourData[regionName];
  const schoolName = regionChampion.name;
  const schoolBadge = `img/badge_${regionName.toLowerCase()}.png`;

  return `
    <div class="tsw-fn5gl-finalfour-region">
      <div class="tsw-fn5gl-finalfour-region-header">
        <h2>${regionName} <span class="subhead">Division Champion</span></h2>

        <div class="tsw-region-champion-badge" data-school-id="${regionChampion.id}">
          <img src="${schoolBadge}" alt="${schoolName}" />
          <div class="tsw-region-champion-badge-text">
            <h4>${schoolName}</h4>
            <p>${regionChampion.location}</p>
          </div>
        </div>

        <div class="tsw-region-champion-votes">Total Votes: ${regionChampion.votes.toLocaleString("en-US")}</div>             
      </div>

      <div class="tsw-fn5gl-finalfour-region-schools">
        <button type="button" class="tsw-fn5gl-accordion-button" aria-expanded="false">
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

const renderAllRegions = (accordionData, finalFourData) => {
  // Create new object that groups the schools by region
  const allRegionsHTML = REGIONS_ORDER.map((region) => {
    const sortedRegion = sortRegion(accordionData[region]);
    return sortedRegion ? renderRegion(sortedRegion, finalFourData, region) : "";
  }).join("");

  fn5glFinalFour.innerHTML = allRegionsHTML;
};

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

// Open/close accordions when window size changes

const DESKTOP_QUERY = "(min-width: 1000px)"; // match your CSS breakpoint
const desktopMql = window.matchMedia(DESKTOP_QUERY);

const syncAccordionExpanded = () => {
  fn5glFinalFour.querySelectorAll(".tsw-fn5gl-accordion-button").forEach((btn) => {
    btn.setAttribute("aria-expanded", String(desktopMql.matches));
  });
};

desktopMql.addEventListener("change", syncAccordionExpanded);

// =-=-=-=-=-=-=-
// Init functions
// =-=-=-=-=-=-=-

const CUTOFF = new Date("2026-11-08T23:59:00-08:00"); // Midnight PDT

const init = async () => {
  if (Date.now() < CUTOFF.getTime()) {
    // const apiData = await fetchData();
    // schoolData = apiData;

    renderAllRegions(accordionSchoolData, finalFourSchoolData);
    syncAccordionExpanded();
  } else {
    fn5glFinalFour.remove();
    fn5glModal.remove();
    fn5glModalOverlay.remove();
  }
};

init();
