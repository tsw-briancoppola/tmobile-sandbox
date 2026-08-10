// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// const DATA_SOURCE = "https://test-fn5gl.teamdigital.com/api/verified-schools";
// const BEARER_TOKEN = "FzGJtOcibwWWQNU2";

const appletvScrollContainerID = document
  .querySelector("#tsw-appletv-scroll")
  .querySelector("xpr-npi-content").shadowRoot;

// DOM references
const appletvScrollContainer = appletvScrollContainerID.querySelector(".tsw-appletv-scroll-container");
const appletvScroll = appletvScrollContainerID.querySelector(".tsw-appletv-scroll");
// const appletvScrollBoxes = appletvScrollContainerID.querySelectorAll(".tsw-appletv-scroll-box");
// const appletvPlaySVG = appletvScrollContainerID.querySelector(".tsw-appletv-play");
// const appletvPauseSVG = appletvScrollContainerID.querySelector(".tsw-appletv-pause");
const appletvPlayButton = appletvScrollContainerID.querySelector(".tsw-appletv-play-button");

// Global variable settings
const NUMBER_OF_ROWS = 2;
const colors = ["blue", "green", "red", "orange", "magenta", "purple"];

const rowLength = 10;
const rowSpeeds = [0.5, 0.8]; // Higher number = faster

// Create rows
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const rowColors = Array.from({ length: NUMBER_OF_ROWS }, () => {
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

const TICKER_DIRECTION = -1; // 1 = forward, -1 = reverse

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render scrolling thumb row functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderRow = (colors) => {
  const scrollRow = colors
    .map((color, index) => {
      return `
        <div class="tsw-appletv-scroll-box box-color-${color} gradient-overlay">Box ${index}</div>
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

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render play button functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderPlayButton = (isPaused) => {
  appletvPlayButton.innerHTML = `
    <svg aria-hidden="true">
      <use href="#tsw-apple-${isPaused ? "play" : "pause"}-svg"></use>
    </svg>
  `;
};

// =-=-=-=-=-=-=-=-=-=-=-
// Button event listeners
// =-=-=-=-=-=-=-=-=-=-=-

appletvPlayButton.addEventListener("click", () => {
  if (!appletvScrollContainer.animToggle) return;
  appletvScrollContainer.animToggle();
  renderPlayButton(appletvScrollContainer.animIsPaused());
});

// =-=-=-=-=-=-=-
// Init functions
// =-=-=-=-=-=-=-

const init = () => {
  renderAllRows();
  renderPlayButton(false);
};

init();

// =-=-=-=-=
// GSAP code
// =-=-=-=-=

/* Check if GSAP is loaded */

function waitForGSAP(callback) {
  if (typeof gsap !== "undefined") {
    callback();
  } else {
    setTimeout(() => waitForGSAP(callback), 100);
  }
}

/* Main GSAP function */

waitForGSAP(() => {
  let loops = [];
  let lastBoxWidth = 0;
  let isPaused = false;

  function pause() {
    isPaused = true;
    loops.forEach((tl) => tl.pause());
  }

  function play() {
    isPaused = false;
    loops.forEach((tl) => tl.play());
  }

  function toggle() {
    isPaused ? play() : pause();
  }

  appletvScrollContainer.animIsPaused = () => isPaused;

  // Expose on the container so external code can call it
  appletvScrollContainer.animPause = pause;
  appletvScrollContainer.animPlay = play;
  appletvScrollContainer.animToggle = toggle;

  function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};

    gsap.killTweensOf(items);
    gsap.set(items, { xPercent: 0, x: 0 });

    const boxWidth = items[0].offsetWidth;
    const gap = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft - boxWidth : 0;
    const itemStep = boxWidth + gap;
    const totalWidth = items.length * itemStep;
    const pixelsPerSecond = (config.speed || 1) * 100;
    const snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1);

    const tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none", force3D: true },
    });

    for (let i = 0; i < items.length; i++) {
      const distanceToStart = i * itemStep;
      const distanceToLoop = distanceToStart + boxWidth;

      tl.to(
        items[i],
        { xPercent: snap((-distanceToLoop / boxWidth) * 100), duration: distanceToLoop / pixelsPerSecond },
        0,
      ).fromTo(
        items[i],
        { xPercent: snap(((totalWidth - distanceToLoop) / boxWidth) * 100) },
        {
          xPercent: 0,
          duration: (totalWidth - distanceToLoop) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      );
    }

    return tl;
  }

  function initAnimation() {
    const rows = appletvScrollContainerID.querySelectorAll(".tsw-appletv-scroll-row");
    const firstItem = rows[0]?.querySelector(".tsw-appletv-scroll-box");
    if (!firstItem || firstItem.offsetWidth === 0) return;

    const currentBoxWidth = firstItem.offsetWidth;
    if (currentBoxWidth === lastBoxWidth) return;
    lastBoxWidth = currentBoxWidth;

    loops.forEach((tl) => tl.kill());

    loops = Array.from(rows).map((row, i) => {
      const items = gsap.utils.toArray(row.querySelectorAll(".tsw-appletv-scroll-box"));
      return horizontalLoop(items, {
        repeat: -1,
        paused: isPaused,
        speed: rowSpeeds[i] ?? 1,
        snap: false,
      });
    });
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initAnimation();

      new ResizeObserver(() => initAnimation()).observe(appletvScrollContainer);

      // Respect isPaused so IntersectionObserver doesn't override a manual pause
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            loops.forEach((tl) => {
              if (entry.isIntersecting && !isPaused) tl.play();
              else if (!entry.isIntersecting) tl.pause();
            });
          });
        },
        { threshold: 0 },
      ).observe(appletvScrollContainer);
    });
  });
});
