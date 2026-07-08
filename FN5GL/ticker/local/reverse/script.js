// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// DOM references and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// const fn5glContainer3 = document.querySelector("#tsw-fn5gl-test-3").querySelector("xpr-npi-content").shadowRoot;
const fn5glTickerWrapper2 = document.querySelectorAll(".tsw-fn5gl-ticker-wrapper-2");
const fn5glTickerItems2 = document.querySelectorAll(".tsw-fn5gl-ticker-item-2");

const TICKER_DIRECTION = -1; // 1 = forward, -1 = reverse

// =-=-=-=-=-=-=-=-=-=-=-=
// Check if GSAP is loaded
// =-=-=-=-=-=-=-=-=-=-=-=

function waitForGSAP(callback) {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    callback();
  } else {
    setTimeout(() => waitForGSAP(callback), 100);
  }
}
