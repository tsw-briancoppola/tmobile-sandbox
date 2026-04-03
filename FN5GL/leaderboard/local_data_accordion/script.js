// Data sources
const DATA_SOURCE = highSchoolData;
const DATA_SOURCE_PREVIOUS = highSchoolDataPrevious;

// DOM references
const fn5glLeaderboard = document.querySelector(".tsw-fn5gl-leaderboard");
const fn5glBrackets = document.querySelector(".tsw-fn5gl-brackets");

// Region config
const REGIONS_ORDER = ["north", "south", "east", "west"];

// =-=-=-=
// Helpers
// =-=-=-=

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getMatchWinner = (team1, team2) => (team1.votes >= team2.votes ? team1 : team2);

// =-=-=-=-=
// Data prep
// =-=-=-=-=

const groupAllRegions = ({ highSchools }) =>
  Object.groupBy(highSchools, (school) => school.region);

// =-=-=-=-=-=-=-=-
// Render functions
// =-=-=-=-=-=-=-=-

const renderTrend = (trendValue) => {
  if (trendValue === 0) return `<span class="gray">—</span>`;
  const isUp = trendValue > 0;
  return `<span class="${isUp ? "green" : "red"}">${isUp ? "▲" : "▼"} ${Math.abs(trendValue)}</span>`;
};

const renderRegion = (region, schools) => {
  const schoolsSorted = [...schools].sort((a, b) => b.votes - a.votes);

  const previousSchools = DATA_SOURCE_PREVIOUS.highSchoolsPrevious.filter(
    (school) => school.region === region
  );
  const previousSorted = [...previousSchools].sort((a, b) => b.votes - a.votes);
  const previousRankMap = new Map(previousSorted.map((school, i) => [school.id, i]));

  const schoolRows = schoolsSorted
    .map((school, currentRank) => {
      const previousRank = previousRankMap.get(school.id) ?? currentRank;
      const trendValue = previousRank - currentRank;

      return `
        <li class="tsw-fn5gl-region-row">
          <div class="tsw-fn5gl-region-rank">${currentRank + 1}</div>
          <div class="tsw-fn5gl-region-info">
            <div class="tsw-fn5gl-region-school">${school.name}</div>
            <div class="tsw-fn5gl-region-location">${school.city}, ${school.state}</div>
          </div>
          <div class="tsw-fn5gl-region-votes">${school.votes.toLocaleString("en-US")}</div>
          <div class="tsw-fn5gl-region-trend">${renderTrend(trendValue)}</div>
          <button type="button" class="magenta-button" data-vote-id="${school.id}">Vote</button>
        </li>`;
    })
    .join("");

  return `
    <div class="tsw-fn5gl-region" data-region="${region}" data-expanded="false">
      <h3>${capitalize(region)}</h3>
      <div class="tsw-fn5gl-region-accordion">
        <ul class="tsw-fn5gl-region-accordion-inner">${schoolRows}</ul>
      </div>
      ${schoolsSorted.length > 3 ? `<button type="button" class="tsw-region-accordion">See more</button>` : ""}
    </div>`;
};

const renderAllRegions = ({ highSchools }) => {
  const schoolsByRegion = groupAllRegions({ highSchools });

  fn5glLeaderboard.innerHTML = REGIONS_ORDER
    .map((region) => (schoolsByRegion[region] ? renderRegion(region, schoolsByRegion[region]) : ""))
    .join("");
};

const getRegionLeaders = (highSchools) =>
  REGIONS_ORDER.map((region) => {
    const regionSchools = highSchools.filter((school) => school.region === region);
    return regionSchools.reduce((prev, current) => (prev.votes > current.votes ? prev : current));
  });

const renderBrackets = ({ highSchools }) => {
  const [north, south, east, west] = getRegionLeaders(highSchools);

  const semifinal1Winner = getMatchWinner(north, south);
  const semifinal2Winner = getMatchWinner(east, west);
  const finalWinner = getMatchWinner(semifinal1Winner, semifinal2Winner);

  const matchups = [
    { stage: "semifinal1", teams: [north, south], winner: semifinal1Winner },
    { stage: "semifinal2", teams: [east, west], winner: semifinal2Winner },
    { stage: "final", teams: [semifinal1Winner, semifinal2Winner], winner: finalWinner },
  ];

  fn5glBrackets.innerHTML = matchups
    .map(({ stage, teams: [team1, team2], winner }) => `
      <div class="tsw-fn5gl-brackets-matchup ${stage}">
        <div class="tsw-fn5gl-brackets-school school1 ${team1 === winner ? "bold" : ""}">
          <div>${team1?.name || "TBD"}</div>
          <div>${team1?.votes || ""}</div>
        </div>
        <div class="tsw-fn5gl-brackets-school school2 ${team2 === winner ? "bold" : ""}">
          <div>${team2?.name || "TBD"}</div>
          <div>${team2?.votes || ""}</div>
        </div>
      </div>`)
    .join("");
};

// =-=-=-=
// Actions
// =-=-=-=

const addVote = (id) => {
  const targetSchool = DATA_SOURCE.highSchools.find((school) => school.id === id);
  targetSchool.votes += 1000;
  renderAllRegions(DATA_SOURCE);
  renderBrackets(DATA_SOURCE);
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

fn5glLeaderboard.addEventListener("click", (event) => {
  const button = event.target.closest(".magenta-button");
  if (!button) return;
  addVote(button.dataset.voteId);
});

fn5glLeaderboard.addEventListener("click", (event) => {
  const accordionBtn = event.target.closest(".tsw-region-accordion");
  if (!accordionBtn) return;

  const regionDiv = accordionBtn.closest(".tsw-fn5gl-region");
  const isExpanded = regionDiv.dataset.expanded === "true";
  regionDiv.dataset.expanded = String(!isExpanded);
  accordionBtn.textContent = isExpanded ? "See more" : "See less";
});

// =-=-
// Init
// =-=-

const init = () => {
  renderAllRegions(DATA_SOURCE);
  renderBrackets(DATA_SOURCE);
};

init();
