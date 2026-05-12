// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Data sources and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Data sources
let schoolData;
let schoolDataPrevious;

// DOM references
const fn5glWrapper = document.querySelector("#tsw-fn5gl-test").querySelector("xpr-npi-content").shadowRoot;
const fn5glLeaderboard = fn5glWrapper.querySelector(".tsw-fn5gl-leaderboard");
const fn5glBrackets = fn5glWrapper.querySelector(".tsw-fn5gl-brackets");
const fn5glLoader = fn5glWrapper.querySelector(".tsw-fn5gl-loader");

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

// =-=-=-=-=-=-=-=-=-=-=-=-
// Render bracket functions
// =-=-=-=-=-=-=-=-=-=-=-=-

const getRegionLeaders = (schools) => {
  const leaders = REGIONS_ORDER.map((region) => {
    const regionSchools = schools?.filter((school) => school.region === region) || {};
    if (regionSchools.length === 0) return {};

    return regionSchools.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
  });

  return leaders;
};

const getMatchWinner = (teamA, teamB) => {
  // If one team is missing, the other wins by default
  if (!teamA?.name) return teamB?.name ? teamB : null;
  if (!teamB?.name) return teamA;

  return teamA.votes >= teamB.votes ? teamA : teamB;
};

const renderBrackets = () => {
  const regionLeaders = getRegionLeaders(schoolData);

  const semi1 = [regionLeaders[0], regionLeaders[1]];
  const semi2 = [regionLeaders[2], regionLeaders[3]];

  const win1 = getMatchWinner(semi1[0], semi1[1]);
  const win2 = getMatchWinner(semi2[0], semi2[1]);

  const brackets = {
    semifinal1: semi1,
    semifinal2: semi2,
    final: [win1, win2],
  };

  const bracketMatchups = Object.entries(brackets)
    .map(([stage, teams]) => {
      const winner = getMatchWinner(teams[0], teams[1]);

      return `
      <div class="tsw-fn5gl-brackets-matchup ${stage}">
        <div class="tsw-fn5gl-brackets-school school1 ${teams[0] === winner && winner ? "bold" : ""}">
          <div>${teams[0]?.name || "TBD"}</div>
          <div>${teams[0]?.votes ?? ""}</div>
        </div>
        <div class="tsw-fn5gl-brackets-school school2 ${teams[1] === winner && winner ? "bold" : ""}">
          <div>${teams[1]?.name || "TBD"}</div>
          <div>${teams[1]?.votes ?? ""}</div>
        </div>
      </div>
      `;
    })
    .join("");

  fn5glBrackets.innerHTML = bracketMatchups;
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

const addVote = (id) => {
  const targetSchool = schoolData.find((school) => school.id === Number(id));
  targetSchool.votes += 1000;

  renderAllRegions();
  renderBrackets();
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
    renderBrackets();
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
