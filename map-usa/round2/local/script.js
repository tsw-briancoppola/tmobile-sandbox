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

// =-=-=-=-=-=-=-=-=-=-=-=-=-
// Mobile accordion functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-

const accordionContainer = document.querySelector(".tsw-accordion-container");

// Render one accordion state link

const renderAccordionStateLink = (state) => {
  const stateItem = document.createElement("li");
  const stateItemButton = document.createElement("button");
  stateItemButton.setAttribute("type", "button");
  stateItemButton.textContent = state.name;

  stateItemButton.addEventListener("click", () => {
    openModal();
    addContentToModal(state);
  });

  stateItem.appendChild(stateItemButton);
  return stateItem;
};

// Render one accordion

const renderAccordion = (range, statesInRange) => {
  const accordionTemplate = document.querySelector("#tsw-accordion-template");
  const clone = accordionTemplate.content.cloneNode(true);

  const rangeId = `range-${range.replace(/\s+/g, "-")}`;
  const button = clone.querySelector(".tsw-accordion-header");

  button.setAttribute("id", `btn-${rangeId}`);
  button.setAttribute("aria-controls", `panel-${rangeId}`);
  button.setAttribute("aria-expanded", "false");

  const accordionContent = clone.querySelector(".tsw-accordion-content");
  const accordionInner = clone.querySelector(".tsw-accordion-content-inner");

  // Apply ID and initial state to the wrapper
  accordionContent.setAttribute("id", `panel-${rangeId}`);
  accordionContent.setAttribute("aria-labelledby", `btn-${rangeId}`);
  accordionContent.setAttribute("aria-hidden", "true"); // CSS uses this for animation

  clone.querySelector(".tsw-header-text").textContent = range;

  const stateList = document.createElement("ul");
  statesInRange.forEach((state) => {
    const stateLink = renderAccordionStateLink(state);
    stateList.appendChild(stateLink);
  });

  accordionInner.appendChild(stateList);
  return clone;
};

// Render all accordion groups

const renderAccordionGroup = () => {
  // Create object with states grouped by range
  const statesGrouped = Object.groupBy(stateData, (state) => {
    const firstLetter = state.name[0].toUpperCase();
    return Object.keys(STATE_RANGE_CONFIG).find((range) => STATE_RANGE_CONFIG[range].includes(firstLetter));
  });

  // Create accordion for each state range
  Object.keys(STATE_RANGE_CONFIG).forEach((range) => {
    const statesInRange = statesGrouped[range] || [];
    const accordion = renderAccordion(range, statesInRange);
    accordionContainer.appendChild(accordion);
  });
};

// =-=-=-=-=-=-=-=
// Modal functions
// =-=-=-=-=-=-=-=

// Modal elements and focus trapping

const modalOverlay = document.querySelector(".tsw-modal-overlay");
const modal = modalOverlay.querySelector(".tsw-modal");
const modalMain = modalOverlay.querySelector(".tsw-modal-main");
const modalFocusableElements = modal.querySelectorAll("button, input, select");

const modalFirstElement = modalFocusableElements[0];
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

// Modal functions and event listeners

const modalCloseButton = document.querySelector(".tsw-modal-close");

const openModal = () => {
  modalOverlay.classList.add("is-visible");
  modal.focus();
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

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Modal content

const addContentToModal = (thisStateData) => {
  const modalHTML = `
    <h3>${thisStateData.name}</h3>
    <p>Money spent:<br />
      <span class="tsw-modal-main-money">$${formatMoney(thisStateData.grantAmount)}</span>
    </p>
    <p>Total towns awarded:<br />
      <span class="tsw-modal-main-money">${thisStateData.townsAwarded}</span>
    </p>
  `;

  modalMain.innerHTML = modalHTML;
};

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

const initAccordionGroup = () => {
  accordionContainer.addEventListener("click", (event) => {
    const thisButton = event.target.closest(".tsw-accordion-header");
    if (!thisButton) return;

    const isExpanded = thisButton.getAttribute("aria-expanded") === "true";

    // Close other accordions, but only if user is trying to open this one
    if (!isExpanded) {
      const allButtons = accordionContainer.querySelectorAll(".tsw-accordion-header");
      allButtons.forEach((otherBtn) => {
        if (otherBtn !== thisButton) {
          otherBtn.setAttribute("aria-expanded", "false");
          const otherPanelId = otherBtn.getAttribute("aria-controls");
          document.getElementById(otherPanelId).setAttribute("aria-hidden", "true");
        }
      });
    }

    const panelId = thisButton.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);

    // Toggle logic
    thisButton.setAttribute("aria-expanded", !isExpanded);
    panel.setAttribute("aria-hidden", isExpanded); // CSS targets this for the transition
  });

  renderAccordionGroup();
};

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  initMap();
  initAccordionGroup();
});
