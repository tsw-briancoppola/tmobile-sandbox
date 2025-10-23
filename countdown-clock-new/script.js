/* 
timeZoneForTarget: String of time zone for target date. Default set to local.
urgencyInterval: Integer for number of days before target date when urgency alert kicks in. Default set to 1.
a11yAlertInterval: Integer between 0 - 60. Will be used to represent interval to alert users using a screen reader.
*/

/* =-=-=-=-=-=-=-=-=-=-=- */
/* Countdown clock object */
/* =-=-=-=-=-=-=-=-=-=-=- */

const CountDownClock = {
  countDownToThisTime: null,
  countDown: null,
  timeZoneForTarget: "local",
  urgencyInterval: 1,
  a11yAlertInterval: 10,
  init(seletedDateArg, timeZoneArg, urgencyIntervalArg, a11yAlertIntervalArg) {
    this.countDownEl = document.querySelector(".tsw-countdown");
    if (!this.countDownEl) {
      return;
    }
    if (a11yAlertIntervalArg !== undefined) {
      if (!Number.isInteger(a11yAlertIntervalArg)) {
        throw new Error("Argument is not a number");
      }
      this.a11yAlertInterval = a11yAlertIntervalArg;
    }
    this.timeZoneForTarget = timeZoneArg;
    this.urgencyInterval = urgencyIntervalArg;
    this.countDownToThisTime = this.setTimeZoneForTarget(seletedDateArg);
    this.countDown = this.startCountDown();
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
    if (secs % this.a11yAlertInterval !== 0) {
      a11yAlert.textContent = "Less than 24 hours to go!!!";
    } else {
      a11yAlert.textContent = "";
    }
    if (dys < this.urgencyInterval) {
      statusAlert.textContent = "Less than 24 hours to go!!!";
    } else {
      statusAlert.textContent = "";
    }
  },
  stopClock() {
    clearInterval(this.countDown);
    this.countDownToThisTime = null;
  },
};

/* =-=-=-=-=-=- */
/* State object */
/* =-=-=-=-=-=- */

const countdownState = {
  timeZone: "local",
  urgency: 1, // Number of days before target date/time
  a11yAlertInterval: 10,
};

/* =-=-=-=-=-=-= */
/* Date selector */
/* =-=-=-=-=-=-= */

const selectedDate = document.querySelector(".tsw-countdown-date");
const selectedDateSubmitButton = document.querySelector(".tsw-countdown-date-submit");

selectedDateSubmitButton.addEventListener("click", () => {
  const timeZone = countdownState.timeZone;

  if (!selectedDate.value) {
    alert("Target date not chosen. Select target date.");
  } else {
    const urgency = countdownState.urgency;
    const a11yAlertInterval = countdownState.a11yAlertInterval;
    CountDownClock.init(selectedDate.value, timeZone, urgency, a11yAlertInterval);
  }
});

/* =-=-=-=-=-=-=-=- */
/* Time zone toggle */
/* =-=-=-=-=-=-=-=- */

const timeZoneToggleButton = document.querySelector(".tsw-time-zone-toggle");
const timeZoneStatus = document.querySelector(".tsw-countdown-status-time-zone");

const updateTimeZone = (isInitialLoad = false) => {
  if (isInitialLoad) {
    countdownState.timeZone = "local";
    timeZoneToggleButton.textContent = "eastern";
  } else {
    timeZoneToggleButton.textContent = countdownState.timeZone;
    countdownState.timeZone = countdownState.timeZone === "local" ? "eastern" : "local";
  }

  timeZoneStatus.textContent = `Time zone of target: ${countdownState.timeZone}`;
};

timeZoneToggleButton.addEventListener("click", () => updateTimeZone(false));

updateTimeZone(true);

/* =-=-=-=-=-=- */
/* Theme toggle */
/* =-=-=-=-=-=- */

const themeToggleButton = document.querySelector(".tsw-theme-toggle");
const themeStatus = document.querySelector(".tsw-countdown-status-theme");

const setTheme = (theme) => {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-theme", isDark);
  localStorage.setItem("theme", theme);
  themeToggleButton.textContent = isDark ? "Light theme" : "Dark theme";
  themeStatus.textContent = `Current theme: ${isDark ? "Dark" : "Light"}`;
};

const setThemeOnLoad = () => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  setTheme(savedTheme || (prefersDark ? "dark" : "light"));
};

themeToggleButton.addEventListener("click", () => {
  localStorage.getItem("theme") === "dark" ? setTheme("light") : setTheme("dark");
});

setThemeOnLoad();
