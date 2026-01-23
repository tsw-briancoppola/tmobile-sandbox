const fn5glLeaderboard = document.querySelector(".tsw-fn5gl-leaderboard");
const fn5glBrackets = document.querySelector(".tsw-fn5gl-brackets");

// Data sources
const DATA_SOURCE = highSchoolData;
const DATA_SOURCE_PREVIOUS = highSchoolDataPrevious;

// Set order of how regions are rendered
const regionsOrder = ["north", "south", "east", "west"];

// =-=-=-=-=-=-=-=-
// Render functions
// =-=-=-=-=-=-=-=-

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
  const schoolsSorted = [...schools].sort((a, b) => b.votes - a.votes);
  const schoolsPrevious = DATA_SOURCE_PREVIOUS.highSchoolsPrevious.filter((school) => school.region === region);
  const schoolsPreviousSorted = schoolsPrevious.sort((a, b) => b.votes - a.votes);

  const schoolRows = schoolsSorted
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
        <button type="button" class="magenta-button" data-vote-id="${school.id}">Vote</button>
      </li>
    `;
    })
    .join("");

  const capitalizedRegion = region.charAt(0).toUpperCase() + region.slice(1);

  return `
    <div class="tsw-fn5gl-region">
      <h3>${capitalizedRegion}</h3>
      <ul class="tsw-fn5gl-region__list">${schoolRows}</ul>
    </div>
  `;
};

const renderAllRegions = ({ highSchools }) => {
  const grouped = Object.groupBy(highSchools, (school) => school.region);

  const allRegionsHTML = regionsOrder
    .map((region) => {
      return grouped[region] ? renderRegion(region, grouped[region]) : "";
    })
    .join("");

  fn5glLeaderboard.innerHTML = allRegionsHTML;
};

const getRegionLeaders = (schools) => {
  const leaders = regionsOrder.map((region) => {
    const regionSchools = schools.filter((school) => school.region === region);
    return regionSchools.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
  });

  return leaders;
};

const renderBrackets = ({ highSchools }) => {
  const matchupNames = ["semifinal1", "semifinal2", "final"];
  const regionLeaders = getRegionLeaders(highSchools);

  const semifinalMatchups = matchupNames
    .map((matchup, index) => {
      return `
      <div class="tsw-fn5gl-brackets-matchup ${matchup}">
        <div class="tsw-fn5gl-brackets-school school1"></div>
        <div class="tsw-fn5gl-brackets-school school2">School2</div>
      </div>
    `;
    })
    .join("");

  fn5glBrackets.innerHTML = semifinalMatchups;
};

// =-=-=-=-=-=-=-=
// Event functions
// =-=-=-=-=-=-=-=

const addVote = (id) => {
  const targetSchool = DATA_SOURCE.highSchools.find((school) => school.id === id);
  targetSchool.votes += 1000;

  renderAllRegions(DATA_SOURCE, DATA_SOURCE_PREVIOUS);
  renderBrackets(DATA_SOURCE);
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

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

const init = () => {
  // const localStorageData = JSON.parse(localStorage.getItem("tsw-quiz-cyoa"));
  // if (localStorageData) quizState = localStorageData;

  renderAllRegions(DATA_SOURCE, DATA_SOURCE_PREVIOUS);
  renderBrackets(DATA_SOURCE);
};

init();
