// =-=-=-=-=-=-=
// Page elements
// =-=-=-=-=-=-=

const mapUSAContainer = document.querySelector(".tsw-map-usa-container");
const mapUSA = document.querySelector(".tsw-map-usa");

// =-=-=-=-=-=-=
// Map functions
// =-=-=-=-=-=-=

// Tooltip handler and format money helper function

const formatMoney = (money) => {
  const moneyWithDigits = money.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `$${moneyWithDigits}`;
};

// Hover handler for state and callout box colors

const handleStateHighlight = (thisStateData, isHovering) => {
  const { name, code } = thisStateData;

  const elements = [
    mapUSA.querySelector(`path[class*="_${code}"]`),
    mapUSA.querySelector(`rect[class*="_${code}"]`),
    mapUSA.querySelector(`text[class*="_${code}"]`),
  ];

  const shouldHighlight = isHovering || lockedStateName === name;

  elements.forEach((el) => {
    if (el) {
      el.classList.toggle("highlight", shouldHighlight);
    }
  });
};

// Tooltip state variables
let isTooltipLocked = false;
let lockedStateName = null;

const handleTooltip = (thisStateData, isHovering, event, isClick = false) => {
  // Return if screen width is less than 768px
  if (window.innerWidth < 768) return;

  const tooltip = document.querySelector(".tsw-tooltip");
  const tooltipContent = document.querySelector(".tsw-tooltip-content");

  const { name, grantAmount, townsAwarded } = thisStateData;

  if (isClick) {
    // Remove highlight color and 'clicked' class from all states
    mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
    mapUSA.querySelectorAll(".clicked").forEach((el) => el.classList.remove("clicked"));
    // If clicked state is same as current state, unlock it, otherwise lock it
    lockedStateName = lockedStateName === name ? null : name;
  } else {
    // Don't trigger tooltip if it's already locked
    if (lockedStateName && !isHovering) return;
    if (lockedStateName && lockedStateName !== name) return;
  }

  // Build tooltip
  const rect = event.target.getBoundingClientRect();
  const mapContainer = document.querySelector(".tsw-map-usa");
  const containerRect = mapContainer.getBoundingClientRect();

  tooltipContent.innerHTML = `
    <p class="tsw-tooltip-state">${name}</p>
    <p>Total grant amount:<br /><span class="tsw-tooltip-numbers">${formatMoney(grantAmount)}</span></p>
    <p>Towns awarded:<br /><span class="tsw-tooltip-numbers">${townsAwarded}</span></p>
  `;

  // Position tooltip on map
  tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.bottom - containerRect.top}px`;
  tooltip.classList.toggle("is-rect", event.target.tagName === "rect");

  // Determine whether tooltip should be active
  const shouldBeActive = isHovering || lockedStateName === name;
  tooltip.classList.toggle("active", shouldBeActive);

  // Determine whether tooltip is 'clicked' or not
  const isClicked = lockedStateName === name;
  tooltip.classList.toggle("clicked", isClicked);

  handleStateHighlight(thisStateData, isHovering);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=
// Mobile dropdown functions
// =-=-=-=-=-=-=-=-=-=-=-=-=

const dropdown = document.querySelector("#tsw-dropdown-select");
const dropdownDataState = document.querySelector(".tsw-dropdown-data-state");
const dropdownDataTotal = document.querySelector(".tsw-dropdown-data-total");

const renderDropdownData = (stateName) => {
  const selectedStateData = stateData?.find((state) => state.name === stateName);

  // Render selected state data
  let dropdownDataStateHTML = `<p>Please select a state to see grant data for that state.</p>`;

  if (selectedStateData) {
    dropdownDataStateHTML = `
      <p><span class="tsw-dropdown-data-header">State:</span><br />${selectedStateData.name}</span></p>
      <p><span class="tsw-dropdown-data-header">Total grant amount:</span><br />${formatMoney(selectedStateData.grantAmount)}</p>
      <p><span class="tsw-dropdown-data-header">Total amount of towns awarded:</span><br />${selectedStateData.townsAwarded}</p>
      <p><span class="tsw-dropdown-data-header">Towns awarded:</span><br />Banner Elk, Biltmore Forest, Black Mountain, Boiling Spring Lakes, Carolina Beach, Carolina Shores, Cedar Mountain, Chapel Hill, Connelly Springs, Elizabeth City, Fayetteville, Forest City, Fuquay-Varina, Hendersonville, Huntersville, Indian Trail, Jacksonville, Kernersville, Kill Devil Hills, Kings Mountain, Laurinburg, Morehead City, Morrisville, Southern Pines, Wrightsville Beach</p>
    `;
  }

  dropdownDataState.innerHTML = dropdownDataStateHTML;
};

const renderDropdown = () => {
  const dropdownDefault = `<option value="" disabled selected hidden>Select a state</option>`;

  const dropdownOptions = stateData
    .map((state) => {
      return `<option value="${state.name}">${state.name}</option>`;
    })
    .join("");

  dropdown.innerHTML = dropdownDefault + dropdownOptions;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render map and dropdown on page load and set event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Helper to close tooltip
const closeTooltip = () => {
  lockedStateName = null;
  document.querySelector(".tsw-tooltip").classList.remove("active");
  mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
  mapUSA.querySelectorAll(".clicked").forEach((el) => el.classList.remove("clicked"));
};

const initMap = () => {
  mapUSA.innerHTML = usaMapSVG;

  const allMapElements = [...mapUSA.querySelectorAll("path"), ...mapUSA.querySelectorAll("rect.sm_rect")];

  // Map element listeners
  allMapElements.forEach((state) => {
    const stateCode = state.classList[1]?.split("_")[2];
    const thisStateData = stateData.find((s) => s.code === stateCode);

    state.addEventListener("mouseover", (e) => {
      handleTooltip(thisStateData, true, e);
    });

    state.addEventListener("mouseout", (e) => {
      handleTooltip(thisStateData, false, e);
    });

    state.addEventListener("click", (e) => {
      handleTooltip(thisStateData, false, e, true);
    });
  });

  // Global listeners
  document.addEventListener("click", (event) => {
    const tooltip = document.querySelector(".tsw-tooltip");
    const isState = event.target.closest("path") || event.target.closest("rect.sm_rect");
    const isInsideTooltip = tooltip.contains(event.target);
    const isCloseBtn = event.target.closest(".tsw-tooltip-close-button");

    // Close tooltip if clicked the X button or clicked completely outside map/tooltip
    if (isCloseBtn || (!isState && !isInsideTooltip)) {
      closeTooltip();
    }
  });

  // Close tooltip if Esc key is clicked
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeTooltip();
  });
};

const initDropdown = () => {
  renderDropdown();
  renderDropdownData();

  // Dropdown element listeners
  dropdown.addEventListener("change", (event) => {
    const selectedName = event.target.value;
    renderDropdownData(selectedName);

    const selectedStateData = stateData.find((s) => s.name === selectedName);

    if (selectedStateData) {
      mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
      mapUSA.querySelectorAll(".clicked").forEach((el) => el.classList.remove("clicked"));

      lockedStateName = selectedName;

      handleStateHighlight(selectedStateData, true, true);
    }
  });
};

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  initMap();
  initDropdown();
});
