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
  return money.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Hover handler for state and callout box colors

const handleStateHighlight = (thisStateData, isHovering) => {
  const { name, code } = thisStateData;

  // Find your elements (Paths, Rects, Text) using your existing logic
  const elements = [
    [...mapUSA.querySelectorAll("path")].find((p) => p.classList[1]?.split("_")[2] === code),
    [...mapUSA.querySelectorAll("rect")].find((b) => b.classList[1]?.split("_")[2] === code),
    [...mapUSA.querySelectorAll("text")].find((t) => t.classList[1]?.split("_")[2] === code),
  ];

  // If hovering OR if this is the locked state, add the class.
  const shouldHighlight = isHovering || lockedStateName === name;

  elements.forEach((el) => {
    if (el) el.classList.toggle("highlight", shouldHighlight);
  });
};

// Tooltip state variables
let isTooltipLocked = false;
let lockedStateName = null;

const handleTooltip = (thisStateData, isHovering, event, isClick = false) => {
  const tooltip = document.querySelector(".tsw-tooltip");
  const { name, grantAmount, townsAwarded } = thisStateData;

  if (isClick) {
    // Remove highlight color from all states
    mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
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

  tooltip.innerHTML = `
    <p class="tsw-tooltip-state">${name}</p>
    <p>Total grant amount:<br /><span class="tsw-tooltip-numbers">$${formatMoney(grantAmount)}</span></p>
    <p>Towns awarded:<br /><span class="tsw-tooltip-numbers">${townsAwarded}</span></p>
  `;

  // Position tooltip on map
  tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.bottom - containerRect.top}px`;
  tooltip.classList.toggle("is-rect", event.target.tagName === "rect");

  // Determine whether tooltip needs to be active
  const shouldBeActive = isHovering || lockedStateName === name;
  tooltip.classList.toggle("active", shouldBeActive);

  handleStateHighlight(thisStateData, isHovering);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=
// Mobile dropdown functions
// =-=-=-=-=-=-=-=-=-=-=-=-=

const dropdownContainer = document.querySelector(".tsw-dropdown-container");
const dropdown = document.querySelector("#tsw-dropdown");
const dropdownData = document.querySelector("#tsw-dropdown-data");

const renderDropdown = () => {
  const dropdownDefault = `<option value="" disabled selected hidden>Select a state</option>`;

  const dropdownOptions = stateData
    .map((state) => {
      return `<option value="${state.name}">${state.name}</option>`;
    })
    .join("");

  dropdown.innerHTML = dropdownDefault + dropdownOptions;
};

const renderDropdownData = () => {};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Render map and accordion on page load and set event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

mapUSA.innerHTML = usaMapSVG;

const mapPaths = mapUSA.querySelectorAll("path");
const rects = mapUSA.querySelectorAll("rect");
const calloutBoxes = [...rects].filter((path) => path.classList.contains("sm_rect"));
const allMapElements = [...mapPaths, ...calloutBoxes];

const initMap = () => {
  allMapElements.forEach((state) => {
    // Get state data from state code
    const stateCode = state.classList[1]?.split("_")[2];
    const thisStateData = stateData.find((s) => s.code === stateCode);

    // Hover states for states
    state.addEventListener("mouseover", (event) => {
      handleStateHighlight(thisStateData, true);
      handleTooltip(thisStateData, true, event);
    });

    state.addEventListener("mouseout", (event) => {
      handleStateHighlight(thisStateData, false);
      handleTooltip(thisStateData, false, event);
    });

    // Open tooltip when state is clicked
    state.addEventListener("click", (event) => {
      event.stopPropagation();
      handleTooltip(thisStateData, false, event, true);
    });

    // Close tooltip if any non-state location is clicked
    document.addEventListener("click", () => {
      lockedStateName = null;
      document.querySelector(".tsw-tooltip").classList.remove("active");
      mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
    });

    // Close tooltip with Esc key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        lockedStateName = null;
        document.querySelector(".tsw-tooltip").classList.remove("active");
        mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
      }
    });
  });
};

// Event listeners for all accordion buttons

const initDropdown = () => {
  renderDropdown();
};

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  initMap();
  initDropdown();
});
