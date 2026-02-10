// =-=-=-=-=-=-=
// Page elements
// =-=-=-=-=-=-=

const mapContainer = document.querySelector(".tsw-map-usa-container");

// =-=-=-=-
// Map data
// =-=-=-=-

const stateData = {
  IN: 1000,
  KS: 3000,
  OK: 4000,
  ID: 4000,
  NC: 2000,
  IL: 5000,
  SD: 1000,
  NM: 2000,
  WY: 4000,
  PA: 2000,
  KY: 1000,
  IA: 2000,
  MS: 2000,
  MO: 1000,
  VT: 1000,
  MA: 2000,
  CT: 3000,
  MD: 1000,
  DC: 5000,
  NY: 4000,
  UT: 1000,
  NV: 1000,
  CA: 4000,
  OR: 2000,
  WA: 6000,
  MT: 1000,
  CO: 5000,
  TX: 2000,
  AR: 2000,
  AL: 1000,
  GA: 5000,
  TN: 3000,
  WI: 4000,
  MI: 3000,
  MN: 5000,
  NE: 2000,
  LA: 4000,
  FL: 2000,
  WV: 1000,
  OH: 4000,
  AZ: 1000,
  SC: 1000,
  ME: 1000,
};

// =-=-=-=-=-=
// Map actions
// =-=-=-=-=-=

const COLOR_COUNT = 6;
const MONEY_INTERVAL = 1000;

const updateStateColor = (state) => {
  const stateCode = state.classList[1]?.split("_")[2];
  // Update state color if state is in data object
  if (stateData[stateCode]) {
    state.classList.add(`level-${stateData[stateCode] / MONEY_INTERVAL}`);
  }
};

const handleHover = (stateCode, isHovering) => {
  const mapPaths = mapContainer.querySelectorAll("path");
  const path = [...mapPaths].find((p) => p.classList[1]?.split("_")[2] === stateCode);

  const calloutBoxes = mapContainer.querySelectorAll("rect");
  const box = [...calloutBoxes].find((b) => b.classList[1]?.split("_")[2] === stateCode);

  const mapStateCodes = mapContainer.querySelectorAll("text");
  const mapStateCode = [...mapStateCodes].find((p) => p.classList[1]?.split("_")[2] === stateCode);

  if (path) path.classList.toggle("hover", isHovering);
  if (box) box.classList.toggle("hover", isHovering);
  if (mapStateCode) mapStateCode.classList.toggle("hover", isHovering);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modal elements and focus trapping
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const modalOverlay = document.querySelector(".tsw-modal-overlay");
const modal = modalOverlay.querySelector(".tsw-modal");
const modalMain = modalOverlay.querySelector(".tsw-modal-main");
const modalFocusableElements = modal.querySelectorAll("button, input, select");

const modalFirstElement = modalFocusableElements[0];
const modalSecondElement = modalFocusableElements[1];
const modalLastElement = modalFocusableElements[modalFocusableElements.length - 1];

modal.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    if (event.shiftKey) {
      if (document.activeElement === modalFirstElement) {
        modalLastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === modalLastElement) {
        modalFirstElement.focus();
        event.preventDefault();
      }
    }
  }
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modal functions and event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const modalCloseButton = document.querySelector(".tsw-modal-close");

const openModal = () => {
  modalOverlay.classList.add("is-visible");
};

const closeModal = () => {
  modalOverlay.classList.remove("is-visible");
};

modalOverlay.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    closeModal(); // Only runs if you click the overlay, not the modal itself
  }
});

modalCloseButton.addEventListener("click", () => {
  closeModal();
});

// =-=-=-=-=-=-=
// Modal content
// =-=-=-=-=-=-=

const addContentToModal = (state) => {
  const stateName = stateNames[state];
  const stateMoney = stateData[state] || 0;

  const modalHTML = `
    <h3>State: ${stateName}</h3>
    <p>Money spent: $${stateMoney}</p>
  `;

  modalMain.innerHTML = modalHTML;
};

// =-=-=-=
// Tooltip
// =-=-=-=

const handleTooltip = (state, isHovering, event) => {
  const bbox = event.target.getBBox();
  const centerX = bbox.x + bbox.width / 2;
  const centerY = bbox.y + bbox.height / 2;

  const tooltip = document.querySelector(".tsw-tooltip");

  const stateName = stateNames[state];
  const tooltipHTML = `
    <p>${stateName}</p>
  `;
  tooltip.innerHTML = tooltipHTML;

  tooltip.style.left = `${centerX - 10}px`;
  tooltip.style.top = `${centerY + 120}px`;

  tooltip.classList.toggle("active", isHovering);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Render map on page load and set event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const initMap = () => {
  mapContainer.innerHTML = usaMapSVG;

  const mapPaths = mapContainer.querySelectorAll("path");
  const rects = mapContainer.querySelectorAll("rect");
  const calloutBoxes = [...rects].filter((path) => path.classList.contains("sm_rect"));
  const allMapElements = [...mapPaths, ...calloutBoxes];

  allMapElements.forEach((state) => {
    // Update the color for each state based on money amount
    updateStateColor(state);

    // Hover states for states
    state.addEventListener("mouseover", (event) => {
      const stateCode = event.target.classList[1]?.split("_")[2];

      handleHover(stateCode, true);
      handleTooltip(stateCode, true, event);
    });

    state.addEventListener("mouseout", (event) => {
      const stateCode = event.target.classList[1]?.split("_")[2];

      handleHover(stateCode, false);
      handleTooltip(stateCode, false, event);
    });

    // Open modal when state is clicked
    state.addEventListener("click", (event) => {
      const stateCode = event.target.classList[1].split("_")[2];

      openModal();
      addContentToModal(stateCode);
    });
  });
};

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  initMap();
});
