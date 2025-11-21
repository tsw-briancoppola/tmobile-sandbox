const searchBox = document.querySelector(".tsw-hs-list-container .search input");
const list = document.querySelector(".tsw-hs-list");

// =-=-=-=-=-=-=-=-=-=-=-=
// Populate list with data
// =-=-=-=-=-=-=-=-=-=-=-=

const createRow = (school) => {
  const dataRow = document.createElement("div");
  dataRow.classList.add("tsw-hs-list__row");
  const dataProperties = Object.keys(school);

  dataProperties.forEach((property) => {
    if (property !== "id") {
      const dataRowCell = document.createElement("div");
      const dataClassName = `tsw-hs-list__row--${property}`;
      dataRowCell.classList.add(dataClassName);
      dataRowCell.textContent = school[property];
      dataRow.appendChild(dataRowCell);
    }
  });

  return dataRow;
};

const addData = (data) => {
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

// =-=-=-=-=-
// Search box
// =-=-=-=-=-

const filterData = (data, value) => {
  const filtered = data.filter((row) => {
    // Return result only if search value is contained in school's name or city
    const rowValues = [row.name, row.city];
    return rowValues.some((d) => d.toLowerCase().includes(value.toLowerCase()));
  });

  return filtered;
};

const updateData = (value) => {
  const filteredData = filterData(schoolData, value);
  clearData();
  addData(filteredData);
};

searchBox.addEventListener("input", () => {
  updateData(searchBox.value);
});

// =-=-=-=
// On load
// =-=-=-=

const init = () => {
  addData(schoolData);
};

init();
