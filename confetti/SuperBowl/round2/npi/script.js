// =-=-=-=-=-=-=-=-=
// Throttle function
// =-=-=-=-=-=-=-=-=

const runConfetti = (() => {
  let last = 0;
  const delay = 1000; // 1 second delay

  return (fn, ...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args); // Correctly applies the arguments here
    }
  };
})();

// =-=-=-=-=-=-=-=-=-
// Confetti functions
// =-=-=-=-=-=-=-=-=-

const defaults = { zIndex: 900, scalar: 1.4, colors: ["#e20074", "#a61765"] };

const generateConfettiCornersRound2 = (corners, emojis = [], svgConfigs = []) => {
  const dynamicVelocity = Math.max(45, window.innerWidth / 15);
  const config = { ...defaults };

  // 1. Prepare Emojis
  const emojiShapes = emojis?.map((text) => confetti.shapeFromText({ text, scalar: 3 })) || [];

  // 2. Map SVGs
  const svgShapes = svgConfigs.map((cfg) => ({
    shape: confetti.shapeFromPath({ path: cfg.path }),
    color: cfg.color,
    scalar: cfg.scalar || 5,
  }));

  const fire = (xOrigin, yOrigin, angle) => {
    const base = { angle, spread: 100, ticks: 100, origin: { x: xOrigin, y: yOrigin } };

    // Standard confetti burst (with default colors)
    confetti({
      ...config,
      ...base,
      particleCount: 1200 / corners,
      startVelocity: dynamicVelocity,
      gravity: 0.7,
    });
    confetti({ ...config, ...base, particleCount: 120, startVelocity: dynamicVelocity * 0.35, gravity: 1, ticks: 50 });

    // Emoji burst
    if (emojiShapes.length > 0) {
      confetti({
        ...base,
        shapes: emojiShapes,
        particleCount: 15,
        scalar: 5,
        startVelocity: dynamicVelocity,
      });
    }

    // SVG burst (with individual color locking)
    svgShapes.forEach(({ shape, color, scalar }) => {
      confetti({
        ...base,
        shapes: [shape], // Must be an array
        colors: [color], // Locks the SVG to this specific color
        particleCount: 12,
        scalar: scalar,
        startVelocity: dynamicVelocity,
        gravity: 0.7,
      });
    });
  };

  // Launch from corners
  fire(0, 1, 60);
  fire(1, 1, 120);

  if (corners === 4) {
    fire(0, 0, 320);
    fire(1, 0, 210);
  }
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Mixed fireworks + emojis and svgs (fireworks)
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// SVG paths

const svgPathTMobile =
  "M29.2,48.1h-10v-10h10v10ZM19.2,15.2v16.9h3v-.5c0-8,4.5-13,13-13h.5v35.9c0,5-2,7-7,7h-1.5v3.5h25.9v-3.5h-1.5c-5,0-7-2-7-7V18.7h.5c8.5,0,13,5,13,13v.5h3V15.2H19.2ZM51.1,48.1h10v-10h-10v10Z";

const svgPathFootball =
  "M145,655c44.6,44.6,95.3,81.8,148.6,110.5-143.1,25.4-206.2-5.6-229.8-29.2-23.6-23.6-54.6-85.5-29.2-229.8,28.6,53.2,65.9,102.7,110.5,148.6ZM660.8,156.2c.3.3.5.6.8.9,40.6,43.1,74.8,89.4,102.6,137.8,25.5-143.3,3.1-215-20.5-238.6s-96.2-45-241.2-20c53.8,28.8,105,66.2,150,111.2,2.8,2.9,5.6,5.8,8.3,8.7ZM385,67.5h0s0,0,0,0h0ZM385,67.5c2.6.8,5.3,1.7,7.9,2.5,73.5,24.3,145.5,68.5,205.9,131.2,63.8,63.8,110,137.5,133.8,213.8-25,71.3-62.5,140-121.2,198.8-58.8,57.5-128.8,96.2-198.8,121.2-76.2-23.8-150-70-213.8-133.8-63.8-63.8-110-137.5-133.8-213.8,25-70,63.8-140,121.2-198.8,58.8-57.5,128.8-96.2,198.8-121.2ZM373.8,346.2c-12.5-12.5-32.5,7.5-20,20h0l30,30-39.4,39.4-29.4-29.4c-13.8-12.5-33.8,7.5-20,20l29.4,29.4-39.4,39.4-30-30c-12.5-12.5-32.5,7.5-20,20h0l30,30-17.5,17.5c-12.5,13.7,6.2,33.8,20,20h0s17.5-17.5,17.5-17.5l28.8,28.8c12.5,12.5,32.5-7.5,20-20l-28.8-28.8,39.4-39.4,29.4,29.4c12.5,12.5,32.5-7.5,20-20l-29.4-29.4,39.4-39.4,28.8,28.8c12.5,12.5,32.5-7.5,20-20l-28.7-28.8,39.4-39.4,29.4,29.4c12.5,12.5,32.5-7.5,20-20l-29.4-29.4,39.4-39.4,28.8,28.8c12.5,12.5,32.5-7.5,20-20l-28.7-28.8,17.5-17.5c12.5-12.5-7.5-32.5-20-20l-17.5,17.5-30-30c-12.5-12.5-32.5,7.5-20,20h0s30,30,30,30l-39.4,39.4-29.4-29.4c-13.8-12.5-32.5,7.5-20,20l29.4,29.4-39.4,39.4-30-30Z";

// SVG settings

const svgTMobile = {
  path: svgPathTMobile,
  color: "e11075",
  scalar: 10,
};

const svgFootball = {
  path: svgPathFootball,
  color: "89664c",
  scalar: 7,
};

// =-=-=-=-=-=-=-=-=-=-=-=-=
// Mixed fireworks - round 2
// =-=-=-=-=-=-=-=-=-=-=-=-=

const confettiWrapper = document.querySelector("#tsw-confetti").querySelector("xpr-npi-content").shadowRoot;

confettiWrapper.getElementById("tsw-confetti-magenta-button-1").addEventListener("click", () => {
  // Number of corners
  runConfetti(generateConfettiCornersRound2, 2);
});

confettiWrapper.getElementById("tsw-confetti-magenta-button-2").addEventListener("click", () => {
  // Number of corners
  runConfetti(generateConfettiCornersRound2, 4);
});

confettiWrapper.getElementById("tsw-confetti-logos-button-1").addEventListener("click", () => {
  // Number of corners, emoji array, SVG array
  runConfetti(generateConfettiCornersRound2, 2, [], [svgTMobile]);
});

confettiWrapper.getElementById("tsw-confetti-logos-button-2").addEventListener("click", () => {
  // Number of corners, emoji array, SVG array
  runConfetti(generateConfettiCornersRound2, 4, [], [svgTMobile]);
});

confettiWrapper.getElementById("tsw-confetti-logos-emojis-button-1").addEventListener("click", () => {
  // Number of corners, emoji array, SVG array
  runConfetti(generateConfettiCornersRound2, 2, [], [svgTMobile, svgFootball]);
});

confettiWrapper.getElementById("tsw-confetti-logos-emojis-button-2").addEventListener("click", () => {
  // Number of corners, emoji array, SVG array
  runConfetti(generateConfettiCornersRound2, 4, [], [svgTMobile, svgFootball]);
});

confettiWrapper.getElementById("tsw-confetti-big-button").addEventListener("click", () => {
  // Number of corners, emoji array, SVG array
  runConfetti(generateConfettiCornersRound2, 4, [], [svgTMobile, svgFootball]);
});

// =-=-=-=-=-=-=-=-=-=-=-=-=
// Confetti on page load
// =-=-=-=-=-=-=-=-=-=-=-=-=

window.addEventListener("load", () => {
  runConfetti(generateConfettiCornersRound2, 4, [], [svgTMobile]);
});
