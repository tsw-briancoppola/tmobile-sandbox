const searchBox = document.querySelector(".tsw-hs-list-container .search input");
const list = document.querySelector(".tsw-hs-list");

// =-=-=-=-=-=-=-=-=-=
// Render data in list
// =-=-=-=-=-=-=-=-=-=

const createRow = (school) => {
  const dataRow = document.createElement("div");
  dataRow.classList.add("tsw-hs-list__row");
  const dataProperties = Object.keys(school);

  dataProperties.forEach((property) => {
    if (property !== "id") {
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
    }
  });

  return dataRow;
};

const renderData = (data) => {
  // Creating fragment for better performance
  const fragment = document.createDocumentFragment();

  data.forEach((school) => {
    const row = createRow(school);
    fragment.appendChild(row);
  });

  list.appendChild(fragment);
};

const clearData = () => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
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
    // Return true only if search value is contained in school's name or city
    const rowValues = [row.name, row.city];
    return rowValues.some((d) => d.toLowerCase().includes(value.toLowerCase()));
  });

  return filtered;
};

const updateRenderedData = (value) => {
  const filteredData = filterData(schoolData, value);
  clearData();
  renderData(filteredData);
};

// Set debounce to 200ms
const debouncedUpdate = debounce(updateRenderedData, 200);

searchBox.addEventListener("input", () => {
  debouncedUpdate(searchBox.value);
});

// =-=-=-=
// On load
// =-=-=-=

const init = () => {
  renderData(schoolData);
};

init();
