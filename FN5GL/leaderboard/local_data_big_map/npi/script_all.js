const highSchoolData = [
  {
    id: 0,
    name: "Generic H.S.",
    city: "Stufftown",
    state: "WA",
    region: "West",
    votes: 22000,
  },
  {
    id: 1,
    name: "Bigtime H.S.",
    city: "Gadgetville",
    state: "WA",
    region: "West",
    votes: 14283,
  },
  {
    id: 2,
    name: "Badass H.S.",
    city: "Itemburg",
    state: "WA",
    region: "West",
    votes: 17091,
  },
  {
    id: 3,
    name: "Standard H.S.",
    city: "Thing Creek",
    state: "WA",
    region: "West",
    votes: 10542,
  },
  {
    id: 4,
    name: "Typical H.S.",
    city: "Object City",
    state: "WA",
    region: "West",
    votes: 13219,
  },
  {
    id: 5,
    name: "Ordinary H.S.",
    city: "Article Junction",
    state: "WA",
    region: "West",
    votes: 9115,
  },
  {
    id: 6,
    name: "Common H.S.",
    city: "Material Falls",
    state: "WA",
    region: "West",
    votes: 12480,
  },
  {
    id: 7,
    name: "Mediocre H.S.",
    city: "Entity Springs",
    state: "WA",
    region: "West",
    votes: 14722,
  },
  {
    id: 8,
    name: "Regular H.S.",
    city: "Unit Village",
    state: "WA",
    region: "West",
    votes: 8933,
  },
  {
    id: 9,
    name: "Normal H.S.",
    city: "Piece Port",
    state: "WA",
    region: "West",
    votes: 11674,
  },
  {
    id: 10,
    name: "Dude H.S.",
    city: "Spiffytown",
    state: "MA",
    region: "East",
    votes: 12000,
  },
  {
    id: 11,
    name: "Spectacular H.S.",
    city: "Dapperburg",
    state: "MA",
    region: "East",
    votes: 14283,
  },
  {
    id: 12,
    name: "Awesome H.S.",
    city: "Snazzyville",
    state: "MA",
    region: "East",
    votes: 13091,
  },
  {
    id: 13,
    name: "Radical H.S.",
    city: "Posh Point",
    state: "MA",
    region: "East",
    votes: 9821,
  },
  {
    id: 14,
    name: "Excellent H.S.",
    city: "Nifty Heights",
    state: "MA",
    region: "East",
    votes: 12554,
  },
  {
    id: 15,
    name: "Tubular H.S.",
    city: "Classy Corner",
    state: "MA",
    region: "East",
    votes: 14109,
  },
  {
    id: 16,
    name: "Killer H.S.",
    city: "Swell Side",
    state: "MA",
    region: "East",
    votes: 8945,
  },
  {
    id: 17,
    name: "Gnarly H.S.",
    city: "Flashy Field",
    state: "MA",
    region: "East",
    votes: 13202,
  },
  {
    id: 18,
    name: "Superb H.S.",
    city: "Polished Park",
    state: "MA",
    region: "East",
    votes: 10776,
  },
  {
    id: 19,
    name: "Choice H.S.",
    city: "Chic Center",
    state: "MA",
    region: "East",
    votes: 12891,
  },
  {
    id: 20,
    name: "Dude H.S.",
    city: "Rockintown",
    state: "MI",
    region: "Midwest",
    votes: 14000,
  },
  {
    id: 21,
    name: "Sassy H.S.",
    city: "Jammingville",
    state: "MI",
    region: "Midwest",
    votes: 14283,
  },
  {
    id: 22,
    name: "Awesome H.S.",
    city: "Grooveburg",
    state: "MI",
    region: "Midwest",
    votes: 13091,
  },
  {
    id: 23,
    name: "Wicked H.S.",
    city: "Vibe Valley",
    state: "MI",
    region: "Midwest",
    votes: 11443,
  },
  {
    id: 24,
    name: "Prime H.S.",
    city: "Stellar Station",
    state: "MI",
    region: "Midwest",
    votes: 14605,
  },
  {
    id: 25,
    name: "Phat H.S.",
    city: "Bumping Bend",
    state: "MI",
    region: "Midwest",
    votes: 9231,
  },
  {
    id: 26,
    name: "Top-Tier H.S.",
    city: "Lively Lane",
    state: "MI",
    region: "Midwest",
    votes: 12988,
  },
  {
    id: 27,
    name: "Epic H.S.",
    city: "Electric Edge",
    state: "MI",
    region: "Midwest",
    votes: 10114,
  },
  {
    id: 28,
    name: "Classic H.S.",
    city: "Beating Bridge",
    state: "MI",
    region: "Midwest",
    votes: 13540,
  },
  {
    id: 29,
    name: "Solid H.S.",
    city: "Active Acres",
    state: "MI",
    region: "Midwest",
    votes: 11002,
  },
  {
    id: 30,
    name: "Dude H.S.",
    city: "Neatotown",
    state: "GA",
    region: "South",
    votes: 12000,
  },
  {
    id: 31,
    name: "Groovy H.S.",
    city: "Tidyton",
    state: "GA",
    region: "South",
    votes: 14283,
  },
  {
    id: 32,
    name: "Awesome H.S.",
    city: "Cleanville",
    state: "GA",
    region: "South",
    votes: 13091,
  },
  {
    id: 33,
    name: "Neat H.S.",
    city: "Trim Terrace",
    state: "GA",
    region: "South",
    votes: 14339,
  },
  {
    id: 34,
    name: "Fly H.S.",
    city: "Orderly Oasis",
    state: "GA",
    region: "South",
    votes: 11506,
  },
  {
    id: 35,
    name: "Sharp H.S.",
    city: "Smart Shore",
    state: "GA",
    region: "South",
    votes: 9422,
  },
  {
    id: 36,
    name: "Dope H.S.",
    city: "Spruce Summit",
    state: "GA",
    region: "South",
    votes: 12117,
  },
  {
    id: 37,
    name: "Swell H.S.",
    city: "Crisp Canyon",
    state: "GA",
    region: "South",
    votes: 13785,
  },
  {
    id: 38,
    name: "Boss H.S.",
    city: "Fresh Forest",
    state: "GA",
    region: "South",
    votes: 10459,
  },
  {
    id: 39,
    name: "Grand H.S.",
    city: "Prim Plains",
    state: "GA",
    region: "South",
    votes: 11890,
  },
];

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
