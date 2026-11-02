// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// DOM references
const netflixScrollContainerID = document
  .querySelector("#tsw-netflix-scroll")
  .querySelector("xpr-npi-content").shadowRoot;

const netflixScrollContainer = netflixScrollContainerID.querySelector(".tsw-netflix-scroll-container");
const netflixScroll = netflixScrollContainerID.querySelector(".tsw-netflix-scroll");
const netflixPlayButton = netflixScrollContainerID.querySelector(".tsw-netflix-play-button");

// Computing widths of scrolling boxes
let containerWidth = netflixScrollContainer.offsetWidth;
const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
const rootStyles = window.getComputedStyle(netflixScrollContainer);

const remVar = (name) => parseFloat(rootStyles.getPropertyValue(`--netflix-${name}`)) * rootFontSize;

const widths = {
  rectangle: { desktop: remVar("box-width-rectangle-desktop"), mobile: remVar("box-width-rectangle-mobile") },
  square: { desktop: remVar("box-width-square-desktop"), mobile: remVar("box-width-square-mobile") },
  gap: { desktop: remVar("scroll-gap-desktop"), mobile: remVar("scroll-gap-mobile") },
};

let breakpoint = window.matchMedia("(min-width: 1000px)").matches ? "desktop" : "mobile";

// Image paths
const baseImagePath =
  "/content/dam/digx/tmobile/us/en/creative_assethandoff/2026/q4/13191669_dd_partner-lps/netflix/carousel/";

const netflixImages = [
  {
    name: "Running Point",
    path: "Netflix-runningpoint_756x425.jpg",
  },
  {
    name: "The Gentlemen",
    path: "Netflix-gentlemen_756x425.jpg",
  },
  {
    name: "My Life With the Walter Boys",
    path: "Netflix-mlwtwb_756x425.jpg",
  },
  {
    name: "Don't Say Good Luck",
    path: "Netflix-dsgl_756x425.jpg",
  },
  {
    name: "Apex",
    path: "Netflix-apex_756x425.jpg",
  },
  {
    name: "Beef",
    path: "Netflix-beef_756x425.jpg",
  },
  {
    name: "Earle Meets World",
    path: "Netflix-emw_756x425.jpg",
  },
  {
    name: "Leanne",
    path: "Netflix-leanne_756x425.jpg",
  },
  {
    name: "Netflix NFL Game Day",
    path: "Netflix-nflgameday_756x425.jpg",
  },
  {
    name: "Tires",
    path: "Netflix-tires_756x425.jpg",
  },
  {
    name: "Raw",
    path: "Netflix-raw_756x425.jpg",
  },
];

// Global variable settings

// imageCount: Number of images in each row.
// speed: Higher number = faster
// direction: -1 = to the left, 1 = to the right
// aspectRatio: Set to 'rectangle' (16:9) or 'square' (1:1)
// active: A 'true' value will render the row in the page, 'false' will hide it

const rowValues = [
  { imageCount: 5, speed: 0.5, direction: -1, aspectRatio: "rectangle", active: true },
  { imageCount: 6, speed: 0.8, direction: -1, aspectRatio: "rectangle", active: true },
];
const activeRowValues = rowValues.filter((row) => row.active === true);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render scrolling thumb row functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const splitImages = () => {
  // Fallback to an even split for any row without an imageCount
  const fallback = Math.ceil(netflixImages.length / activeRowValues.length);
  let offset = 0;

  return activeRowValues.map((row) => {
    const count = row.imageCount ?? fallback;
    const chunk = netflixImages.slice(offset, offset + count);
    offset += count;
    return chunk;
  });
};

const generateRow = (imageChunk, rowLength) => {
  return Array.from({ length: rowLength }, (_, i) => {
    return {
      bgImage: imageChunk.length ? imageChunk[i % imageChunk.length] : "",
    };
  });
};

const renderRow = (boxes, index) => {
  const aspectRatioClass = activeRowValues[index].aspectRatio || "rectangle";

  const scrollRow = boxes
    .map((box) => {
      const fullImagePath = box.bgImage ? baseImagePath + box.bgImage.path : "";
      const image = fullImagePath ? `<div class="tsw-netflix-scroll-image" data-bg="${fullImagePath}"></div>` : "";
      const loadingClass = fullImagePath ? "is-loading" : "";

      return `
        <li class="tsw-netflix-scroll-box ${aspectRatioClass} ${loadingClass}" role="img" aria-label="${box.bgImage?.name ?? ""}">${image}</li>
      `;
    })
    .join("");

  return `<ul class="tsw-netflix-scroll-row">${scrollRow}</ul>`;
};

const getRowLength = (rowConfig, chunkSize) => {
  const tileWidth = widths[rowConfig.aspectRatio][breakpoint];
  const gap = widths.gap[breakpoint];
  const needed = Math.ceil(containerWidth / (tileWidth + gap)) + 2;
  return Math.ceil(needed / chunkSize) * chunkSize; // evenly divisible by chunk
};

// Add and remove classes to control loading shimmer
const imagePromises = new Map();

const loadImage = (url) => {
  if (!imagePromises.has(url)) {
    const img = new Image();
    img.src = url;
    imagePromises.set(
      url,
      img.decode().then(() => url),
    );
  }
  return imagePromises.get(url);
};

const loadTileImages = () => {
  netflixScroll.querySelectorAll(".tsw-netflix-scroll-image[data-bg]").forEach((el) => {
    const box = el.parentElement;
    const finish = () => {
      el.classList.add("is-loaded");
      box.classList.remove("is-loading");
    };
    loadImage(el.dataset.bg)
      .then((url) => {
        el.style.backgroundImage = `url("${url}")`;
        finish();
      })
      .catch(finish);
  });
};

let renderedLengths = [];

// Returns true if it re-rendered
const renderAllRows = () => {
  const imageChunks = splitImages();
  const lengths = activeRowValues.map((row, i) => getRowLength(row, imageChunks[i]?.length || 1));

  // Skip if every row already has enough tiles
  if (!lengths.some((len, i) => len > (renderedLengths[i] ?? 0))) return false;
  renderedLengths = lengths;

  netflixScroll.innerHTML = activeRowValues
    .map((_, i) => renderRow(generateRow(imageChunks[i] ?? [], lengths[i]), i))
    .join("");

  loadTileImages();

  return true;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render play button functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-

const renderPlayButton = (isPaused) => {
  netflixPlayButton.innerHTML = `
    <svg aria-hidden="true">
      <use href="#tsw-netflix-${isPaused ? "play" : "pause"}-svg"></use>
    </svg>
  `;
};

netflixPlayButton.addEventListener("click", () => {
  if (!netflixScrollContainer.animToggle) return;
  netflixScrollContainer.animToggle();
  renderPlayButton(netflixScrollContainer.animIsPaused());
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

  netflixScrollContainer.animIsPaused = () => isPaused;

  // Expose on the container so external code can call it
  netflixScrollContainer.animPause = pause;
  netflixScrollContainer.animPlay = play;
  netflixScrollContainer.animToggle = toggle;

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
    const direction = config.direction ?? -1;

    const tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none", force3D: true },
    });

    for (let i = 0; i < items.length; i++) {
      const distanceToStart = i * itemStep;

      const distanceToLoop =
        direction === 1
          ? totalWidth - distanceToStart // right: rightmost item exits first
          : distanceToStart + boxWidth; // left: leftmost item exits first

      const phase1End = snap(((direction * distanceToLoop) / boxWidth) * 100);

      const phase2From =
        direction === 1
          ? snap((-distanceToStart / boxWidth) * 100) // jump to far left
          : snap(((totalWidth - distanceToLoop) / boxWidth) * 100); // jump to far right

      tl.to(items[i], { xPercent: phase1End, duration: distanceToLoop / pixelsPerSecond }, 0).fromTo(
        items[i],
        { xPercent: phase2From },
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
    console.log("initAnimation", performance.now());
    const rows = netflixScrollContainerID.querySelectorAll(".tsw-netflix-scroll-row");
    const firstItem = rows[0]?.querySelector(".tsw-netflix-scroll-box");
    if (!firstItem || firstItem.offsetWidth === 0) return;

    const currentBoxWidth = firstItem.offsetWidth;
    if (currentBoxWidth === lastBoxWidth) return;
    lastBoxWidth = currentBoxWidth;

    loops.forEach((tl) => tl.kill());

    loops = Array.from(rows).map((row, i) => {
      const items = gsap.utils.toArray(row.querySelectorAll(".tsw-netflix-scroll-box"));
      return horizontalLoop(items, {
        repeat: -1,
        paused: isPaused,
        speed: activeRowValues[i].speed ?? 1,
        direction: activeRowValues[i].direction ?? 1,
        snap: false,
      });
    });
  }

  const updateLayout = () => {
    containerWidth = netflixScrollContainer.offsetWidth;
    breakpoint = window.matchMedia("(min-width: 1000px)").matches ? "desktop" : "mobile";

    // New DOM means the old timelines are bound to detached elements, so force a rebuild
    if (renderAllRows()) lastBoxWidth = 0;

    initAnimation();
  };

  requestAnimationFrame(() => {
    updateLayout();

    new ResizeObserver(() => {
      updateLayout();
    }).observe(netflixScrollContainer);

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
    ).observe(netflixScrollContainer);
  });
});

/* Event listener that dynamically resizing the container window for the scrolling animations */
function resizeScrollySection() {
  let myScrollyView = document.querySelector(".xpr-wrapper__container").offsetWidth;
  myNewSize = myScrollyView + "px";
  document.querySelector("#tsw-netflix-scroll").style.width = myNewSize;
  netflixScrollContainer.style.width = myNewSize;
}

window.addEventListener("resize", resizeScrollySection);
resizeScrollySection();
