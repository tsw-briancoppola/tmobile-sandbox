// =-=-=-=-=-=-=-=-=-=-=
// Countdown clock class
// =-=-=-=-=-=-=-=-=-=-=

class CountDownClock {
  constructor(containerDOMArg, targetDateArg, timeZoneArg, headerMessages) {
    this.countDownDOM = containerDOMArg; // Specific container for this instance
    this.countDownEl = containerDOMArg.querySelector(".tsw-countdown");

    if (!this.countDownEl) {
      console.error("Countdown element not found within this container:", containerDOMArg);
      return;
    }

    this.countDownToThisTime = null;
    this.countDown = null;
    this.timeZoneForTarget = timeZoneArg || "local";

    this.targetDate = targetDateArg;
    this.headerMessages = headerMessages;

    this.init();
  }

  init() {
    this.countDownToThisTime = this.setTimeZoneForTarget(this.targetDate);
    this.countDown = this.startCountDown();

    console.log("luxon loaded:", typeof luxon !== "undefined");
    console.log("target (UTC):", this.countDownToThisTime.toISOString());
  }

  setTimeZoneForTarget(date) {
    // Set time zone of input date/time using Luxon DateTime object
    const zoneMap = {
      eastern: "America/New_York",
      central: "America/Chicago",
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
    const headerMessageText = this.countDownEl.querySelector(".tsw-countdown-header-text");
    const displayDays = this.countDownEl.querySelector(".tsw-countdown-days");
    const displayHours = this.countDownEl.querySelector(".tsw-countdown-hours");
    const displayMinutes = this.countDownEl.querySelector(".tsw-countdown-minutes");
    const displaySeconds = this.countDownEl.querySelector(".tsw-countdown-seconds");

    const secs = Math.floor(seconds % 60);
    const mins = Math.floor((seconds / 60) % 60);
    const hrs = Math.floor((seconds / (60 * 60)) % 24);
    const dys = Math.floor(seconds / (60 * 60 * 24));

    displaySeconds.textContent = secs > 0 ? (secs < 10 ? "0" + secs : secs) : "00";
    displayMinutes.textContent = mins > 0 ? (mins < 10 ? "0" + mins : mins) : "00";
    displayHours.textContent = hrs > 0 ? (hrs < 10 ? "0" + hrs : hrs) : "00";
    displayDays.textContent = dys > 0 ? (dys < 10 ? "0" + dys : dys) : "00";

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
    clearInterval(this.countDown);
    this.countDownToThisTime = null;

    console.log("Clock stopped for container:", this.countDownDOM.id);
  }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Start instance of clock on page load
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const TARGET_TIME_ZONE = "central"; // Name of time zone or 'local'
const TARGET_DATE = "2026-11-05T00:00"; // Fixed target date/time, ISO format (yyyy-MM-dd'T'HH:mm)

const HEADER_MESSAGES = [
  {
    interval: "start",
    message: "Get this offer while it lasts.",
  },
  {
    interval: "last day",
    message: "Last day to get this offer.",
  },
  {
    interval: "last hour",
    message: "Last chance to get this offer.",
  },
  {
    interval: "end",
    message: "Offer ended",
  },
];

const countdownWrapper = document.querySelector("#tsw-metro-countdown-id").querySelector("xpr-npi-content").shadowRoot;
const clockInstanceDOM = countdownWrapper.querySelector("#container--1");

// Wait for Luxon to be loaded

function waitFor(testFn, { interval = 100, timeout = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      const result = testFn();
      if (result) return resolve(result);
      if (Date.now() - start > timeout) return reject(new Error("Timed out waiting"));
      setTimeout(check, interval);
    })();
  });
}

let clockInstance = null;

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Wait for Luxon and for the shadow DOM container
    await waitFor(() => window.luxon);
    const dom = await waitFor(() =>
      document
        .querySelector("#tsw-metro-countdown-id")
        ?.querySelector("xpr-npi-content")
        ?.shadowRoot?.querySelector("#container--1"),
    );

    clockInstance = new CountDownClock(dom, TARGET_DATE, TARGET_TIME_ZONE, HEADER_MESSAGES);
  } catch (err) {
    console.error("Countdown failed to start:", err.message);
  }
});
