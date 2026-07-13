// =-=-=-=-=-=-=-=-
// Global variables
// =-=-=-=-=-=-=-=-

const TICKER_REVERSE_2 = true; // false = forward, true = reverse

// =-=-=-=-=-=-=
// Init ticker 2
// =-=-=-=-=-=-=

const fn5glTickerContainer2 = document
  .querySelector("#tsw-fn5gl-test_ticker-2")
  .querySelector("xpr-npi-content").shadowRoot;

function waitForInitTicker(callback) {
  if (typeof initTicker !== "undefined") {
    callback();
  } else {
    setTimeout(() => waitForInitTicker(callback), 100);
  }
}

waitForInitTicker(() => {
  initTicker(".tsw-fn5gl-ticker-wrapper-2", ".tsw-fn5gl-ticker-item-2", TICKER_REVERSE_2, fn5glTickerContainer2);
});
