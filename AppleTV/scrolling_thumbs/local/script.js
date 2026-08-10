// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/verified-schools";
// const BEARER_TOKEN = "FzGJtOcibwWWQNU2";

// DOM references
const appletvScrollContainer = document.querySelector(".tsw-appletv-scroll-container");
const appletvScroll = document.querySelector(".tsw-appletv-scroll");
const appletvScrollBoxes = document.querySelectorAll(".tsw-appletv-scroll-box");

// Global variable settings
const NUMBER_OF_ROWS = 2;
const colors = ["blue", "green", "red", "orange", "magenta", "purple"];

const numberOfRows = 2;
const rowLength = 14;
const rowSpeeds = [0.4, 0.3];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const rowColors = Array.from({ length: numberOfRows }, () => {
  const row = [];
  while (row.length < rowLength) {
    let shuffled = shuffle(colors);
    if (row.length > 0 && shuffled[0] === row[row.length - 1]) {
      shuffled.push(shuffled.shift()); // move first element to end
    }
    row.push(...shuffled);
  }
  return row.slice(0, rowLength);
});

const TICKER_DIRECTION = 1; // 1 = forward, -1 = reverse

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render scrolling thumb row functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderRow = (colors) => {
  scrollRow = colors
    .map((color, index) => {
      return `
        <div class="tsw-appletv-scroll-box box-color-${color} gradient-overlay">${color}</div>
      `;
    })
    .join("");

  return `
    <div class="tsw-appletv-scroll-row">${scrollRow}</div>
  `;
};

const renderAllRows = () => {
  const allRowsHTML = rowColors
    .map((colors) => {
      return renderRow(colors);
    })
    .join("");

  appletvScroll.innerHTML = allRowsHTML;
};

// =-=-=-=-=-=-=-
// Init functions
// =-=-=-=-=-=-=-

const init = () => {
  renderAllRows();
};

init();

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

// =-=-=-=-=
// GSAP code
// =-=-=-=-=

waitForGSAP(() => {
  gsap.registerPlugin(ScrollTrigger);

  const rows = document.querySelectorAll(".tsw-appletv-scroll-row");
  // 1. Create the seamless loop (returns a timeline)
  const loops = Array.from(rows).map((row) => {
    const items = gsap.utils.toArray(row.querySelectorAll(".tsw-appletv-scroll-box"));
    return horizontalLoop(items, { repeat: -1, paused: true });
  });

  // 2. Use ScrollTrigger to scrub the loop's progress
  ScrollTrigger.create({
    trigger: appletvScroll,
    start: "top bottom",
    end: `+=${window.innerHeight * 2}`, // Speed: slower > faster
    scrub: 1,
    onUpdate: (self) => {
      const p = TICKER_DIRECTION === 1 ? self.progress : 1 - self.progress;
      loops.forEach((loop, i) => {
        loop.progress((p * rowSpeeds[i]) % 1);
      });
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
});

// =-=-=-=-=-=-=-
// Init functions
// =-=-=-=-=-=-=-

/* Fetch data */

// const fetchData = async () => {
//   try {
//     const response = await fetch(DATA_SOURCE, {
//       method: "GET", // Default method
//       // headers: {
//       //   Authorization: `Bearer ${BEARER_TOKEN}`,
//       //   "Content-Type": "application/json",
//       // },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     // console.log(data);

//     return transformData(data);
//   } catch (error) {
//     console.error("Fetch failed:", error);
//     return null;
//   }
// };
