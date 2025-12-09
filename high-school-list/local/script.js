const searchBox = document.querySelector("#tsw-hs-list-search");
const searchClearButton = document.querySelector(".tsw-hs-list-search-clear");
const list = document.querySelector(".tsw-hs-list");
const listEmpty = document.querySelector(".tsw-hs-list-empty");
const prevButton = document.querySelector(".tsw-pagination-prev");
const nextButton = document.querySelector(".tsw-pagination-next");

let currentPage = 0;
const itemsPerPage = 15;

// =-=-=-=-=-=-=-=-=-
// Pull data from API
// =-=-=-=-=-=-=-=-=-

const API_URL = "https://playground.mockoon.com/contacts";
let apiData = [];
let currentDataSet = []; // Subset of all data that passes search requirements

const fetchApiData = async () => {
  // const url = `${API_URL}?page=${currentPage}&limit=${itemsPerPage}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(response.headers);

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// =-=-=-=-=-=-=-=-=-=
// Render data in list
// =-=-=-=-=-=-=-=-=-=

const createRow = (school) => {
  const dataRow = document.createElement("div");
  dataRow.classList.add("tsw-hs-list__row");
  const dataProperties = Object.keys(school);

  dataProperties.forEach((property) => {
    const dataRowCell = document.createElement("div");
    const dataClassName = `tsw-hs-list__row--${property}`;
    dataRowCell.classList.add(dataClassName);
    if (property === "website") {
      const dataLink = document.createElement("a");
      dataLink.setAttribute("href", school[property]);
      dataLink.setAttribute("target", "_blank");
      dataLink.textContent = "School website";
      dataRowCell.appendChild(dataLink);
    } else {
      dataRowCell.textContent = school[property];
    }
    dataRow.appendChild(dataRowCell);
  });

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

  data.length === 0
    ? listEmpty.classList.add("active")
    : listEmpty.classList.remove("active");

  // Get current page slice of page data
  const startItem = currentPage * itemsPerPage;
  const endItem = startItem + itemsPerPage;
  const pageData = data.slice(startItem, endItem);

  pageData.forEach((school) => {
    const row = createRow(school);
    fragment.appendChild(row);
  });

  list.appendChild(fragment);
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

// =-=-=-=-=-
// Pagination
// =-=-=-=-=-

const updatePaginationButtons = () => {
  return null;
};

prevButton.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderData(currentDataSet);
    updatePaginationButtons(currentDataSet.length); // Update button states
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(currentDataSet.length / itemsPerPage);
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderData(currentDataSet);
    updatePaginationButtons(currentDataSet.length); // Update button states
  }
});

// =-=-=-=
// On load
// =-=-=-=

const init = async () => {
  const data = await fetchApiData();
  if (data) {
    // Convert pulled data to new data objects with desired properties
    const newDataArray = data.map(({ name, address, profilePicture }) => {
      let { city, state } = address ?? {};
      const website = profilePicture;
      state = stateAbbreviations[state];

      return { name, city, state, website };
    });

    // Set data size
    apiData = newDataArray.filter((_, index) => index < 40);
    currentDataSet = [...apiData];
    // Render data
    renderData(currentDataSet);
  }
};

init();
