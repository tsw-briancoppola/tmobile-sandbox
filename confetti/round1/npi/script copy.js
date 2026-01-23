const defaults = { startVelocity: 30, spread: 360, zIndex: 0, scalar: 1.4 };

const randomInRange = (min, max) => Math.random() * (max - min) + min;

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

const generateConfettiFireworksMixed = (seconds, emojis) => {
  const duration = seconds * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 100 * (timeLeft / duration);

    // Standard Confetti Config
    const config = {
      ...defaults,
      particleCount,
      ticks: 400,
      colors: ["#e20074", "#a61765"],
    };

    // Fire standard confetti
    confetti({ ...config, origin: { x: randomInRange(0.1, 0.5), y: Math.random() - 0.2 } });
    confetti({ ...config, origin: { x: randomInRange(0.5, 0.9), y: Math.random() - 0.2 } });

    // Pre-map emojis if they exist
    const emojiShapes =
      emojis?.length > 0 ? emojis.map((emoji) => confetti.shapeFromText({ text: emoji, scalar: 3 })) : [];

    // Only fire emoji confetti if emojis argument is passed
    if (emojiShapes.length > 0) {
      const particleCountEmoji = 10 * (timeLeft / duration);

      const configEmoji = {
        ...defaults,
        particleCount: particleCountEmoji,
        ticks: 400,
        shapes: emojiShapes,
        scalar: 8,
      };

      confetti({
        ...configEmoji,
        origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
      });
    }
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

// =-=-=-=-=-=-=-=-
// Confetti options
// =-=-=-=-=-=-=-=-

const confettiWrapper = document.querySelector("#tsw-confetti").querySelector("xpr-npi-content").shadowRoot;

// Magenta fireworks

confettiWrapper.getElementById("tsw-confetti-magenta-button-1").addEventListener("click", () => {
  // Number of seconds
  generateConfettiFireworks(2);
});

confettiWrapper.getElementById("tsw-confetti-magenta-button-2").addEventListener("click", () => {
  generateConfettiCorners();
});

confettiWrapper.getElementById("tsw-confetti-magenta-button-3").addEventListener("click", () => {
  // Number of seconds
  generateConfettiRain(3);
});

// Football fireworks

confettiWrapper.getElementById("tsw-confetti-football-button-1").addEventListener("click", () => {
  // Number of seconds
  generateConfettiFireworks(2, ["🏈", "🏆"]);
});

confettiWrapper.getElementById("tsw-confetti-football-button-2").addEventListener("click", () => {
  // Number of seconds and emojis
  generateConfettiCorners(["🏈", "🏆"]);
});

confettiWrapper.getElementById("tsw-confetti-football-button-3").addEventListener("click", () => {
  // Number of seconds
  generateConfettiRain(4, ["🏈", "🏆"]);
});

// Mixed fireworks

confettiWrapper.getElementById("tsw-confetti-mixed-button-1").addEventListener("click", () => {
  // Number of seconds
  generateConfettiFireworksMixed(2, ["🏈"]);
});

confettiWrapper.getElementById("tsw-confetti-mixed-button-2").addEventListener("click", () => {
  // Number of seconds and emojis
  generateConfettiCornersMixed(["🏈"]);
});
