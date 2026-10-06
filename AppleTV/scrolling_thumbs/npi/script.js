// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Data source and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// DOM references
const appletvScrollContainerID = document
  .querySelector("#tsw-appletv-scroll")
  .querySelector("xpr-npi-content").shadowRoot;

const appletvScrollContainer = appletvScrollContainerID.querySelector(".tsw-appletv-scroll-container");
const appletvScroll = appletvScrollContainerID.querySelector(".tsw-appletv-scroll");
const appletvPlayButton = appletvScrollContainerID.querySelector(".tsw-appletv-play-button");

// Computing widths of scrolling boxes
let containerWidth = appletvScrollContainer.offsetWidth;
const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
const rootStyles = window.getComputedStyle(appletvScrollContainer);

const remVar = (name) => parseFloat(rootStyles.getPropertyValue(`--appletv-${name}`)) * rootFontSize;

const widths = {
  rectangle: { desktop: remVar("box-width-rectangle-desktop"), mobile: remVar("box-width-rectangle-mobile") },
  square: { desktop: remVar("box-width-square-desktop"), mobile: remVar("box-width-square-mobile") },
  gap: { desktop: remVar("scroll-gap-desktop"), mobile: remVar("scroll-gap-mobile") },
};

let breakpoint = window.matchMedia("(min-width: 1000px)").matches ? "desktop" : "mobile";

// Image paths
const baseImagePath = "/content/dam/digx/tmobile/us/en/sandbox/brianc/appletv/";

const appletvImages = [
  {
    name: "Dark Matter",
    path: "AppleTV_DarkMatter_378x212.jpg",
  },
  {
    name: "Foundation",
    path: "AppleTV_Foundation_756x425.jpg",
  },
  {
    name: "Stick",
    path: "AppleTV_Stick_756x425.jpg",
  },
  {
    name: "Your Friends and Neighbors",
    path: "AppleTV_YourFriends_756x425.jpg",
  },
  {
    name: "Imperfect Women",
    path: "AppleTV_ImperfectWomen_756x425.jpg",
  },
  {
    name: "The Family Plan 2",
    path: "AppleTV_TheFamilyPlan2_378x212.jpg",
  },
  {
    name: "Murderbot",
    path: "AppleTV_Murderbot_756x425.jpg",
  },
  {
    name: "The Gorge",
    path: "AppleTV_TheGorge_756x425.jpg",
  },
  {
    name: "The Dink",
    path: "AppleTV_TheDink_378x212.jpg",
  },
  {
    name: "Silo",
    path: "AppleTV_Silo_378x212.jpg",
  },
];

// Global variable settings

// speed: Higher number = faster
// direction: -1 = to the left, 1 = to the right
// aspectRatio: Set to 'rectangle' (16:9) or 'square' (1:1)
// active: A 'true' value will render the row in the page, 'false' will hide it

const rowValues = [
  { speed: 0.5, direction: -1, aspectRatio: "rectangle", active: true },
  { speed: 0.8, direction: -1, aspectRatio: "square", active: true },
];
const activeRowValues = rowValues.filter((row) => row.active === true);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render scrolling thumb row functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const splitImages = () => {
  const chunkSize = Math.ceil(appletvImages.length / activeRowValues.length);
  const chunkedArray = [];

  for (let i = 0; i < appletvImages.length; i += chunkSize) {
    chunkedArray.push(appletvImages.slice(i, i + chunkSize));
  }

  return chunkedArray;
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
    .map((box, index) => {
      const fullImagePath = baseImagePath + box.bgImage.path;
      // Add bg image if it exists in the rowData object, otherwise render the color
      const backgroundImage = box.bgImage ? `style="background-image: url('${fullImagePath}');"` : "";

      return `
        <li class="tsw-appletv-scroll-box ${aspectRatioClass} box-color-${box.color} gradient-overlay" role="img" aria-label="${box.bgImage?.name ?? ""}" ${backgroundImage}>Box ${index}</li>
      `;
    })
    .join("");

  return `
    <ul class="tsw-appletv-scroll-row">${scrollRow}</ul>
  `;
};

const getRowLength = (rowConfig, chunkSize) => {
  const tileWidth = widths[rowConfig.aspectRatio][breakpoint];
  const gap = widths.gap[breakpoint];
  const needed = Math.ceil(containerWidth / (tileWidth + gap)) + 2;
  return Math.ceil(needed / chunkSize) * chunkSize; // evenly divisible by chunk
};

let renderedLengths = [];

// Returns true if it re-rendered
const renderAllRows = () => {
  const imageChunks = splitImages();
  const lengths = activeRowValues.map((row, i) => getRowLength(row, imageChunks[i]?.length || 1));

  // Skip if every row already has enough tiles
  if (!lengths.some((len, i) => len > (renderedLengths[i] ?? 0))) return false;
  renderedLengths = lengths;

  console.log(activeRowValues);

  appletvScroll.innerHTML = activeRowValues
    .map((_, i) => renderRow(generateRow(imageChunks[i] ?? [], lengths[i]), i))
    .join("");

  return true;
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
        speed: activeRowValues[i].speed ?? 1,
        direction: activeRowValues[i].direction ?? 1,
        snap: false,
      });
    });
  }

  const updateLayout = () => {
    containerWidth = appletvScrollContainer.offsetWidth;
    breakpoint = window.matchMedia("(min-width: 1000px)").matches ? "desktop" : "mobile";

    // New DOM means the old timelines are bound to detached elements, so force a rebuild
    if (renderAllRows()) lastBoxWidth = 0;

    initAnimation();
  };

  requestAnimationFrame(() => {
    updateLayout();

    new ResizeObserver(() => {
      updateLayout();
    }).observe(appletvScrollContainer);

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
