const searchBox = document.querySelector("#tsw-hs-list-search");
const searchClearButton = document.querySelector(".tsw-hs-list-search-clear");
const list = document.querySelector(".tsw-hs-list");
const listEmpty = document.querySelector(".tsw-hs-list-empty");
const paginationContainer = document.querySelector(".tsw-hs-list-pagination");
const prevButton = document.querySelector(".tsw-pagination-prev");
const nextButton = document.querySelector(".tsw-pagination-next");
const paginationNumbersContainer = document.querySelector(
  ".tsw-pagination-numbers"
);

let currentPage = 0;
const itemsPerPage = 10;

// =-=-=-=-=-=-=-=-=-
// Pull data from API
// =-=-=-=-=-=-=-=-=-

const API_URL = "https://playground.mockoon.com/contacts";
let apiData = [];
let currentDataSet = []; // Subset of all data that passes search requirements

const fetchApiData = async () => {
  // const url = `${API_URL}?page=${currentPage}&limit=${itemsPerPage}`;

  try {
    const response = await fetch("./data/mock_data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// =-=-=-=-=-
// Pagination
// =-=-=-=-=-

const updatePaginationButtons = () => {
  const totalPages = Math.ceil(currentDataSet.length / itemsPerPage);

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
  const totalPages = Math.ceil(currentDataSet.length / itemsPerPage);
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

  const totalPages = Math.ceil(currentDataSet.length / itemsPerPage);

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
    <div class="tsw-hs-list__row--name">${school.name}</div>
    <div class="tsw-hs-list__row--city">${school.city}</div>
    <div class="tsw-hs-list__row--state">${school.state}</div>
    <div class="tsw-hs-list__row--website">
      <a href="${school.website}" target="_blank">School website</a>
    </div>
  `;

  return dataRow;
};

const clearData = () => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

const renderData = (data) => {
  clearData();

  // Creating fragment for better performance
  const fragment = document.createDocumentFragment();

  // Toggle 'No results' notice based on data length
  listEmpty.classList.toggle("active", data.length === 0);

  // Get current page slice of page data
  const startItem = currentPage * itemsPerPage;
  const endItem = startItem + itemsPerPage;
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
  searchBox.value
    ? (searchClearButton.style.display = "block")
    : (searchClearButton.style.display = "none");
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

// =-=-=-=
// On load
// =-=-=-=

const init = async () => {
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // Use the following code when an API is known:
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  // const data = await fetchApiData();
  // if (data) {
  //   // Convert pulled data to new data objects with desired properties
  //   const newDataArray = data.map(({ name, address, profilePicture }) => {
  //     let { city, state } = address ?? {};
  //     const website = profilePicture;
  //     state = stateAbbreviations[state];
  //     return { name, city, state, website };
  //   });
  //   // Set data size
  //   apiData = newDataArray.filter((_, index) => index < 40);
  //   currentDataSet = [...apiData];
  //   // Render data
  //   renderData(currentDataSet);
  // }

  const newDataArray = mockData.map(({ name, city, state, website }) => {
    return { name, city, state, website };
  });

  apiData = newDataArray.filter((_, index) => index < 31);
  currentDataSet = [...apiData];
  // Render data
  renderData(currentDataSet);
};

init();
