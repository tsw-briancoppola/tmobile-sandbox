/* 
cDate: Date object with the specified timezone we are counting down to using PDT = pacific, CDT = central or EDT = east
a11yAlertInterval: Integer between 0 - 60. Will be used to represent interval to alert users using a screen reader.
*/

const CountDownClock = {
  countDownToThisTime: null,
  countDown: null,
  a11yAlertInterval: 10,
  init(cDate, a11yAlertIntervalArg) {
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
    this.countDownToThisTime = cDate;
    this.countDown = this.startCountDown();
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
    const displayDays = this.countDownEl.querySelector(".tsw-countdown_days .tsw-countdown_time");
    const displayHours = this.countDownEl.querySelector(".tsw-countdown_hours .tsw-countdown_time");
    const displayMinutes = this.countDownEl.querySelector(".tsw-countdown_minutes .tsw-countdown_time");
    const displaySeconds = this.countDownEl.querySelector(".tsw-countdown_seconds .tsw-countdown_time");
    const a11yAlert = this.countDownEl.querySelector("#tsw-countdown-alert");
    const secs = Math.floor(seconds % 60);
    const mins = Math.floor((seconds / 60) % 60);
    const hrs = Math.floor((seconds / (60 * 60)) % 24);
    const dys = Math.floor(seconds / (60 * 60 * 24));
    displaySeconds.textContent = secs > 0 ? (secs < 10 ? "0" + secs : secs) : "00";
    displayMinutes.textContent = mins > 0 ? (mins < 10 ? "0" + mins : mins) : "00";
    displayHours.textContent = hrs > 0 ? (hrs < 10 ? "0" + hrs : hrs) : "00";
    displayDays.textContent = dys > 0 ? (dys < 10 ? "0" + dys : dys) : "00";
    if (secs % this.a11yAlertInterval === 0) {
      a11yAlert.textContent = `${dys} days ${hrs} hours ${mins} minutes ${secs} seconds left until FN5GL application window closes`;
    }
  },
  stopClock() {
    clearInterval(this.countDown);
    this.countDownToThisTime = null;
  },
};

// window.addEventListener("load", () => {
//   /* PDT | EDT | CDT */
//   const targetDate = new Date("Dec 25, 2025 00:00:00 EDT");
//   CountDownClock.init(targetDate, 30);
// });

const selectedDate = document.querySelector("#tsw-countdown-date");
const selectedDateSubmitButton = document.querySelector(".tsw-countdown-submit");

selectedDateSubmitButton.addEventListener("click", () => {
  const targetDate = new Date(selectedDate.value);

  if (!selectedDate.value) {
    alert("Target date not chosen. Select target date.");
  } else {
    targetDate.setHours(24, 0, 0, 0);
    CountDownClock.init(targetDate, 30);
  }
});
