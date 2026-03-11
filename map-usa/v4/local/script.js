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
  const { code } = thisStateData;

  const elements = [
    mapUSA.querySelector(`path[class*="_${code}"]`),
    mapUSA.querySelector(`rect[class*="_${code}"]`),
    mapUSA.querySelector(`text[class*="_${code}"]`),
  ];

  const shouldHighlight = isHovering;

  elements.forEach((el) => {
    if (el) {
      el.classList.toggle("highlight", shouldHighlight);
    }
  });
};

const handleTooltip = (thisStateData, isHovering, event) => {
  // Return if screen width is less than 768px
  if (window.innerWidth < 768) return;

  const tooltip = document.querySelector(".tsw-tooltip");
  const { name } = thisStateData;

  // Build tooltip
  const rect = event.target.getBoundingClientRect();
  const mapContainer = document.querySelector(".tsw-map-usa");
  const containerRect = mapContainer.getBoundingClientRect();

  tooltip.innerHTML = `
    <p class="tsw-tooltip-state">${name}</p>
  `;

  // Position tooltip on map
  tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.bottom - containerRect.top}px`;
  tooltip.classList.toggle("is-rect", event.target.tagName === "rect");

  // Determine whether tooltip should be active
  const shouldBeActive = isHovering;
  tooltip.classList.toggle("active", shouldBeActive);

  handleStateHighlight(thisStateData, isHovering);
};

// =-=-=-=-=-=-=-=
// Modal functions
// =-=-=-=-=-=-=-=

// Modal elements and focus trapping

const modalOverlay = document.querySelector(".tsw-modal-overlay");
const modal = modalOverlay.querySelector(".tsw-modal");
const modalMain = modalOverlay.querySelector(".tsw-modal-main");

const closeButton = document.querySelector(".tsw-modal-close");

modal.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    closeButton.focus();
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
  let townsList = "No towns awarded";

  if (thisStateData.towns) {
    townsList = thisStateData.towns.join(", ");
  }

  const modalHTML = `
    <p><span class="tsw-modal-state">${thisStateData.name}</span></p>
    <p><span class="tsw-modal-header">Money spent:</span><br />
      ${formatMoney(thisStateData.grantAmount)}
    </p>
    <p><span class="tsw-modal-header">Total towns awarded:</span><br />
      ${thisStateData.townsAwarded}
    </p>
    <p><span class="tsw-modal-header">Towns awarded:</span><br />
      ${townsList}
    </p>
  `;

  modalMain.innerHTML = modalHTML;
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
    let townsList = "No towns awarded";

    if (selectedStateData.towns) {
      townsList = selectedStateData.towns.join(", ");
    }

    dropdownDataStateHTML = `
      <p><span class="tsw-dropdown-data-header">State:</span><br />${selectedStateData.name}</span></p>
      <p><span class="tsw-dropdown-data-header">Total grant amount:</span><br />${formatMoney(selectedStateData.grantAmount)}</p>
      <p><span class="tsw-dropdown-data-header">Total amount of towns awarded:</span><br />${selectedStateData.townsAwarded}</p>
      <p><span class="tsw-dropdown-data-header">Towns awarded:</span><br />${townsList}</p>
    `;
  }

  dropdownDataState.innerHTML = dropdownDataStateHTML;
};

const renderDropdown = () => {
  const dropdownDefault = `<option value="" disabled selected hidden>Select a state</option>`;

  const dropdownOptions = stateData
    .map((state) => {
      const shouldBeDisabled = state.grantAmount === 0;
      const disabledAttr = shouldBeDisabled ? "disabled" : "";
      return `<option value="${state.name}" ${disabledAttr}>${state.name}</option>`;
    })
    .join("");

  dropdown.innerHTML = dropdownDefault + dropdownOptions;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render map and dropdown on page load and set event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Helper to disable a state
const disableState = (thisStateData) => {
  const { code } = thisStateData;

  const elements = [
    mapUSA.querySelector(`path[class*="_${code}"]`),
    mapUSA.querySelector(`rect[class*="_${code}"]`),
    mapUSA.querySelector(`text[class*="_${code}"]`),
  ];

  elements.forEach((el) => {
    if (el) {
      el.classList.add("disabled");
      el.setAttribute("tabindex", -1);
    }
  });
};

const initMap = () => {
  mapUSA.innerHTML = usaMapSVG;
  const usaMapSVGHTML = mapUSA.querySelector("#tsw-usa-map-svg");

  const allPaths = mapUSA.querySelectorAll("path");
  const allRects = mapUSA.querySelectorAll("rect.sm_rect");
  const allMapElements = [...allPaths, ...allRects];

  const focusOverlay = document.createElementNS("http://www.w3.org/2000/svg", "g");
  focusOverlay.setAttribute("id", "focus-overlay");
  focusOverlay.setAttribute("pointer-events", "none");
  usaMapSVGHTML.appendChild(focusOverlay);

  // Set accessibility and tabbing for state paths
  allPaths.forEach((path) => {
    const stateCode = path.classList[1]?.split("_")[2];
    const thisStateData = stateData.find((s) => s.code === stateCode);

    path.setAttribute("tabindex", 0);
    path.setAttribute("role", "button");
    path.setAttribute("aria-label", thisStateData?.name ?? "");
  });

  // Map element listeners
  allMapElements.forEach((state) => {
    const stateCode = state.classList[1]?.split("_")[2];
    const thisStateData = stateData.find((s) => s.code === stateCode);

    if (thisStateData?.grantAmount === 0) {
      disableState(thisStateData);
      return;
    }

    state.addEventListener("mouseover", (e) => {
      handleTooltip(thisStateData, true, e);
    });

    state.addEventListener("mouseout", (e) => {
      handleTooltip(thisStateData, false, e);
    });

    // Open modal when state is clicked
    state.addEventListener("click", () => {
      console.log("click");
      // Return if screen width is less than 768px
      if (window.innerWidth < 768) return;

      openModal();
      addContentToModal(thisStateData);
    });

    state.addEventListener("focus", () => {
      focusOverlay.innerHTML = "";

      const clone = state.cloneNode(false);
      clone.removeAttribute("tabindex");
      clone.removeAttribute("role");
      clone.style.fill = "none";
      clone.style.stroke = "#005fcc";
      clone.style.strokeWidth = "3";
      clone.style.strokeLinejoin = "round";
      clone.style.pointerEvents = "none";
      clone.style.opacity = "1";

      focusOverlay.appendChild(clone);
    });
  });
};

const initDropdown = () => {
  renderDropdown();
  renderDropdownData();

  // Dropdown element listeners
  dropdown.addEventListener("change", (event) => {
    event.stopPropagation();
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

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Event listener for viewport changes
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const breakpoint = window.matchMedia("(min-width: 768px)");

breakpoint.addEventListener("change", (event) => {
  if (event.matches) {
    // Window is 768px or wider
    mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
  } else {
    // Window is narrower than 768px
  }
});

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  initMap();
  initDropdown();
});
