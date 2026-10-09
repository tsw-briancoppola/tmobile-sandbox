// =-=-=-=-=-=-=-=-=-=-=
// Countdown clock class
// =-=-=-=-=-=-=-=-=-=-=

class CountDownClock {
  constructor(
    containerDOMArg,
    targetDateArg,
    timeZoneArg,
    // urgencyIntervalArg,
    // a11yAlertIntervalArg,
    headerDates,
    headerMessages,
  ) {
    this.countDownDOM = containerDOMArg; // Specific container for this instance
    this.countDownEl = containerDOMArg.querySelector(".tsw-countdown");

    if (!this.countDownEl) {
      console.error("Countdown element not found within this container:", containerEl);
      return;
    }

    this.countDownToThisTime = null;
    this.countDown = null;
    this.timeZoneForTarget = timeZoneArg || "local";
    // this.urgencyInterval = urgencyIntervalArg !== undefined ? urgencyIntervalArg : 1;
    // this.a11yAlertInterval = a11yAlertIntervalArg !== undefined ? a11yAlertIntervalArg : 10;
    this.targetDate = targetDateArg;
    this.headerDates = headerDates;
    this.headerMessages = headerMessages;

    this.init();
  }

  init() {
    // if (!Number.isInteger(this.a11yAlertInterval)) {
    //   throw new Error("a11yAlertInterval is not a number");
    // }

    this.countDownToThisTime = this.setTimeZoneForTarget(this.targetDate);
    this.countDown = this.startCountDown();
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
    const headerDatesText = this.countDownEl.querySelector(".tsw-countdown-header-dates");
    const headerMessageText = this.countDownEl.querySelector(".tsw-countdown-header-message");
    const displayDays = this.countDownEl.querySelector(".tsw-countdown-days");
    const displayHours = this.countDownEl.querySelector(".tsw-countdown-hours");
    const displayMinutes = this.countDownEl.querySelector(".tsw-countdown-minutes");
    const displaySeconds = this.countDownEl.querySelector(".tsw-countdown-seconds");
    // const urgencyAlert = this.countDownEl.querySelector(".tsw-countdown-urgency-alert");
    // const a11yAlert = this.countDownEl.querySelector("#tsw-countdown-a11y-alert");

    const secs = Math.floor(seconds % 60);
    const mins = Math.floor((seconds / 60) % 60);
    const hrs = Math.floor((seconds / (60 * 60)) % 24);
    const dys = Math.floor(seconds / (60 * 60 * 24));

    displaySeconds.textContent = secs > 0 ? (secs < 10 ? "0" + secs : secs) : "00";
    displayMinutes.textContent = mins > 0 ? (mins < 10 ? "0" + mins : mins) : "00";
    displayHours.textContent = hrs > 0 ? (hrs < 10 ? "0" + hrs : hrs) : "00";
    displayDays.textContent = dys > 0 ? (dys < 10 ? "0" + dys : dys) : "00";

    headerDatesText.innerHTML = this.headerDates;

    if (seconds <= 0) {
      headerMessageText.innerHTML = this.headerMessages.find((header) => header.interval === "end").message;
    } else if (dys === 0) {
      if (hrs === 0) {
        headerMessageText.innerHTML = this.headerMessages.find((header) => header.interval === "last hour").message;
      } else {
        headerMessageText.innerHTML = this.headerMessages.find((header) => header.interval === "last day").message;
      }
    } else {
      headerMessageText.innerHTML = this.headerMessages.find((header) => header.interval === "start").message;
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

const TARGET_TIME_ZONE = "pacific"; // Name of time zone or 'local'
const TARGET_DATE = "2026-10-07T15:37"; // Fixed target date/time, ISO format (yyyy-MM-dd'T'HH:mm)

const HEADER_DATES = "November 24 - December 7";
const HEADER_MESSAGES = [
  {
    interval: "start",
    message: "FREE WON'T WAIT.",
  },
  {
    interval: "last day",
    message: "FREE won't stick around.",
  },
  {
    interval: "last hour",
    message: "Last call. FREE won't wait.",
  },
  {
    interval: "end",
    message: "FREE's back December 15.",
  },
];

const clockInstanceDOM = document.querySelector("#container--1");
let clockInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  // Create instance of clock
  clockInstance = new CountDownClock(clockInstanceDOM, TARGET_DATE, TARGET_TIME_ZONE, HEADER_DATES, HEADER_MESSAGES);
});

// CountDownClock parameters:
//
// 1) The DOM of the clock instance
// 2) The formatted target date and time
// 3) Set target time to fixed time or relative to user time zone (local, eastern, etc.)
// 4) Text for date range in header
// 5) Array of objects that contain the main header message and time interval
