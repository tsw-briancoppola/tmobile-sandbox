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

// Image paths
const basePath =
  "/content/dam/digx/tmobile/us/en/creative_assethandoff/2026/q3/12705250_apple-tv-streaming-lp-redesign/carousel-tiles/v1/";

const appletvImages = [
  {
    name: "Your Friends and Neighbors",
    path: "12705250_fg_appletv-carousel-YFN_16x9.jpg",
  },
  {
    name: "Widow's Bay",
    path: "12705250_fg_appletv-carousel-WIDOWS_16x9.jpg",
  },
  {
    name: "Silo",
    path: "12705250_fg_appletv-carousel-SILO_16x9.jpg",
  },
  {
    name: "Pluribus",
    path: "12705250_fg_appletv-carousel-PLURIBUS_16x9.jpg",
  },
  {
    name: "Maximum Pleasure Guaranteed",
    path: "12705250_fg_appletv-carousel-MPG_16x9.jpg",
  },
  {
    name: "Lucky",
    path: "12705250_fg_appletv-carousel-LUCKY_16x9.jpg",
  },
  {
    name: "Ted Lasso",
    path: "12705250_fg_appletv-carousel-LASSO_16x9.jpg",
  },
  {
    name: "Slow Horses",
    path: "12705250_fg_appletv-carousel-HORSES_16x9.jpg",
  },
  {
    name: "Dark Matter",
    path: "12705250_fg_appletv-carousel-DM_16x9.jpg",
  },
  {
    name: "The Dink",
    path: "12705250_fg_appletv-carousel-DINK_16x9.jpg",
  },
];

// Global variable settings

// Speed: Higher number = faster
// Direction: -1 = to the left, 1 = to the right
const rowValues = [
  { speed: 0.5, direction: -1 },
  { speed: 0.8, direction: -1 },
];
const numberOfRows = 2;
const rowLength = 10; // Number of boxes per row

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Render scrolling thumb row functions
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const splitImages = () => {
  const chunkSize = Math.ceil(appletvImages.length / numberOfRows);
  const chunkedArray = [];

  for (let i = 0; i < appletvImages.length; i += chunkSize) {
    chunkedArray.push(appletvImages.slice(i, i + chunkSize));
  }

  return chunkedArray;
};

const generateRow = (imageChunk) => {
  return Array.from({ length: rowLength }, (_, i) => {
    return {
      bgImage: imageChunk.length ? imageChunk[i % imageChunk.length] : "",
    };
  });
};

const renderRow = (boxes) => {
  const scrollRow = boxes
    .map((box) => {
      const dataBg = box.bgImage ? `data-bg="${basePath}${box.bgImage.path}"` : "";
      const loadingClass = box.bgImage ? "is-loading" : "";

      return `
        <li class="tsw-appletv-scroll-box ${loadingClass}" role="img" aria-label="${box.bgImage?.name ?? ""}" ${dataBg}>
          ${box.bgImage ? `<span class="tsw-appletv-scroll-image"></span>` : ""}
        </li>
      `;
    })
    .join("");

  return `
    <ul class="tsw-appletv-scroll-row">${scrollRow}</ul>
  `;
};

const renderAllRows = () => {
  const imageChunks = splitImages();

  const allRowsHTML = Array.from({ length: numberOfRows })
    .map((_, index) => {
      const row = generateRow(imageChunks[index] ?? []);
      return renderRow(row);
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

appletvPlayButton.addEventListener("click", () => {
  if (!appletvScrollContainer.animToggle) return;
  appletvScrollContainer.animToggle();
  renderPlayButton(appletvScrollContainer.animIsPaused());
});

// =-=-=-=-=-=-=-
// Init functions
// =-=-=-=-=-=-=-

const loadImages = () => {
  const boxes = appletvScrollContainerID.querySelectorAll(".tsw-appletv-scroll-box[data-bg]");

  boxes.forEach((box) => {
    const src = box.dataset.bg;
    const img = new Image();

    img.onload = () => {
      const imageLayer = box.querySelector(".tsw-appletv-scroll-image");
      imageLayer.style.backgroundImage = `url('${src}')`;
      imageLayer.classList.add("is-loaded");
      box.classList.remove("is-loading");
    };
    img.onerror = () => box.classList.remove("is-loading");
    img.src = src;
  });
};

const init = () => {
  renderAllRows();
  renderPlayButton(false);
  loadImages();
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

    appletvScroll.classList.add("is-loaded");

    loops = Array.from(rows).map((row, i) => {
      const items = gsap.utils.toArray(row.querySelectorAll(".tsw-appletv-scroll-box"));
      return horizontalLoop(items, {
        repeat: -1,
        paused: isPaused,
        speed: rowValues[i].speed ?? 1,
        direction: rowValues[i].direction ?? 1,
        snap: false,
      });
    });
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initAnimation();

      let resizeTimer;
      new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initAnimation, 100);
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
});
