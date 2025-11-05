/* 
timeZoneForTarget: String of time zone for target date. Default set to local.
urgencyInterval: Integer for number of days before target date when urgency alert kicks in. Default set to 1.
a11yAlertInterval: Integer between 0 - 60. Will be used to represent interval to alert users using a screen reader.
*/

// =-=-=-=-=-=-=-=-=-=-=-
// Countdown clock object
// =-=-=-=-=-=-=-=-=-=-=-

const CountDownClock = {
  countDownToThisTime: null,
  countDown: null,
  timeZoneForTarget: "local",
  theme: "light",
  urgencyInterval: 1,
  a11yAlertInterval: 10,
  init(selectedDateArg, timeZoneArg, placementArg, themeArg, urgencyIntervalArg, a11yAlertIntervalArg) {
    // this.countDownWrapper = document.querySelector("#tsw-countdown-id").querySelector("xpr-npi-content");
    // this.countDownEl = this.countDownWrapper.shadowRoot.querySelector(".tsw-countdown");

    this.countDownEl = document.querySelector(".tsw-countdown");
    if (!this.countDownEl) return;
    if (a11yAlertIntervalArg !== undefined) {
      if (!Number.isInteger(a11yAlertIntervalArg)) {
        throw new Error("Argument is not a number");
      }
      this.a11yAlertInterval = a11yAlertIntervalArg;
    }
    this.placement = placementArg;
    this.timeZoneForTarget = timeZoneArg;
    this.theme = themeArg;
    this.urgencyInterval = urgencyIntervalArg;
    this.selectedDate = selectedDateArg;
    this.setPlacement(this.placement);
    this.countDownToThisTime = this.setTimeZoneForTarget(selectedDateArg);
    this.setTheme(this.theme);
    this.countDown = this.startCountDown();
  },
  setPlacement(placement) {
    this.countDownEl.setAttribute("tsw-placement", placement);
  },
  setTimeZoneForTarget(date) {
    if (this.timeZoneForTarget === "eastern") {
      // Set time zone of input date/time using Luxon DateTime object
      const overrideZone = luxon.DateTime.fromISO(date, { zone: "America/New_York" });
      // Convert back to local time and to a Date object using Luxon's toJSDate() method
      return overrideZone.toJSDate();
    } else {
      return new Date(date);
    }
  },
  setTheme(theme) {
    theme === "dark" ? this.countDownEl.classList.add("dark-theme") : this.countDownEl.classList.remove("dark-theme");
  },
  startCountDown() {
    return setInterval(() => {
      const secondsLeft = (this.countDownToThisTime - Date.now()) / 1000;
      if (secondsLeft < 0) {
        this.stopClock();
      }
      this.setView(secondsLeft);
    }, 1000);
  },
  setView(seconds) {
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
    if (dys < this.a11yAlertInterval) {
      a11yAlert.textContent = "Less than 24 hours to go!!!";
    } else {
      a11yAlert.textContent = "";
    }
    if (dys < this.urgencyInterval) {
      statusWrapper.style.display = "block";
      statusAlert.textContent = "Less than 24 hours to go!!!";
    } else {
      statusWrapper.style.display = "none";
      statusAlert.textContent = "";
    }
  },
  stopClock() {
    clearInterval(this.countDown);
    this.countDownToThisTime = null;
  },
};

const dateTimeInput = document.querySelector(".tsw-countdown-date");

window.addEventListener("load", () => {
  // Generate default ISO string for 24 hours from now with Luxon DateTime object
  const today = luxon.DateTime.local();
  const tomorrow = today.plus({ days: 1 });
  const formattedResult = tomorrow.toFormat("yyyy-MM-dd'T'HH:mm");
  dateTimeInput.value = formattedResult;
  CountDownClock.init(formattedResult, "local", "card", "light", 1, 30);
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Modal and overlay event listeners
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// const countdownWrapper = document.querySelector("#tsw-countdown-id").querySelector("xpr-npi-content").shadowRoot;
// const countdownEditButton = countdownWrapper.querySelector(".tsw-countdown-edit");
// const modalOverlay = countdownWrapper.querySelector(".tsw-modal-overlay");

const countdownEditButton = document.querySelector(".tsw-countdown-edit");
const modalOverlay = document.querySelector(".tsw-modal-overlay");
const dropdownPlacement = document.querySelector("#tsw-dropdown-placement");
const dropdownTimeZone = document.querySelector("#tsw-dropdown-time-zone");
const dropdownTheme = document.querySelector("#tsw-dropdown-theme");

// Open modal
countdownEditButton.addEventListener("click", () => {
  // Pre-populate modal fields and dropdowns with current clock state
  dateTimeInput.value = CountDownClock.selectedDate;
  dropdownTheme.value = CountDownClock.theme;
  dropdownTimeZone.value = CountDownClock.timeZoneForTarget;
  // Open modal
  modalOverlay.classList.add("is-visible");
});

// Close modal
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove("is-visible");
  }
});

// Change placement
dropdownPlacement.addEventListener("change", (event) => {
  CountDownClock.placement = event.target.value;
  CountDownClock.setPlacement(event.target.value);
});

// Change target date
dateTimeInput.addEventListener("change", (event) => {
  const newDateTime = event.target.value;

  if (!newDateTime) return;

  const selectedTime = CountDownClock.setTimeZoneForTarget(newDateTime);
  if (selectedTime < Date.now()) {
    alert("Please select a future date and time");
    dateTimeInput.value = CountDownClock.selectedDate;
    return;
  }

  clearInterval(CountDownClock.countDown);
  CountDownClock.selectedDate = newDateTime;
  CountDownClock.countDownToThisTime = selectedTime;

  CountDownClock.countDown = CountDownClock.startCountDown();
});

// Change time zone
dropdownTimeZone.addEventListener("change", (event) => {
  CountDownClock.timeZoneForTarget = event.target.value;
  clearInterval(CountDownClock.countDown);
  CountDownClock.countDownToThisTime = CountDownClock.setTimeZoneForTarget(CountDownClock.selectedDate);
  CountDownClock.startCountDown();
});

// Change theme
dropdownTheme.addEventListener("change", (event) => {
  CountDownClock.theme = event.target.value;
  CountDownClock.setTheme(event.target.value);
});
