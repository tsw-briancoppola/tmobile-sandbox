// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/verified-schools";
// const BEARER_TOKEN = "FzGJtOcibwWWQNU2";

let schoolData;
let schoolDataPrevious;

// DOM references
const appletvScrollContainer = document.querySelector(".tsw-appletv-scroll-container");
const appletvScroll = document.querySelector(".tsw-appletv-scroll");

// Global variable settings
const NUMBER_OF_ROWS = 2;
const rowColors = [
  ["blue", "green", "red", "orange", "magenta"],
  ["blue", "green", "red", "orange", "magenta"],
];

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render scrolling thumb row functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderRow = (colors) => {
  scrollRow = colors
    .map((color, index) => {
      return `
        <div class="tsw-appletv-scroll-box">${color}</div>
      `;
    })
    .join("");

  return `
    <div class="tsw-appletv-scroll-row">${scrollRow}</div>
  `;
};

const renderAllRows = () => {
  const allRowsHTML = rowColors
    .map((colors) => {
      return renderRow(colors);
    })
    .join("");

  appletvScroll.innerHTML = allRowsHTML;
};

// =-=-=-=-=-=-=-
// Init functions
// =-=-=-=-=-=-=-

/* Fetch data */

// const fetchData = async () => {
//   try {
//     const response = await fetch(DATA_SOURCE, {
//       method: "GET", // Default method
//       // headers: {
//       //   Authorization: `Bearer ${BEARER_TOKEN}`,
//       //   "Content-Type": "application/json",
//       // },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     // console.log(data);

//     return transformData(data);
//   } catch (error) {
//     console.error("Fetch failed:", error);
//     return null;
//   }
// };

const init = () => {
  renderAllRows();
};

init();
