// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// DOM references and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const fn5glTickerContainer1 = document
  .querySelector("#tsw-fn5gl-test_ticker-1")
  .querySelector("xpr-npi-content").shadowRoot;

const TICKER_REVERSE_1 = false; // false = forward, true = reverse

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

// =-=-=-=-=-=-=-=-=-=-=-=-=
// Shared helper function
// =-=-=-=-=-=-=-=-=-=-=-=-=

function horizontalLoop(items, config) {
  console.log(fn5glTickerContainer1);

  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: "none" } }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1);

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap((parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 + gsap.getProperty(el, "xPercent"));
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });
  let totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (let i = 0; i < length; i++) {
    let item = items[i],
      curX = (xPercents[i] / 100) * widths[i],
      distanceToStart = item.offsetLeft - startX,
      distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

    tl.to(
      item,
      { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond },
      0,
    ).fromTo(
      item,
      { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
      {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond,
    );
    times[i] = distanceToStart / pixelsPerSecond;
  }
  return tl;
}

// =-=-=-=-=-=-=-=-=
// Ticker setup fn
// =-=-=-=-=-=-=-=-=

function initTicker(wrapperSelector, itemSelector, reverse = false, root = document) {
  waitForGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = root.querySelector(wrapperSelector);
    const items = gsap.utils.toArray(root.querySelectorAll(itemSelector));

    if (!wrapper || items.length === 0) return;

    const loop = horizontalLoop(items, { repeat: -1, paused: true });

    console.log(reverse);

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: `+=${window.innerHeight * 15}`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = reverse ? 1 - self.progress : self.progress;
        loop.progress(progress);
      },
    });
  });
}

// =-=-=-=-=-=-=
// Init ticker 1
// =-=-=-=-=-=-=

initTicker(".tsw-fn5gl-ticker-wrapper-1", ".tsw-fn5gl-ticker-item-1", TICKER_REVERSE_1, fn5glTickerContainer1);
