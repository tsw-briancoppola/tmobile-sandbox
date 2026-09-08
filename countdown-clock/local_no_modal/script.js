// =-=-=-=-=-=-=-=-=-=-=
// Countdown clock class
// =-=-=-=-=-=-=-=-=-=-=

class CountDownClock {
  constructor(
    containerDOMArg,
    targetDateArg,
    timeZoneArg,
    placementArg,
    themeArg,
    urgencyIntervalArg,
    a11yAlertIntervalArg,
    headerMessage,
    headerEndMessage,
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
    this.targetDate = targetDateArg;
    this.headerMessage = headerMessage;
    this.headerEndMessage = headerEndMessage;

    this.init();
  }

  init() {
    if (!Number.isInteger(this.a11yAlertInterval)) {
      throw new Error("a11yAlertInterval is not a number");
    }

    this.setPlacement(this.placement);
    this.countDownToThisTime = this.setTimeZoneForTarget(this.targetDate);
    this.setTheme(this.theme);
    this.countDown = this.startCountDown();
  }

  setPlacement(placement) {
    this.countDownEl.setAttribute("tsw-placement", placement);
  }

  setTimeZoneForTarget(date) {
    // Set time zone of input date/time using Luxon DateTime object
    const zoneMap = {
      eastern: "America/New_York",
      pacific: "America/Los_Angeles",
    };
    const zone = zoneMap[this.timeZoneForTarget];

    if (zone && typeof luxon !== "undefined") {
      const overrideZone = luxon.DateTime.fromISO(date, { zone });
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
    const headerText = this.countDownEl.querySelector(".tsw-countdown-header");
    const displayDays = this.countDownEl.querySelector(".tsw-countdown-days");
    const displayHours = this.countDownEl.querySelector(".tsw-countdown-hours");
    const displayMinutes = this.countDownEl.querySelector(".tsw-countdown-minutes");
    const displaySeconds = this.countDownEl.querySelector(".tsw-countdown-seconds");
    const urgencyAlert = this.countDownEl.querySelector(".tsw-countdown-urgency-alert");
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

    if (seconds < 0) {
      headerText.innerHTML = this.headerEndMessage;
      urgencyAlert.style.display = "none";
    } else if (urgencyAlert && dys < this.urgencyInterval) {
      headerText.innerHTML = this.headerMessage;
      urgencyAlert.style.display = "block";
      const daysText = dys + 1 === 1 ? "day" : "days";
      const hoursText = hrs + 1 === 1 ? "hour" : "hours";
      if (dys < 1) {
        urgencyAlert.textContent = `Less than ${hrs + 1} ${hoursText} to go!`;
      } else {
        urgencyAlert.textContent = `Less than ${dys + 1} ${daysText} to go!`;
      }
    } else if (urgencyAlert) {
      headerText.innerHTML = this.headerMessage;
      urgencyAlert.style.display = "none";
      urgencyAlert.textContent = "";
    }
  }

  stopClock() {
    const countdownClock = this.countDownEl.querySelector(".tsw-countdown-clock");

    clearInterval(this.countDown);
    this.countDownToThisTime = null;

    console.log("Clock stopped for container:", this.countDownDOM.id);
  }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Start instance of clock on page load
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const TARGET_TIME_ZONE = "pacific";
const TARGET_DATE = "2026-09-18T23:59"; // Fixed target date/time, ISO format (yyyy-MM-dd'T'HH:mm)
const URGENCY_INTERVAL = 7; // Number of days to target date/time
const HEADER_MESSAGE = "Don't wait! The application period ends Sept.&#160;18.";
const HEADER_END_MESSAGE = "Applications are now closed. Check&#160;back Oct. 8 for the 40 Division&#160;Finalists!";

const clockInstanceDOM = document.querySelector("#container--1");
let clockInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  // Generate default ISO string for 24 hours from now with Luxon DateTime object
  // const today = luxon.DateTime.local();
  // const tomorrow = today.plus({ days: 0 });
  // const formattedResult = tomorrow.toFormat("yyyy-MM-dd'T'HH:mm");

  // Create instance of clock
  clockInstance = new CountDownClock(
    clockInstanceDOM,
    TARGET_DATE,
    TARGET_TIME_ZONE,
    "card",
    "light",
    URGENCY_INTERVAL,
    URGENCY_INTERVAL,
    HEADER_MESSAGE,
    HEADER_END_MESSAGE,
  );
});

// CountDownClock parameters:
//
// 1) The DOM of the clock instance
// 2) The formatted target date and time
// 3) Set target time to fixed time or relative to user time zone (local, eastern, etc.)
// 4) Placement of clock (default is card)
// 5) Color theme of clock (light, dark, magebta)
// 6) Urgency interval in days
// 7) A11y alert interval in days (only seen with screen readers)
// 8) The message that displays when the clock reaches 0.
