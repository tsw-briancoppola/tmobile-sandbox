// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Page elements and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const mapUSAContainer = document.querySelector(".tsw-map-usa-container");
const mapUSA = document.querySelector(".tsw-map-usa");

let focusOverlay = null;
let lastFocusedState = null;

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

const tooltip = document.querySelector(".tsw-tooltip");

const handleTooltip = (thisStateData, isHovering, event) => {
  // Return if screen width is less than 768px
  if (window.innerWidth < 768) return;

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
modal.setAttribute("tabindex", "-1"); // Needed for focus trapping in Safari/Mac

const closeButton = document.querySelector(".tsw-modal-close");
closeButton.setAttribute("tabindex", "0"); // Needed for focus trapping in Safari/Mac

const focusableElements = [
  ...modal.querySelectorAll(`[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])`),
];

const first = focusableElements[0];
const last = focusableElements[focusableElements.length - 1];

modal.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
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
  if (focusOverlay) focusOverlay.innerHTML = "";

  if (lastFocusedState) {
    lastFocusedState.focus();
    lastFocusedState = null;
  }
};

modalOverlay.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
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
    <p><span class="tsw-modal-header">Total grant amount:</span><br />
      ${formatMoney(thisStateData.grantAmount)}
    </p>
    <p><span class="tsw-modal-header">Total awards:</span><br />
      ${thisStateData.totalAwards}
    </p>
    <p><span class="tsw-modal-header">Towns awarded:</span><br />
      ${townsList}
    </p>
  `;

  modalMain.innerHTML = modalHTML;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-
// Mobile combo box functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-

const comboBoxInput = document.querySelector("#tsw-combobox-select");
const comboBoxDatalist = document.querySelector("#tsw-combobox-datalist");
const comboBoxDataState = document.querySelector(".tsw-combobox-data-state");
const comboBoxDataStateIntro = `<p>Please select a state to see grant data for that state.</p>`;

const renderComboBoxData = (stateName) => {
  const selectedStateData = stateData?.find((state) => state.name === stateName);

  // Render selected state data
  let comboBoxDataStateHTML = comboBoxDataStateIntro;

  if (selectedStateData) {
    let townsList = "No towns awarded";

    if (selectedStateData.towns) {
      townsList = selectedStateData.towns.join(", ");
    }

    comboBoxDataStateHTML = `
      <p><span class="tsw-combobox-data-header">State:</span><br />${selectedStateData.name}</span></p>
      <p><span class="tsw-combobox-data-header">Total grant amount:</span><br />${formatMoney(selectedStateData.grantAmount)}</p>
      <p><span class="tsw-combobox-data-header">Total awards:</span><br />${selectedStateData.totalAwards}</p>
      <p><span class="tsw-combobox-data-header">Towns awarded:</span><br />${townsList}</p>
    `;
  }

  comboBoxDataState.innerHTML = comboBoxDataStateHTML;
};

const renderComboBox = () => {
  const dropdownDefault = `<option value="" disabled selected hidden>Select a state</option>`;

  const dropdownOptions = stateData
    .map((state) => {
      const shouldBeDisabled = state.grantAmount === 0;
      const disabledAttr = shouldBeDisabled ? "disabled" : "";
      return `<option value="${state.name}" ${disabledAttr}>${state.name}</option>`;
    })
    .join("");

  comboBoxDatalist.innerHTML = dropdownDefault + dropdownOptions;
};

// =-=-=-=-=-=-=-=-
// Helper functions
// =-=-=-=-=-=-=-=-

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

// =-=-=-=-=-=-=-=-=-=-=-
// Initialize map on load
// =-=-=-=-=-=-=-=-=-=-=-

const setStateFocus = () => {
  const isMobile = window.innerWidth <= 768;
  const allPaths = mapUSA.querySelectorAll("path");

  allPaths.forEach((path) => {
    if (isMobile) {
      path.setAttribute("tabindex", "-1");
      path.setAttribute("aria-hidden", "true");
      path.removeAttribute("role");
    } else {
      path.setAttribute("tabindex", "0");
      path.removeAttribute("aria-hidden");
      path.setAttribute("role", "button");
    }
  });
};

const initMap = () => {
  mapUSA.innerHTML = usaMapSVG;
  const usaMapSVGHTML = mapUSA.querySelector("#tsw-usa-map-svg");

  const allPaths = mapUSA.querySelectorAll("path");
  const allRects = mapUSA.querySelectorAll("rect.sm_rect");
  const allMapElements = [...allPaths, ...allRects];

  focusOverlay = document.createElementNS("http://www.w3.org/2000/svg", "g");
  focusOverlay.classList.add("tsw-focus-overlay");
  focusOverlay.setAttribute("pointer-events", "none");
  usaMapSVGHTML.appendChild(focusOverlay);

  // Set whether states should be focusable or not based on screen width
  setStateFocus();

  // Set accessibility and tabbing for state paths
  allPaths.forEach((path) => {
    const stateCode = path.classList[1]?.split("_")[2];
    const thisStateData = stateData.find((s) => s.code === stateCode);

    path.setAttribute("aria-label", thisStateData?.name ?? "");
  });

  // Set accessibility and tabbing for state rects (callout boxes)
  allRects.forEach((rect) => {
    const stateCode = rect.classList[1]?.split("_")[2];
    const thisStateData = stateData.find((s) => s.code === stateCode);

    rect.setAttribute("tabindex", -1);
    rect.setAttribute("role", "img");
    rect.setAttribute("aria-label", thisStateData?.name ?? "");
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
    state.addEventListener("click", (e) => {
      if (window.innerWidth < 768) return;
      if (state.tagName === "rect") {
        const correspondingPath = mapUSA.querySelector(`path[class*="_${stateCode}"]`);
        correspondingPath?.focus();
      }

      lastFocusedState = mapUSA.querySelector(`path[class*="_${stateCode}"]`);
      openModal();
      addContentToModal(thisStateData);
      handleTooltip(thisStateData, false, e);
    });

    // Open modal when focus is on state and return key is pressed
    state.addEventListener("keydown", (e) => {
      if (window.innerWidth < 768) return;
      if (e.key === "Enter") {
        lastFocusedState = state;
        openModal();
        addContentToModal(thisStateData);
        handleTooltip(thisStateData, false, e);
      }
    });

    // State element listener for focus - create clone of state with focus stroke
    state.addEventListener("focus", () => {
      if (window.innerWidth < 768) return;
      focusOverlay.innerHTML = "";

      const pathClone = state.cloneNode(false);
      pathClone.removeAttribute("tabindex");
      pathClone.removeAttribute("role");
      pathClone.removeAttribute("aria-label");
      pathClone.classList.add("tsw-focus-overlay-stroke");
      pathClone.classList.remove("highlight");
      focusOverlay.appendChild(pathClone);

      const correspondingRect = mapUSA.querySelector(`rect.sm_rect[class*=${stateCode}]`);
      if (correspondingRect) {
        const rectClone = correspondingRect.cloneNode(false);
        rectClone.removeAttribute("tabindex");
        rectClone.removeAttribute("role");
        rectClone.removeAttribute("aria-label");
        rectClone.classList.add("tsw-focus-overlay-stroke");
        pathClone.classList.remove("highlight");
        focusOverlay.appendChild(rectClone);
      }
    });
  });

  usaMapSVGHTML.addEventListener("focusout", (event) => {
    if (!usaMapSVGHTML.contains(event.relatedTarget)) {
      focusOverlay.innerHTML = "";
    }
  });
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Initialize combo box on load
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

const initDropdown = () => {
  renderComboBox();
  renderComboBoxData();

  // Dropdown event listeners

  const comboBoxCloseButton = document.querySelector(".tsw-combobox-close-button");

  // Handle when text in input box changes
  comboBoxInput.addEventListener("input", (event) => {
    const inputValue = event.target.value.toLowerCase();
    const options = stateData.filter((state) => state.grantAmount > 0).map((state) => state.name.toLowerCase());

    const hasMatch = options.some((state) => state.includes(inputValue));
    const shouldExpand = inputValue.length > 0 && hasMatch;

    comboBoxInput.setAttribute("aria-expanded", shouldExpand.toString());
    comboBoxCloseButton.classList.toggle("is-visible", inputValue.length > 0);
  });

  // Handle when input box is clicked
  comboBoxInput.addEventListener("click", () => {
    comboBoxInput.setAttribute("aria-expanded", "true");
  });

  // Handle when input box has focus
  comboBoxInput.addEventListener("focus", () => {
    if (comboBoxInput.value.length > 0) {
      comboBoxInput.setAttribute("aria-expanded", "true");
    }
  });

  // Handle when input box loses focus
  comboBoxInput.addEventListener("blur", () => {
    comboBoxInput.setAttribute("aria-expanded", "false");
  });

  // Handle when Escape key is pressed
  document.addEventListener("keyup", (event) => {
    if (event.key === "Escape" && document.activeElement === comboBoxInput) {
      comboBoxInput.setAttribute("aria-expanded", "false");
    }
  });

  // Handle when the clear input box button is checked
  comboBoxCloseButton.addEventListener("click", () => {
    comboBoxInput.value = ""; // Clear the text
    comboBoxInput.dispatchEvent(new Event("input")); // Trigger input event listener
    comboBoxInput.focus(); // Put the cursor back so the user can type immediately
    mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
    comboBoxDataState.innerHTML = comboBoxDataStateIntro;
  });

  // Handle when a state is selected or return key is pressed
  comboBoxInput.addEventListener("change", (event) => {
    event.stopPropagation();
    const selectedName = event.target.value;
    renderComboBoxData(selectedName);

    comboBoxInput.setAttribute("aria-expanded", "false");

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

const debounce = (func, wait) => {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), wait);
  };
};

const breakpoint = window.matchMedia("(min-width: 768px)");

const handleBreakpointChange = (event) => {
  mapUSA.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
  setStateFocus();

  // if (event.matches) {
  //   console.log("Desktop mode: Focus enabled");
  // } else {
  //   console.log("Mobile mode: Focus disabled");
  // }
};

const debouncedHandleChange = debounce(handleBreakpointChange, 250);
breakpoint.addEventListener("change", debouncedHandleChange);

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  initMap();
  initDropdown();
});
