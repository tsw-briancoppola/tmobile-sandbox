// =-=-=-=-=-=-=
// Page elements
// =-=-=-=-=-=-=

const mapContainer = document.querySelector(".tsw-map-usa-container");

// =-=-=-=-=-=-=
// Map variables
// =-=-=-=-=-=-=

const stateData = {};

// =-=-=-=-=-=
// Map actions
// =-=-=-=-=-=

const MONEY_INTERVAL = 1000;
const COLOR_COUNT = 6;

const updateClickedColor = (stateCode, money) => {
  const mapPaths = mapContainer.querySelectorAll("path");
  const path = [...mapPaths].find((path) => path.classList[1]?.split("_")[2] === stateCode);

  const rects = mapContainer.querySelectorAll("rect");
  const box = [...rects].find((path) => path.classList[1]?.split("_")[2] === stateCode);

  const colorLevel = money / MONEY_INTERVAL;

  if (path && colorLevel <= COLOR_COUNT) {
    path.classList.remove(`level-${money / MONEY_INTERVAL - 1}`);
    path.classList.add(`level-${money / MONEY_INTERVAL}`);
  }
  if (box && colorLevel < COLOR_COUNT) {
    box.classList.remove(`level-${money / MONEY_INTERVAL - 1}`);
    box.classList.add(`level-${money / MONEY_INTERVAL}`);
  }

  console.log(stateData);
};

const addMoney = (stateCode) => {
  stateData[stateCode] ? (stateData[stateCode] += MONEY_INTERVAL) : (stateData[stateCode] = MONEY_INTERVAL);
};

const handleHover = (stateCode, isHovering) => {
  const mapPaths = mapContainer.querySelectorAll("path");
  const path = [...mapPaths].find((p) => p.classList[1]?.split("_")[2] === stateCode);

  const calloutBoxes = mapContainer.querySelectorAll("rect");
  const box = [...calloutBoxes].find((b) => b.classList[1]?.split("_")[2] === stateCode);

  if (path) path.classList.toggle("hover", isHovering);
  if (box) box.classList.toggle("hover", isHovering);
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

modalOverlay.addEventListener("click", () => {
  closeModal();
});

modalCloseButton.addEventListener("click", () => {
  closeModal();
});

// =-=-=-=-=-=-=
// Modal content
// =-=-=-=-=-=-=

// const addContentToModal = (state) => {
//   const stateName = stateNames[state];

//   const modalHTML = `
//     <h3>State: ${stateName}</h3>
//   `;

//   modalMain.innerHTML = modalHTML;
// };

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Load map and set event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const initMap = () => {
  mapContainer.innerHTML = usaMapSVG;

  const mapPaths = mapContainer.querySelectorAll("path");
  const rects = mapContainer.querySelectorAll("rect");
  const calloutBoxes = [...rects].filter((path) => path.classList.contains("sm_rect"));
  const allMapElements = [...mapPaths, ...calloutBoxes];

  allMapElements.forEach((state) => {
    state.addEventListener("mouseover", (event) => {
      const stateCode = event.target.classList[1]?.split("_")[2];

      handleHover(stateCode, true);
    });

    state.addEventListener("mouseout", (event) => {
      const stateCode = event.target.classList[1]?.split("_")[2];

      handleHover(stateCode, false);
    });

    state.addEventListener("click", (event) => {
      const stateCode = event.target.classList[1].split("_")[2];

      addMoney(stateCode);
      updateClickedColor(stateCode, stateData[stateCode]);

      // openModal();
      // addContentToModal(stateAbbreviation);
    });
  });
};

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  initMap();
});
