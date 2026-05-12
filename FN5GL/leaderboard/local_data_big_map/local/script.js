// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Data sources and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Data sources
let schoolData;
let schoolDataPrevious;

// DOM references
const fn5glLeaderboard = document.querySelector(".tsw-fn5gl-leaderboard");
const fn5glLoader = document.querySelector(".tsw-fn5gl-loader");

// Region config
const REGIONS_ORDER = ["West", "Midwest", "South", "East"];

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
    <div class="tsw-fn5gl-region">
      <h3>${region}</h3>
      <ul class="tsw-fn5gl-region__list">${schoolRows || "No schools yet"}</ul>
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

  fn5glLeaderboard.innerHTML = allRegionsHTML;
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

const addVote = (id) => {
  const targetSchool = schoolData.find((school) => school.id === Number(id));
  targetSchool.votes += 1000;

  renderAllRegions();
};

// Event listener for vote buttons
fn5glLeaderboard.addEventListener("click", (event) => {
  const button = event.target.closest(".magenta-button");
  if (!button) return;

  const schoolId = button.dataset.voteId;
  addVote(schoolId);
});

// =-=-=-=
// On load
// =-=-=-=

const renderUI = (isLoading) => {
  if (isLoading) {
    fn5glLoader.classList.remove("hidden");
    fn5glLeaderboard.classList.add("hidden");
  }
  if (!isLoading && schoolData) {
    fn5glLoader.classList.add("hidden");
    fn5glLeaderboard.classList.remove("hidden");

    renderAllRegions();
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
