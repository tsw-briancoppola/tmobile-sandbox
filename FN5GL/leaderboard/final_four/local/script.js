// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/finalists/leaderboard/final_4";
const BEARER_TOKEN = "BRwrayCz7H1z3XJwMOpmnd9j";

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
  const schoolBadge = `img/badge_${regionName.toLowerCase()}.png`;

  return `
    <div class="tsw-fn5gl-finalfour-region">
      <div class="tsw-fn5gl-finalfour-region-header">
        <h2>${regionName} <span class="subhead">Division</span></h2>

        <button type="button" class="tsw-region-champion-badge" data-school-id="${regionChampion.id}">
          <img src="${schoolBadge}" />
          <div class="tsw-region-champion-badge-text">
            <h4>${schoolName}</h4>
            <p>${regionChampion.city}, ${regionChampion.state}</p>
          </div>
        </button>

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

// =-=-=-=-=-=-=-=
// Modal functions
// =-=-=-=-=-=-=-=

// Modal functions and event listeners

const parseGameDateTime = (dateTimeString) => {
  if (!dateTimeString) {
    return { time: null, formattedDate: null, hasTime: false };
  }

  const [datePart, timePart] = dateTimeString.split(" ");
  const [year, month, day] = datePart.split("-");

  const formattedDate = `${month}/${day}/${year.slice(-2)}`;

  if (!timePart) {
    return { time: null, formattedDate, hasTime: false };
  }

  const [hour, minute] = timePart.split(":");
  const h = Number(hour);
  const time = `${h % 12 || 12}:${minute} ${h >= 12 ? "PM" : "AM"}`;

  return { time, formattedDate, hasTime: true };
};

const renderModal = (school) => {
  const { stadium_name, stadium_address, stadium_city, stadium_state, stadium_zip, datetime, timezone, description } =
    school.home_game;
  const cityState = `${stadium_city}, ${stadium_state}`;
  const { time, formattedDate } = parseGameDateTime(datetime);

  const fallbackImagePath = `/content/dam/digx/tmobile/us/en/creative_assethandoff/2026/q1/11043950_fn5gl-2026/phase-3/school-logos/`;
  const fallbackImageFilename = `FN5GL_${school.region}_${school.id}_${school.state}_logo.png`;
  const fallbackImageFullPath = fallbackImagePath + fallbackImageFilename;

  return `
    <div class="tsw-modal-school-header">
      <div class="tsw-modal-school-location">
        <p class="tsw-modal-school-city-state">${school.city}, ${school.state}</p>
        <h2 class="tsw-modal-school-name">${school.name}</h2>
      </div>
      <div class="tsw-modal-school-desc-logo">
        <p class="tsw-modal-school-description">${school.description}</p>
        <div class="tsw-modal-school-logo">
          <img src="${school.primary_logo ? school.primary_logo : fallbackImageFullPath}" alt="${school.name} logo" />
        </div>
      </div>
    </div>

    <div class="tsw-modal-school-stats">
      <div class="tsw-modal-school-stat">
        <span class="tsw-modal-school-stat-value">${school.rank_current}</span>
        <span class="tsw-modal-school-stat-label">Rank</span>
      </div>
      <div class="tsw-modal-school-stat">
        <span class="tsw-modal-school-stat-value">${school.votes_phase_1.toLocaleString("en-US")}</span>
        <span class="tsw-modal-school-stat-label">Total Votes</span>
      </div>
      <div>
        <a href="${school.voting_page_url}" class="tsw-modal-school-stat-button magenta-button">Vote for this school</a>
      </div>
    </div>

    <div class="tsw-modal-game">
      <div class="tsw-modal-game-header">
        <h3 class="tsw-modal-game-title">T-Mobile Home Game</h3>
        <p class="tsw-modal-game-description">
          ${description}
        </p>
      </div>
      <div class="tsw-modal-game-details">
        <div class="tsw-modal-game-detail">
          <span class="tsw-modal-game-detail-value">${time ? `${time} ${timezone}` : "TBD"}</span>
          <span class="tsw-modal-game-detail-label">Time</span>
        </div>
        <div class="tsw-modal-game-detail">
          <span class="tsw-modal-game-detail-value">${datetime ? formattedDate : "TBD"}</span>
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

  console.log(focusableElements);

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

// Open modal when high school name is clicked

fn5glFinalFour.addEventListener("click", (event) => {
  const link = event.target.closest(".tsw-region-champion-badge");
  if (!link) return;

  event.preventDefault();
  const thisSchoolId = link.dataset.schoolId;
  openModal(thisSchoolId, link);
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
  schoolData = apiData;

  renderAllRegions(apiData, accordionSchoolData);
};

init();
