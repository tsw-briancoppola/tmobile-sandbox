const defaults = { startVelocity: 30, spread: 360, zIndex: 0, scalar: 1.4 };

const randomInRange = (min, max) => Math.random() * (max - min) + min;

// =-=-=-=-=-=-=-=-=
// Throttle function
// =-=-=-=-=-=-=-=-=

const runConfetti = (() => {
  let last = 0;
  const delay = 1000; // 1 second delay

  console.log("xxx");

  return (fn, ...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args); // Correctly applies the arguments here
    }
  };
})();

// =-=-=-=-=-=-=-=-=
// Confetti function
// =-=-=-=-=-=-=-=-=

const generateConfettiFireworks = (seconds, emojis) => {
  const duration = seconds * 1000;
  const animationEnd = Date.now() + duration;

  // Pre-map emojis if they exist
  const emojiShapes =
    emojis?.length > 0 ? emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar: 3 })) : [];

  // Start interval
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 100 * (timeLeft / duration);

    const config = {
      ...defaults,
      particleCount,
      origin: { y: Math.random() - 0.2 },
      ticks: 400, // Emojis often need more ticks to be visible as they fall
    };

    if (emojiShapes.length > 0) {
      config.shapes = emojiShapes;
      config.scalar = 3;
    } else {
      config.colors = ["#e20074", "#a61765"];
    }

    confetti({ ...config, origin: { x: randomInRange(0.1, 0.5), y: Math.random() - 0.2 } });
    confetti({ ...config, origin: { x: randomInRange(0.5, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

const generateConfettiCorners = (emojis) => {
  const width = window.innerWidth;
  const dynamicVelocity = Math.max(45, width / 15); // Adjust '15' to change sensitivity

  const config = { ...defaults };

  const emojiShapes =
    emojis?.length > 0 ? emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar: 3 })) : [];

  if (emojiShapes.length > 0) {
    config.shapes = emojiShapes;
    config.scalar = 3;
  } else {
    config.colors = ["#e20074", "#a61765"];
    config.scalar = 1.4;
  }

  const fire = (xOrigin, angle) => {
    // The "distance" burst
    confetti({
      ...config,
      particleCount: 400,
      angle: angle,
      spread: 100,
      origin: { x: xOrigin, y: 1 },
      // 2. Apply dynamic velocity here
      startVelocity: dynamicVelocity,
      gravity: 0.7,
      ticks: 100,
    });

    // The "source" burst
    confetti({
      ...config,
      particleCount: 120,
      angle: angle,
      spread: 100,
      origin: { x: xOrigin, y: 1 },
      // 3. Scale the source burst proportionally
      startVelocity: dynamicVelocity * 0.4,
      gravity: 1,
      ticks: 50,
    });
  };

  fire(0, 60);
  fire(1, 120);
};

const generateConfettiRain = (seconds, emojis) => {
  const duration = seconds * 1000;
  const animationEnd = Date.now() + duration;

  // Pre-map emojis if they exist
  const emojiShapes =
    emojis && emojis.length > 0 ? emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar: 3 })) : [];

  // Start interval
  const intervalId = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      return;
    }

    const config = {
      particleCount: 20,
      startVelocity: 15,
      gravity: 2.5,
      origin: { x: Math.random(), y: -0.1 },
      ticks: 200,
    };

    if (emojiShapes.length > 0) {
      config.shapes = emojiShapes;
      config.scalar = 3;
    } else {
      config.colors = ["#e20074", "#9c135e"];
      config.scalar = 1.4;
    }

    confetti(config);
  }, 30);
};

const generateConfettiFireworksMixed = (seconds, emojis, svgConfigs = []) => {
  console.log(svgConfigs);

  const duration = seconds * 1000;
  const animationEnd = Date.now() + duration;
  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  // 1. Pre-map everything for performance
  const emojiShapes =
    emojis?.length > 0 ? emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar: 3 })) : [];

  // Map SVGs into objects holding the shape AND its intended color
  const svgShapes = svgConfigs.map((cfg) => ({
    shape: confetti.shapeFromPath({ path: cfg.path }),
    color: cfg.color,
    scalar: cfg.scalar || 5, // Optional: individual size support
  }));

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const ratio = timeLeft / duration;

    // Standard magenta fireworks
    confetti({
      particleCount: 120 * ratio,
      spread: 400,
      scalar: 1.8,
      colors: ["#e20074", "#a61765"],
      origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
    });

    // Emojis
    if (emojiShapes.length > 0) {
      confetti({
        particleCount: 15 * ratio,
        shapes: emojiShapes,
        scalar: 6,
        origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
      });
    }

    // SVGs - fire each individually to lock its color
    svgShapes.forEach(({ shape, color, scalar }) => {
      confetti({
        particleCount: 4, // Low count per SVG type to prevent overcrowding
        shapes: [shape],
        colors: [color], // Forces this SVG to ONLY use this color
        scalar: scalar,
        origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
      });
    });
  }, 250);
};

const generateConfettiCornersMixed = (emojis) => {
  const dynamicVelocity = Math.max(45, window.innerWidth / 15);

  const fireSet = (xOrigin, angle, overrides) => {
    const base = { ...defaults, ...overrides, angle, origin: { x: xOrigin, y: 1 }, spread: 100 };

    // Distance burst
    confetti({
      ...base,
      particleCount: overrides.shapes ? 10 : 400,
      startVelocity: dynamicVelocity,
      gravity: 0.7,
      ticks: 200,
    });
    // Source burst
    confetti({
      ...base,
      particleCount: overrides.shapes ? 5 : 120,
      startVelocity: dynamicVelocity * 0.4,
      gravity: 1,
      ticks: 100,
    });
  };

  // Launch standard colors
  [0, 1].forEach((x, i) => fireSet(x, i === 0 ? 60 : 120, { colors: ["#e20074", "#a61765"], scalar: 1.4 }));

  // Launch emojis if they exist
  if (emojis?.length > 0) {
    const shapes = emojis.map((text) => confetti.shapeFromText({ text, scalar: 3 }));
    [0, 1].forEach((x, i) => fireSet(x, i === 0 ? 60 : 120, { shapes, scalar: 8 }));
  }
};

const generateConfettiCornersRound2 = (corners, emojis) => {
  const width = window.innerWidth;
  const dynamicVelocity = Math.max(45, width / 15); // Adjust '15' to change sensitivity

  const config = { ...defaults };

  const emojiShapes =
    emojis?.length > 0 ? emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar: 3 })) : [];

  if (emojiShapes.length > 0) {
    config.shapes = emojiShapes;
    config.scalar = 3;
  } else {
    config.colors = ["#e20074", "#a61765"];
    config.scalar = 1.4;
  }

  const fire = (xOrigin, yOrigin, angle) => {
    // The "distance" burst
    confetti({
      ...config,
      particleCount: 400,
      angle: angle,
      spread: 100,
      origin: { x: xOrigin, y: yOrigin },
      // 2. Apply dynamic velocity here
      startVelocity: dynamicVelocity,
      gravity: 0.7,
      ticks: 100,
    });

    // The "source" burst
    confetti({
      ...config,
      particleCount: 120,
      angle: angle,
      spread: 100,
      origin: { x: xOrigin, y: yOrigin },
      // 3. Scale the source burst proportionally
      startVelocity: dynamicVelocity * 0.35,
      gravity: 1,
      ticks: 50,
    });
  };

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

const svgPathNetflix =
  "M1847.03,984.86c29.3,2.24,58.55,4.65,87.77,7.25V476.78h-87.77v508.07ZM435.07,793.66l-114.32-316.88h-83.42v559.95c29.2-4.16,58.46-8.14,87.77-11.96v-304.5l101.65,292c31.97-3.71,64-7.22,96.09-10.52V476.78h-87.77v316.88ZM607.24,993.6c80.9-7.35,162.17-13.41,243.81-18.11v-86.49c-52.16,3.02-104.17,6.58-156.03,10.66v-130.93c34.03-.34,78.83-1.38,118.53-.88v-86.49c-31.71-.08-82.68.44-118.53.9v-118.2h156.03v-87.26h-243.81v516.81ZM907.31,564.04h91.86v404.42c29.21-1.1,58.47-2.01,87.77-2.78v-401.64h91.86v-87.26h-271.49v87.26ZM1235.08,963.32l87.77-.02v-199.67h118.98v-86.48h-118.98v-113.09h157.25v-87.26h-245.02v486.53ZM2321.66,476.78h-96.41l-63.56,147.31-57.1-147.31h-94.96l102.05,263.22-111.4,258.22c30.82,3.01,61.56,6.21,92.26,9.6l64.79-150.14,64.17,165.51c33.42,4.3,66.76,8.78,100.04,13.53l.14-.06-114.34-294.89,114.34-264.99ZM1624.13,476.73h-87.77v490.87c79.77,2.75,159.2,6.77,238.31,12.04v-86.48c-50.04-3.34-100.22-6.17-150.54-8.51v-407.93Z";

const svgPathHulu =
  "M131,249h17.2v-71.2h-17.2v71.2ZM100.8,228.7c0,2.5-2.1,4.6-4.6,4.6h-10c-2.5,0-4.6-2.1-4.6-4.6v-28.7h-17.2v30.1c0,12.3,7.9,18.8,19.5,18.8h16.8c10.7,0,17.2-7.7,17.2-18.8v-30.1h-17.2c.1,0,.1,27.8.1,28.7ZM197.5,200v28.7c0,2.5-2.1,4.6-4.6,4.6h-10c-2.5,0-4.6-2.1-4.6-4.6v-28.7h-17.2v30.1c0,12.3,7.9,18.8,19.5,18.8h16.8c10.7,0,17.2-7.7,17.2-18.8v-30.1h-17.1ZM32.7,200h-11c-3.9,0-5.8,1-5.8,1v-23.2h-17.2v71.1h17.1v-28.6c0-2.5,2.1-4.6,4.6-4.6h10c2.5,0,4.6,2.1,4.6,4.6v28.7h17.2v-31c0-13-8.7-18-19.5-18Z";

const svgPathDoordash =
  "M3.4,64.2v10.1h2.5c1.3,0,2.5-.6,3.4-1.5.9-1,1.4-2.2,1.4-3.6,0-1.3-.4-2.6-1.4-3.6-.9-.9-2.2-1.5-3.4-1.5,0,0-2.5,0-2.5,0ZM5.9,61c4.7,0,8.3,3.7,8.3,8.2s-3.6,8.3-8.3,8.3H.4c-.2,0-.4-.2-.4-.4v-15.7c0-.2.2-.4.4-.4h5.6ZM26.3,74.6c2.1,0,4.1-1.3,4.9-3.3.8-2,.4-4.3-1.1-5.9-1.5-1.5-3.8-2-5.8-1.2-2,.8-3.3,2.8-3.3,5,0,3,2.4,5.4,5.3,5.4M26.3,60.6c5,0,8.7,3.9,8.7,8.6s-3.8,8.6-8.7,8.6-8.7-3.9-8.7-8.6,3.8-8.6,8.7-8.6ZM47.1,74.6c2.9,0,5.3-2.4,5.3-5.4,0-3-2.4-5.4-5.3-5.4-2.9,0-5.3,2.4-5.3,5.4s.6,2.8,1.5,3.8c1,1,2.3,1.6,3.7,1.6M47.1,60.6c4.9,0,8.7,3.9,8.7,8.6s-3.8,8.6-8.7,8.6-8.7-3.9-8.7-8.6,3.8-8.6,8.7-8.6ZM67.3,64.2h-3.6v4.4h3.6c.6,0,1.1-.2,1.5-.6.4-.4.7-.9.7-1.5,0-.6-.2-1.2-.6-1.6-.4-.4-1-.7-1.6-.6h0ZM60.3,61.4c0-.2.2-.4.4-.4h6.7c3.2,0,5.5,2.4,5.5,5.4,0,2-1.1,3.9-2.9,4.8l3.1,5.6c0,.1,0,.3,0,.4,0,.1-.2.2-.4.2h-2.7c-.2,0-.3,0-.4-.2l-3-5.6h-3v5.3c0,.2-.2.4-.4.4h-2.6c-.2,0-.4-.2-.4-.4v-15.6h0,0ZM81.9,64.2v10.1h2.5c1.3,0,2.5-.6,3.4-1.5.9-1,1.4-2.2,1.4-3.6,0-1.3-.4-2.6-1.4-3.6-.9-.9-2.2-1.5-3.5-1.5h-2.5,0ZM84.4,61c4.7,0,8.3,3.7,8.3,8.2s-3.6,8.2-8.3,8.2h-5.6c-.2,0-.4-.2-.4-.4v-15.7c0-.2.2-.4.4-.4h5.6s0,0,0,0ZM103.2,65.1l-1.9,5.4h3.9s-1.9-5.4-2-5.4ZM100.1,73.6l-1.3,3.6c0,.2-.2.3-.4.3h-2.8c-.1,0-.3,0-.4-.2,0-.1,0-.3,0-.4l6-15.6c0-.2.2-.3.4-.3h3.1c.2,0,.3,0,.4.3l6,15.6c0,.1,0,.3,0,.4,0,.1-.2.2-.4.2h-2.8c-.2,0-.3-.1-.4-.3l-1.3-3.6h-6.2ZM114.3,65.4c0-2.6,2.2-4.8,5.6-4.8,1.8,0,3.7.7,5,1.9.2.2.2.4,0,.6,0,0,0,0,0,0l-1.5,1.6c-.2.2-.4.2-.6,0h0c-.7-.7-1.7-1.1-2.7-1.1-1.4,0-2.4.8-2.4,1.8,0,3.1,8.1,1.3,8.1,7.2s-2.2,5.2-6.1,5.2c-2.2,0-4.3-.8-5.8-2.4-.2-.2-.2-.4,0-.6h0s1.5-1.5,1.5-1.5c.2-.2.4-.2.6,0h0c.9.9,2.2,1.5,3.5,1.5,1.7,0,2.8-.9,2.8-2.1,0-3.1-8.1-1.3-8.1-7.2M140.6,61.4v6.2h-6.9v-6.2c0-.2-.2-.4-.4-.4h-2.6c-.2,0-.4.2-.4.4v15.6c0,.2.2.4.4.4h2.6c.2,0,.4-.2.4-.4v-6.3h6.9v6.3c0,.2.2.4.4.4h2.6c.2,0,.4-.2.4-.4v-15.6c0-.2-.2-.4-.4-.4h-2.6c-.2,0-.4.2-.4.4h0ZM103.6,10.5C100.1,4,93.3,0,85.9,0H29.7c-.8,0-1.5.5-1.8,1.2-.3.7-.1,1.5.4,2.1l12.2,12.2c1.1,1.1,2.5,1.7,4.1,1.7h39.6c2.8,0,5.1,2.2,5.2,5s-2.2,5.1-5.1,5.1h-27.3c-.8,0-1.5.5-1.8,1.2-.3.7-.1,1.5.4,2.1l12.2,12.2c1.1,1.1,2.6,1.7,4.1,1.7h12.3c16.1,0,28.2-17,19.2-33.8";

// Mixed fireworks + emojis and svgs (fireworks)

// SVG settings
const svgNetflix = {
  path: svgPathNetflix,
  color: "E50914",
  scalar: 5,
};

const svgHulu = {
  path: svgPathHulu,
  color: "1ce783",
  scalar: 10,
};

const svgDoordash = {
  path: svgPathDoordash,
  color: "ff3008",
  scalar: 12,
};

// Magenta fireworks

// document.getElementById("tsw-confetti-magenta-button-1").addEventListener("click", () => {
//   // Number of seconds
//   runConfetti(generateConfettiFireworks, 2);
// });

// document.getElementById("tsw-confetti-magenta-button-2").addEventListener("click", () => {
//   runConfetti(generateConfettiCorners);
// });

// document.getElementById("tsw-confetti-magenta-button-3").addEventListener("click", () => {
//   // Number of seconds
//   runConfetti(generateConfettiRain, 3);
// });

// // Football fireworks

// document.getElementById("tsw-confetti-football-button-1").addEventListener("click", () => {
//   // Number of seconds
//   runConfetti(generateConfettiFireworks, 2, ["🏈", "🏆"]);
// });

// document.getElementById("tsw-confetti-football-button-2").addEventListener("click", () => {
//   // Number of seconds and emojis
//   runConfetti(generateConfettiCorners, ["🏈", "🏆"]);
// });

// document.getElementById("tsw-confetti-football-button-3").addEventListener("click", () => {
//   // Number of seconds
//   runConfetti(generateConfettiRain, 4, ["🏈", "🏆"]);
// });

// // Mixed fireworks

// document.getElementById("tsw-confetti-mixed-button-1").addEventListener("click", () => {
//   // Number of seconds
//   generateConfettiFireworksMixed(2, ["🏈"]);
// });

// document.getElementById("tsw-confetti-mixed-button-2").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈"]);
// });

// //

// document.getElementById("tsw-confetti-emojis-button-2").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈"]);
// });

// document.getElementById("tsw-confetti-emojis-button-3").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈", "✈️", "🤩"]);
// });

// document.getElementById("tsw-confetti-emojis-button-4").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈", "✈️", "🤩", "🚗"]);
// });

// document.getElementById("tsw-confetti-emojis-button-5").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈", "✈️", "🤩", "🚗", "🎸"]);
// });

// //

// document.getElementById("tsw-confetti-svgs-button-1").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈"], [svgNetflix]);
// });

// document.getElementById("tsw-confetti-svgs-button-2").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈"], [svgNetflix, svgHulu]);
// });

// document.getElementById("tsw-confetti-svgs-button-3").addEventListener("click", () => {
//   // Number of seconds and emojis
//   generateConfettiFireworksMixed(2, ["🏈"], [svgNetflix, svgHulu, svgDoordash]);
// });

// =-=-=-=-=-=-=-=-=-=-=-=-=
// Mixed fireworks - round 2
// =-=-=-=-=-=-=-=-=-=-=-=-=

document.getElementById("tsw-confetti-magenta-button-1").addEventListener("click", () => {
  // Number of seconds
  runConfetti(generateConfettiCornersRound2, 2);
});

document.getElementById("tsw-confetti-magenta-button-2").addEventListener("click", () => {
  // Number of seconds
  runConfetti(generateConfettiCornersRound2, 4);
});
