// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Data sources and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const searchBox = document.querySelector("#tsw-hs-list-search");
const searchClearButton = document.querySelector(".tsw-hs-list-search-clear");
const list = document.querySelector(".tsw-hs-list");
const listEmpty = document.querySelector(".tsw-hs-list-empty");
const paginationContainer = document.querySelector(".tsw-hs-list-pagination");
const prevButton = document.querySelector(".tsw-pagination-prev");
const nextButton = document.querySelector(".tsw-pagination-next");
const paginationNumbersContainer = document.querySelector(".tsw-pagination-numbers");

const API_URL = "https://fn5gl.t-mobile.com/api/verified-schools";
let apiData = [];
let currentDataSet = []; // Subset of all data that passes search requirements

let currentPage = 0;
const ITEMS_PER_PAGE = 20;

// =-=-=-=-=-
// Pagination
// =-=-=-=-=-

const updatePaginationButtons = () => {
  const totalPages = Math.ceil(currentDataSet.length / ITEMS_PER_PAGE);

  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage >= totalPages - 1;
};

prevButton.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderData(currentDataSet);
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(currentDataSet.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderData(currentDataSet);
  }
});

// =-=-=-=-=-=-=-=-=-
// Pagination numbers
// =-=-=-=-=-=-=-=-=-

const createPaginationNumber = (index, text) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("tsw-pagination-number");

  if (index === currentPage) {
    button.classList.add("active");
    button.disabled = true; // Current page shouldn't be clickable
  } else {
    button.addEventListener("click", () => {
      currentPage = index;
      renderData(currentDataSet);
    });
  }

  paginationNumbersContainer.appendChild(button);
};

const createEllipsis = () => {
  const span = document.createElement("span");
  span.textContent = "...";
  span.classList.add("tsw-pagination-ellipsis");
  paginationNumbersContainer.appendChild(span);
};

const renderPaginationNumbers = () => {
  paginationNumbersContainer.innerHTML = "";

  const totalPages = Math.ceil(currentDataSet.length / ITEMS_PER_PAGE);

  // Hide pagination if there are less than 2 pages
  const shouldHidePagination = totalPages <= 1;
  paginationContainer.classList.toggle("is-hidden", shouldHidePagination);

  if (shouldHidePagination) {
    return;
  }

  const indexForThirdToLastPage = totalPages - 3;
  const isNearEnd = currentPage >= indexForThirdToLastPage;

  // Near the end
  if (isNearEnd) {
    let startIndex = Math.max(0, totalPages - 3);

    for (let i = startIndex; i < totalPages; i++) {
      createPaginationNumber(i, (i + 1).toString());
    }
  }
  // Middle pages
  else {
    const startPageIdx = currentPage;
    const endPageIdx = currentPage + 2;

    for (let i = startPageIdx; i <= endPageIdx; i++) {
      if (i >= totalPages - 1) break;
      createPaginationNumber(i, (i + 1).toString());
    }

    if (endPageIdx < totalPages - 1) {
      createEllipsis();
      // Add the very last page index
      createPaginationNumber(totalPages - 1, totalPages.toString());
    }
  }
};

// =-=-=-=-=-=-=-=-=-=
// Render data in list
// =-=-=-=-=-=-=-=-=-=

const createRow = (school) => {
  const dataRow = document.createElement("div");
  dataRow.classList.add("tsw-hs-list__row");

  dataRow.innerHTML = `
    <div>${school.name}</div>
    <div class="tsw-hs-list__row--mobile">
      ${school.city}, ${school.state}
    </div>
    <div class="tsw-hs-list__row--desktop">${school.city}</div>
    <div class="tsw-hs-list__row--desktop">${school.state}</div>
    <div>
      <a href="${school.school_website}" target="_blank">School website</a>
    </div>
  `;

  return dataRow;
};

const clearData = () => {
  list.innerHTML = "";
};

const renderData = (data) => {
  clearData();

  // Creating fragment for better performance
  const fragment = document.createDocumentFragment();

  // Toggle 'No results' notice based on data length
  listEmpty.classList.toggle("active", data.length === 0);

  // Get current page slice of page data
  const startItem = currentPage * ITEMS_PER_PAGE;
  const endItem = startItem + ITEMS_PER_PAGE;
  const pageData = data.slice(startItem, endItem);

  pageData.forEach((school) => {
    const row = createRow(school);
    fragment.appendChild(row);
  });

  list.appendChild(fragment);
  updatePaginationButtons();
  renderPaginationNumbers();
};

// =-=-=-=-=-=-=-=-=
// Debounce function
// =-=-=-=-=-=-=-=-=

const debounce = (func, delay = 200) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// =-=-=-=-=-=-=-=-=-=-=-=-
// Search box and filtering
// =-=-=-=-=-=-=-=-=-=-=-=-

const filterData = (data, value) => {
  const filtered = data.filter((row) => {
    // Return true only if search value is contained in school's name, city, or state
    const rowValues = [row.name, row.city, row.state];
    return rowValues.some((d) => d.toLowerCase().includes(value.toLowerCase()));
  });

  return filtered;
};

const updateRenderedData = (value) => {
  currentPage = 0; // Reset page to 0 when search terms change
  currentDataSet = filterData(apiData, value);
  renderData(currentDataSet);
};

// Set debounce to 200ms
const debouncedUpdate = debounce(updateRenderedData, 200);

// Toggle display of search box clear button
const searchClearButtonToggle = () => {
  searchBox.value ? (searchClearButton.style.display = "block") : (searchClearButton.style.display = "none");
};

// Event listener for search box
searchBox.addEventListener("input", () => {
  debouncedUpdate(searchBox.value);
  searchClearButtonToggle();
});

// Clear search box when clear button is clicked
searchClearButton.addEventListener("click", () => {
  searchBox.value = "";
  searchBox.focus();
  searchClearButtonToggle();
  updateRenderedData("");
});

// =-=-=-=-=-=-
// Toggle theme
// =-=-=-=-=-=-

const listContainer = document.querySelector(".tsw-hs-list-container");
const themeToggleButton = document.querySelector(".tsw-hs-list-theme-toggle");

themeToggleButton.addEventListener("click", () => {
  listContainer.classList.toggle("dark-theme");
});

// =-=-=-=-=-=-=-=-=-
// Pull data from API
// =-=-=-=-=-=-=-=-=-

const fetchApiData = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "get",
      headers: {
        Authorization: "Bearer jRB8Ger3aut7YN8I",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    data.sort((a, b) => a.name.localeCompare(b.name));

    apiData = [...data];
    currentDataSet = [...data];
    renderData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// =-=-=-=
// On load
// =-=-=-=

const init = async () => {
  fetchApiData();
};

init();
