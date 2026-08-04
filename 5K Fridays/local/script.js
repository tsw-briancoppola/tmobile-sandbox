// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/5k-fridays";
// const BEARER_TOKEN = "FzGJtOcibwWWQNU2";

// DOM references
const fiveKFridaysContainer = document.querySelector(".tsw-5kfriday-container");
const fiveKFridays = document.querySelector(".tsw-5kfriday");
const fiveKFridaysAccordionButtons = document.querySelectorAll(".tsw-5kfriday-accordion-button");

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render 5K Friday week/school functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const modifySchoolData = (school) => {
  const updatedSchool = school.name.replace(/High School$/, "HS");
  return { ...school, name: updatedSchool };
};

const renderWeek = (week, schools, totalWeeks) => {
  const schoolRows = schools
    .map((school) => {
      const modifiedSchool = modifySchoolData(school);

      return `
        <div class="tsw-5kfriday-school"><span class="bold">${modifiedSchool.name}</span> ${modifiedSchool.city}, ${modifiedSchool.state}
        </div>
      `;
    })
    .join("");

  return `
    <div class="tsw-5kfriday-week" role="tabpanel" aria-labelledby="">
      <button type="button" class="tsw-5kfriday-accordion-button" aria-expanded=${Number(week) === totalWeeks} data-map-region="">
        <span>Week ${week}</span>
        <svg width="24" height="24" aria-hidden="true">
          <use href="#tsw-5kfriday-caret-svg"/>
        </svg>
      </button>
      <div class="tsw-5kfriday-week-list">
        <ul class="tsw-5kfriday-week-list-inner">${schoolRows || "No schools yet"}</ul>
      </div>
    </div>
  `;
};

const renderAllWeeks = (apiData) => {
  const APIDataByWeek = Object.groupBy(apiData, ({ week }) => week);
  const totalWeeks = Object.keys(APIDataByWeek).length;
  let weeksHTML = "";

  Object.entries(APIDataByWeek)
    .reverse()
    .forEach(([week, schools]) => {
      schools.sort((a, b) => a.name.localeCompare(b.name));
      const weekHTML = renderWeek(week, schools, totalWeeks);
      weeksHTML += weekHTML;
    });

  fiveKFridays.innerHTML = weeksHTML;
};

// =-=-=-=-=-=-=-
// Event handlers
// =-=-=-=-=-=-=-

// Clicking on week accordion buttons

fiveKFridays.addEventListener("click", (event) => {
  const accordionBtn = event.target.closest(".tsw-5kfriday-accordion-button");
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
  const APIData = await fetchData();

  // console.log(APIData);

  renderAllWeeks(APIData);
};

init();
