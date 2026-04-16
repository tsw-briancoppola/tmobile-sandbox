// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Page elements and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// const mapUSAContainer = document.querySelector(".tsw-map-usa-container");
// const mapUSA = document.querySelector(".tsw-map-usa");

// =-=-=-=-=-=-=
// Map functions
// =-=-=-=-=-=-=

gsap.registerPlugin(ScrollTrigger);

const items = gsap.utils.toArray(".tsw-fn5gl-ticker-item");
// 1. Create the seamless loop (returns a timeline)
const loop = horizontalLoop(items, { repeat: -1, paused: true });

// 2. Use ScrollTrigger to scrub the loop's progress
ScrollTrigger.create({
  trigger: ".tsw-fn5gl-ticker-wrapper",
  start: "top bottom",
  end: "+=3000",
  scrub: 1,
  onUpdate: (self) => {
    // Moves the playhead of our loop based on scroll progress
    loop.progress(self.progress);
  },
});

// --- GSAP's Official Helper Function (Simplified for Tickers) ---
function horizontalLoop(items, config) {
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

// =-=-=-=
// On load
// =-=-=-=

window.addEventListener("load", () => {
  // initMap();
  // InitComboBox();
});
