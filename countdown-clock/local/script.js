// =-=-=-=-=-=-=-=-=-=-=
// Countdown clock class
// =-=-=-=-=-=-=-=-=-=-=

class CountDownClock {
  constructor(
    containerDOMArg,
    selectedDateArg,
    timeZoneArg,
    placementArg,
    themeArg,
    urgencyIntervalArg,
    a11yAlertIntervalArg
  ) {
    this.countDownDOM = containerDOMArg; // Specific container for this instance
    this.countDownEl = containerDOMArg.querySelector(".tsw-countdown");

    if (!this.countDownEl) {
      console.error("Countdown element not found within this container:", containerEl);
      return;
    }

    this.countDownToThisTime = null;
    this.countDown = null;
    this.placement = placementArg || "card";
    this.timeZoneForTarget = timeZoneArg || "local";
    this.theme = themeArg || "light";
    this.urgencyInterval = urgencyIntervalArg !== undefined ? urgencyIntervalArg : 1;
    this.a11yAlertInterval = a11yAlertIntervalArg !== undefined ? a11yAlertIntervalArg : 10;
    this.selectedDate = selectedDateArg;

    this.init();
  }

  init() {
    if (!Number.isInteger(this.a11yAlertInterval)) {
      throw new Error("a11yAlertInterval is not a number");
    }

    this.setPlacement(this.placement);
    this.countDownToThisTime = this.setTimeZoneForTarget(this.selectedDate);
    this.setTheme(this.theme);
    this.countDown = this.startCountDown();
  }

  setPlacement(placement) {
    this.countDownEl.setAttribute("tsw-placement", placement);
  }

  setTimeZoneForTarget(date) {
    // Set time zone of input date/time using Luxon DateTime object
    if (this.timeZoneForTarget === "eastern" && typeof luxon !== "undefined") {
      const overrideZone = luxon.DateTime.fromISO(date, { zone: "America/New_York" });
      return overrideZone.toJSDate();
    } else {
      return new Date(date);
    }
  }

  setTheme(theme) {
    this.countDownEl.classList.remove("dark-theme");
    this.countDownEl.classList.remove("magenta-theme");

    if (theme === "dark") this.countDownEl.classList.add("dark-theme");
    if (theme === "magenta") this.countDownEl.classList.add("magenta-theme");
  }

  startCountDown() {
    return setInterval(() => {
      const secondsLeft = (this.countDownToThisTime - Date.now()) / 1000;
      if (secondsLeft < 0) {
        this.stopClock();
      }
      this.setView(secondsLeft);
    }, 1000);
  }

  setView(seconds) {
    // Use the instance's specific countDownEl to find children
    const displayDays = this.countDownEl.querySelector(".tsw-countdown-days");
    const displayHours = this.countDownEl.querySelector(".tsw-countdown-hours");
    const displayMinutes = this.countDownEl.querySelector(".tsw-countdown-minutes");
    const displaySeconds = this.countDownEl.querySelector(".tsw-countdown-seconds");
    const statusWrapper = this.countDownEl.querySelector(".tsw-countdown-status");
    const statusAlert = this.countDownEl.querySelector(".tsw-countdown-status-alert");
    const a11yAlert = this.countDownEl.querySelector("#tsw-countdown-a11y-alert");

    const secs = Math.floor(seconds % 60);
    const mins = Math.floor((seconds / 60) % 60);
    const hrs = Math.floor((seconds / (60 * 60)) % 24);
    const dys = Math.floor(seconds / (60 * 60 * 24));

    displaySeconds.textContent = secs > 0 ? (secs < 10 ? "0" + secs : secs) : "00";
    displayMinutes.textContent = mins > 0 ? (mins < 10 ? "0" + mins : mins) : "00";
    displayHours.textContent = hrs > 0 ? (hrs < 10 ? "0" + hrs : hrs) : "00";
    displayDays.textContent = dys > 0 ? (dys < 10 ? "0" + dys : dys) : "00";

    if (a11yAlert && dys < this.a11yAlertInterval) {
      a11yAlert.textContent = "Less than " + this.a11yAlertInterval + " days to go!";
    } else if (a11yAlert) {
      a11yAlert.textContent = "";
    }

    if (statusWrapper && dys < this.urgencyInterval) {
      statusWrapper.style.display = "block";
      const daysText = this.urgencyInterval === 1 ? "day" : "days";
      statusAlert.textContent = `Less than ${this.urgencyInterval} ${daysText} to go!`;
    } else if (statusWrapper) {
      statusWrapper.style.display = "none";
      statusAlert.textContent = "";
    }
  }

  stopClock() {
    clearInterval(this.countDown);
    this.countDownToThisTime = null;
    console.log("Clock stopped for container:", this.countDownDOM.id);
  }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Start instance of clock on page load
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const clockInstanceDOM = document.querySelector("#container--1");
let clockInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  // Generate default ISO string for 24 hours from now with Luxon DateTime object
  const today = luxon.DateTime.local();
  const tomorrow = today.plus({ days: 1 });
  const formattedResult = tomorrow.toFormat("yyyy-MM-dd'T'HH:mm");

  // Create instance of clock
  clockInstance = new CountDownClock(clockInstanceDOM, formattedResult, "local", "card", "light", 1, 30);
});

// =-=-=-=-=-=-=-=-=-=-
// Modal focus trapping
// =-=-=-=-=-=-=-=-=-=-

const modal = clockInstanceDOM.querySelector(".tsw-modal");
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

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modal and overlay event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const countdownEditButton = clockInstanceDOM.querySelector(".tsw-countdown-edit");
const modalOverlay = clockInstanceDOM.querySelector(".tsw-modal-overlay");
const modalClose = clockInstanceDOM.querySelector(".tsw-modal-close");
const dateTimeInput = clockInstanceDOM.querySelector(".tsw-countdown-date");
const dropdownPlacement = clockInstanceDOM.querySelector(".tsw-dropdown-placement");
const dropdownTimeZone = clockInstanceDOM.querySelector(".tsw-dropdown-time-zone");
const dropdownTheme = clockInstanceDOM.querySelector(".tsw-dropdown-theme");

// Open modal
countdownEditButton.addEventListener("click", () => {
  // Pre-populate modal fields and dropdowns with current clock state
  dateTimeInput.value = clockInstance.selectedDate;
  dropdownTheme.value = clockInstance.theme;
  dropdownTimeZone.value = clockInstance.timeZoneForTarget;
  // Open modal
  modalOverlay.classList.add("is-visible");
  // Add focus to first element in modal
  modalSecondElement.focus();
});

// Close modal by clicking close button
modalClose.addEventListener("click", () => {
  modalOverlay.classList.remove("is-visible");
});

// Close modal by clicking overlay
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove("is-visible");
  }
});

// Close modal with Esc key
modalOverlay.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modalOverlay.classList.remove("is-visible");
  }
});

// Change placement
dropdownPlacement.addEventListener("change", (event) => {
  clockInstance.placement = event.target.value;
  clockInstance.setPlacement(event.target.value);
});

// Change target date
dateTimeInput.addEventListener("change", (event) => {
  const newDateTime = event.target.value;

  if (!newDateTime) return;

  const selectedTime = clockInstance.setTimeZoneForTarget(newDateTime);
  if (selectedTime < Date.now()) {
    alert("Please select a future date and time");
    dateTimeInput.value = clockInstance.selectedDate;
    return;
  }

  clearInterval(clockInstance.countDown);
  clockInstance.selectedDate = newDateTime;
  clockInstance.countDownToThisTime = selectedTime;

  clockInstance.countDown = clockInstance.startCountDown();
});

// Change time zone
dropdownTimeZone.addEventListener("change", (event) => {
  clockInstance.timeZoneForTarget = event.target.value;
  clearInterval(clockInstance.countDown);
  clockInstance.countDownToThisTime = clockInstance.setTimeZoneForTarget(clockInstance.selectedDate);
  clockInstance.startCountDown();
});

// Change theme
dropdownTheme.addEventListener("change", (event) => {
  clockInstance.theme = event.target.value;
  clockInstance.setTheme(event.target.value);
});
