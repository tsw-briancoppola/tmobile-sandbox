// Data sources
const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/verified-schools";
// const DATA_SOURCE_PREVIOUS = highSchoolDataPrevious;
let schoolData;

// DOM references
const fn5glWrapper = document.querySelector("#tsw-fn5gl-test").querySelector("xpr-npi-content").shadowRoot;
const fn5glLeaderboard = fn5glWrapper.querySelector(".tsw-fn5gl-leaderboard");
const fn5glBrackets = fn5glWrapper.querySelector(".tsw-fn5gl-brackets");
const fn5glLoader = fn5glWrapper.querySelector(".tsw-fn5gl-loader");

// Region config
const REGIONS_ORDER = ["North", "South", "East", "West"];

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

    schoolRows = schoolsSorted
      .map((school, index) => {
        return `
        <li class="tsw-fn5gl-region-row">
          <div class="tsw-fn5gl-region-rank">${index + 1}</div>
          <div class="tsw-fn5gl-region-info">
            <div class="tsw-fn5gl-region-school">${school.name}</div>
            <div class="tsw-fn5gl-region-location">${school.city}, ${school.state}</div>
          </div>
          <div class="tsw-fn5gl-region-votes">${school.votes.toLocaleString("en-US")}</div>
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

const renderAllRegions = (highSchools) => {
  const grouped = Object.groupBy(highSchools, (school) => school.region);

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
    const regionSchools = schools.filter((school) => school.region === region);
    return regionSchools.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
  });

  return leaders;
};

const getMatchWinner = (team1, team2) => {
  return team1.votes >= team2.votes ? team1 : team2;
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

const addVote = (id) => {
  const targetSchool = schoolData.find((school) => school.id === Number(id));
  targetSchool.votes += 1000;

  renderAllRegions(schoolData);
  // renderBrackets(DATA_SOURCE);
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
    fn5glBrackets.classList.add("hidden");

    setTimeout(() => {
      console.log("Executed after 2 seconds");
    }, 2000);
  }
  if (!isLoading && schoolData) {
    fn5glLoader.classList.add("hidden");
    fn5glLeaderboard.classList.remove("hidden");
    // fn5glBrackets.classList.remove("hidden");
    renderAllRegions(schoolData);
  }
};

// Pull data from API
const fetchData = async (url) => {
  try {
    let isLoading = true;
    renderUI(isLoading);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    schoolData = updateSchoolData(data);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setTimeout(() => {
      isLoading = false;
      renderUI(isLoading);
    }, 2000);
  }
};

const init = () => {
  fetchData(DATA_SOURCE);

  // renderBrackets(DATA_SOURCE);
};

init();
