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

const colors = {
  magenta: "#e20074",
  berry: "#a7005a",
  darkBerry: "#770141",
  white: "#ffffff",
  black: "#111111",
};

const confettiColorFamilies = {
  magenta: [colors.magenta, colors.berry, colors.darkBerry],
  full: [colors.white, colors.berry, colors.black],
};

const generateConfetti = ({ corners, ticks, zIndex, particleCount, colorFamily, emojis = [], svgs = [] }) => {
  // Adjust particle count and velocity based on screen width
  const responsiveMultiplier = Math.min(1, window.innerWidth / 1920);
  const adjustedParticleCount = Math.floor(particleCount * responsiveMultiplier);
  const dynamicVelocity = Math.max(45, window.innerWidth / 15);

  const config = { scalar: 1.4 };

  // Prepare Emojis
  const emojiShapes = emojis?.map((text) => confetti.shapeFromText({ text, scalar: 3 })) || [];

  // Map SVGs
  const svgShapes = svgs.map((cfg) => ({
    shape: confetti.shapeFromPath({ path: cfg.path }),
    color: cfg.colors[colorFamily],
    scalar: cfg.scalar || 5,
  }));

  // Fire confetti function
  const fire = (xOrigin, yOrigin, angle) => {
    const base = {
      angle,
      spread: 100,
      ticks: ticks,
      colors: confettiColorFamilies[colorFamily],
      zIndex: zIndex,
      origin: { x: xOrigin, y: yOrigin },
    };

    // Standard confetti burst (with default colors)
    confetti({
      ...config,
      ...base,
      particleCount: adjustedParticleCount / corners,
      startVelocity: dynamicVelocity,
      gravity: 0.7,
    });
    confetti({
      ...config,
      ...base,
      particleCount: adjustedParticleCount / 10,
      startVelocity: dynamicVelocity * 0.35,
      gravity: 1,
      ticks: ticks / 2,
    });

    // Adjust emoji and SVG quantity based on screen width
    const itemQuantity = Math.max(2, Math.floor(12 * responsiveMultiplier));

    // Emoji burst
    if (emojiShapes.length > 0) {
      confetti({
        ...base,
        shapes: emojiShapes,
        particleCount: itemQuantity,
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
        particleCount: itemQuantity,
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

// =-=-=-=-=-=-=-=-=-=-=-
// SVG paths and settings
// =-=-=-=-=-=-=-=-=-=-=-

const svgPathTMobileBadge =
  "M0,0v80.3h80.2V0H0ZM19.2,38.1h10v10h-10v-10ZM61.1,48.1h-10v-10h10v10ZM61.1,32.2h-3v-.5c0-8-4.5-13-13-13h-.5v35.8c0,5,2,7,7,7h1.5v3.5h-25.9v-3.5h1.5c5,0,7-2,7-7V18.6h-.5c-8.5,0-13,5-13,13v.5h-3V15.2h41.9v17Z";

const svgPathTMobileTuesdays =
  "M77.9,49.2h-9.3v-17.8h34.5v17.8h-9.4v52.3h-15.8v-52.3ZM109,31.4v41.7c0,7.7.1,12.8.4,15.1.3,2.4,1.1,4.6,2.4,6.8,1.3,2.2,3.5,3.9,6.2,5.3,2.8,1.4,6,2,9.7,2s6.2-.5,8.6-1.8c2.4-1.1,4.4-2.8,5.9-5,1.5-2.2,2.4-4.3,2.7-6.4.3-2,.4-5.7.4-10.9V31.4h-15.8v51.6c0,3.4-.1,5.6-.4,6.5-.3.9-.9,1.4-1.9,1.4s-1.5-.4-1.7-1.2c-.3-.8-.4-2.7-.4-5.7V31.4h-16ZM178.6,88.2h-11.7v-16.2h9.9v-12.9h-9.9v-14.1h10.6v-13.6h-26.4v70.2h27.5v-13.4ZM186.8,64.2c1.3,1.3,3.9,3.5,7.7,6.4,3.9,2.9,6.4,4.9,7.3,6.3.9,1.2,1.5,3.9,1.5,8s-.3,3.2-.8,4.1c-.5.9-1.3,1.5-2.4,1.5s-1.7-.4-2.1-1.1c-.4-.8-.7-2.4-.7-4.9v-8.4h-14.7v4.5c0,5.2.4,9.2,1.3,12,.9,2.8,2.9,5.1,5.9,6.9,2.9,1.9,6.5,2.7,10.8,2.7s7.2-.8,10.1-2.4c2.9-1.6,4.8-3.5,5.9-5.9,1.1-2.3,1.5-5.9,1.5-10.8s-.9-11.6-2.7-14.7c-1.9-3.1-6.3-6.9-13.2-11.6-2.4-1.6-3.9-3.1-4.4-4.3-.5-1.2-.8-2.9-.8-5.2s.3-3.1.7-4c.5-.9,1.2-1.3,2.1-1.3s1.5.3,1.9.9.5,2.1.5,4.5v5.1h14.7v-2.7c0-5.5-.4-9.3-1.5-11.6-.9-2.3-2.8-4.1-5.7-5.7-2.9-1.5-6.4-2.3-10.4-2.3s-6.9.7-9.6,2c-2.7,1.3-4.5,3.3-5.7,5.7-1.2,2.4-1.7,6.3-1.7,11.6s.4,6.7,1.2,9.1c.8,2.4,2,4.1,3.3,5.5ZM167.7,107.7c-2,10.3-3.8,20.5-4.6,27.5-.3-4.4-1.9-14.6-4.2-27.5h-14.6l11.5,43.7v25.4h14.6v-25.4l11.9-43.7h-14.8ZM101.2,112.7c1.3,1.7,2.3,3.8,2.5,5.9.4,2.1.5,6.3.5,12.6v26c0,5.9-.3,9.9-.8,11.9-.5,2-1.3,3.6-2.7,4.7-1.2,1.2-2.8,2-4.7,2.4-1.9.4-4.7.7-8.5.7h-20v-69.2h11.8c7.6,0,12.9.4,15.6,1.2,2.7.8,4.8,2,6.2,3.8M88.4,127.3c0-3-.1-5-.3-5.8-.1-.8-.5-1.5-1.2-1.9-.5-.4-1.2-.7-3-.7v46.4c2.3,0,3.1-.4,3.6-1.3.5-1.1.8-3.8.8-8.2v-28.6ZM137.5,107.7l9.4,69.2h-16.2l-.9-13.3h-5.6l-1.1,13.3h-16.4l8.9-69.2h22ZM129.5,151.8c-.8-7.5-1.6-18.2-2.4-29.4-1.6,12.7-2.7,23.5-3.1,29.4h5.5ZM187.2,140.2c1.3,1.3,3.9,3.5,7.7,6.4,3.9,2.9,6.4,4.9,7.3,6.3.9,1.2,1.5,3.9,1.5,8s-.3,3.2-.8,4.1c-.5.9-1.3,1.5-2.4,1.5s-1.7-.4-2.1-1.1c-.4-.8-.7-2.4-.7-4.9v-8.4h-14.7v4.5c0,5.2.4,9.2,1.3,12,.9,2.8,2.9,5.1,5.9,6.9,2.9,1.9,6.5,2.7,10.8,2.7s7.2-.8,10.1-2.4c2.9-1.6,4.8-3.5,5.9-5.9,1.1-2.3,1.5-5.9,1.5-10.8s-.9-11.6-2.7-14.7c-1.9-3.1-6.3-6.9-13.2-11.6-2.4-1.6-3.9-3.1-4.4-4.3-.5-1.2-.8-2.9-.8-5.2s.3-3.1.7-4c.5-.9,1.2-1.3,2.1-1.3s1.5.3,1.9.9c.4.7.5,2.1.5,4.5v5.1h14.7v-2.7c0-5.5-.4-9.3-1.5-11.6-.9-2.3-2.8-4.1-5.7-5.7-2.9-1.5-6.4-2.3-10.4-2.3s-6.9.7-9.6,2c-2.7,1.3-4.5,3.3-5.7,5.7-1.2,2.4-1.7,6.3-1.7,11.6s.4,6.7,1.2,9.1c.8,2.4,2,4.1,3.3,5.5M32.1,125.5l14.4,7.7v.2l-14.4,7.7v4.8h25.9v-5.2h-14.6v-.2l11.4-6.3v-1.7l-11.4-6.4v-.2h14.6v-5.2h-25.9v4.9ZM45,78.7h-.2c-1.2-2-3.3-3.2-5.9-3.2s-6.9,2.3-6.9,7.6v9.9h25.9v-9.7c0-5.6-3.2-8-7.2-8s-4.8,1.2-5.8,3.4ZM36.7,83.8c0-1.7,1.2-2.8,3-2.8s3,1.1,3,2.8v3.9h-6v-3.9ZM53.4,83.9v3.8h-6.2v-3.8c0-2.1,1.2-3.2,3.1-3.2s3.1,1.1,3.1,3.2ZM58,72.4v-5.2h-25.9v5.2h25.9ZM58,63.2v-14.5h-4.9v9.3h-21.1v5.2h25.9ZM36.9,31.4h-4.9v15.3h25.9v-15.3h-4.9v10h-5.9v-9.6h-4.9v9.6h-5.5v-10ZM36.9,177v-6.6h21.1v-5.2h-21.1v-6.6h-4.9v18.5h4.9ZM45.7,160.8h4.3v-10.6h-4.3v10.6ZM58.6,106.8c0-7.1-5.2-11-13.6-11s-13.6,3.9-13.6,11,5.2,11,13.6,11,13.6-3.9,13.6-11ZM53.5,106.8c0,3.6-2.9,5.6-8.5,5.6s-8.5-1.9-8.5-5.6,2.9-5.6,8.5-5.6,8.5,1.9,8.5,5.6Z";

const svgPathTMobileTuesdaysBadge =
  "M53.5,106.8c0,3.6-2.9,5.6-8.5,5.6s-8.5-1.9-8.5-5.6,2.9-5.6,8.5-5.6,8.5,1.9,8.5,5.6ZM124,151.8h5.5c-.8-7.5-1.6-18.2-2.4-29.4-1.6,12.7-2.7,23.5-3.1,29.4ZM50.3,80.7c-1.9,0-3.1,1.1-3.1,3.2v3.8h6.2v-3.8c0-2.1-1.2-3.2-3.1-3.2ZM39.7,81c-1.8,0-3,1.1-3,2.8v3.9h6v-3.9c0-1.7-1.2-2.8-3-2.8ZM86.9,119.6c-.5-.4-1.2-.7-3-.7v46.4c2.3,0,3.1-.4,3.6-1.3.5-1.1.8-3.8.8-8.2v-28.6h.1c0-2.9-.1-4.9-.3-5.7,0-.8-.5-1.5-1.2-1.9ZM250,.5v209.2H0V.5h250ZM151.1,101.6h27.5v-13.4h-11.7v-16.2h9.9v-12.9h-9.9v-14.1h10.6v-13.6h-26.4v70.2ZM109,73.1c0,7.7,0,12.8.4,15.1.3,2.4,1.1,4.6,2.4,6.8,1.3,2.2,3.5,3.9,6.2,5.3,2.8,1.4,6,2,9.7,2s6.2-.5,8.6-1.8c2.4-1.1,4.4-2.8,5.9-5,1.5-2.2,2.4-4.3,2.7-6.4.3-2,.4-5.7.4-10.9V31.4h-15.8v51.6c0,3.4-.1,5.6-.4,6.5-.3.9-.9,1.4-1.9,1.4s-1.5-.4-1.7-1.2c-.3-.8-.4-2.7-.4-5.7V31.4h-16.1v41.7ZM68.6,49.2h9.3v52.3h15.8v-52.3h9.4v-17.8h-34.5v17.8ZM32,46.7h25.9v-15.3h-4.9v10h-5.9v-9.6h-4.9v9.6h-5.5v-10h-4.7v15.3ZM32,63.2h26v-14.5h-4.9v9.3h-21.1v5.2ZM32.1,67.2v5.2h25.9v-5.2h-25.9ZM32,93h25.9v-9.7c0-5.6-3.2-8-7.2-8s-4.8,1.2-5.8,3.4h-.1c-1.2-2-3.3-3.2-5.9-3.2s-6.9,2.3-6.9,7.6v9.9ZM58,165.2h-21.1v-6.6h-4.9v18.5h4.9v-6.7h21.1v-5.2ZM50,160.8v-10.6h-4.3v10.6h4.3ZM58,120.7h-25.9v4.8l14.4,7.7v.2l-14.4,7.7v4.8h25.9v-5.2h-14.6v-.2l11.4-6.3v-1.7l-11.4-6.4v-.2h14.6v-5.2ZM58.6,106.8c0-7.1-5.2-11-13.6-11s-13.6,3.9-13.6,11,5.2,11,13.6,11,13.6-3.9,13.6-11ZM104.2,131.2c0-6.3-.1-10.5-.5-12.6-.2-2.1-1.2-4.2-2.5-5.9h-.1c-1.4-1.8-3.5-3-6.2-3.8-2.7-.8-8-1.2-15.6-1.2h-11.8v69.2h20c3.8,0,6.6-.3,8.5-.7,1.9-.4,3.5-1.2,4.7-2.4,1.4-1.1,2.2-2.7,2.7-4.7s.8-6,.8-11.9v-26ZM146.9,176.9l-9.4-69.2h-21.9l-8.9,69.2h16.4l1.1-13.3h5.6l.9,13.3h16.2ZM182.3,107.7h-14.6c-2,10.3-3.8,20.5-4.6,27.5-.3-4.4-1.9-14.6-4.2-27.5h-14.6l11.5,43.7v25.4h14.6v-25.4l11.9-43.7ZM197.3,84.5v-8.4h-14.7v4.5c0,5.2.4,9.2,1.3,12,.9,2.8,2.9,5.1,5.9,6.9,2.9,1.9,6.5,2.7,10.8,2.7s7.2-.8,10.1-2.4c2.9-1.6,4.8-3.5,5.9-5.9,1.1-2.3,1.5-5.9,1.5-10.8s-.9-11.6-2.7-14.7c-1.9-3.1-6.3-6.9-13.2-11.6-2.4-1.6-3.9-3.1-4.4-4.3s-.8-2.9-.8-5.2.3-3.1.7-4c.5-.9,1.2-1.3,2.1-1.3s1.5.3,1.9.9c.4.6.5,2.1.5,4.5v5.1h14.7v-2.7c0-5.5-.4-9.3-1.5-11.6-.9-2.3-2.8-4.1-5.7-5.7-2.9-1.5-6.4-2.3-10.4-2.3s-6.9.7-9.6,2-4.5,3.3-5.7,5.7c-1.2,2.4-1.7,6.3-1.7,11.6s.4,6.7,1.2,9.1c.8,2.4,2,4.1,3.3,5.5h0c1.3,1.4,3.9,3.6,7.7,6.5,3.9,2.9,6.4,4.9,7.3,6.3.9,1.2,1.5,3.9,1.5,8s-.3,3.2-.8,4.1c-.5.9-1.3,1.5-2.4,1.5s-1.7-.4-2.1-1.1c-.4-.8-.7-2.4-.7-4.9ZM218.5,159.1c0-4.9-.9-11.6-2.7-14.7-1.9-3.1-6.3-6.9-13.2-11.6-2.4-1.6-3.9-3.1-4.4-4.3-.5-1.2-.8-2.9-.8-5.2s.3-3.1.7-4c.5-.9,1.2-1.3,2.1-1.3s1.5.3,1.9.9c.4.7.5,2.1.5,4.5v5.1h14.7v-2.7c0-5.5-.4-9.3-1.5-11.6-.9-2.3-2.8-4.1-5.7-5.7-2.9-1.5-6.4-2.3-10.4-2.3s-6.9.7-9.6,2-4.5,3.3-5.7,5.7-1.7,6.3-1.7,11.6.4,6.7,1.2,9.1c.8,2.4,2,4.1,3.3,5.5h0c1.3,1.4,3.9,3.6,7.7,6.5,3.9,2.9,6.4,4.9,7.3,6.3.9,1.2,1.5,3.9,1.5,8s-.3,3.2-.8,4.1c-.5.9-1.3,1.5-2.4,1.5s-1.7-.4-2.1-1.1c-.4-.8-.7-2.4-.7-4.9v-8.4h-14.7v4.5c0,5.2.4,9.2,1.3,12,.9,2.8,2.9,5.1,5.9,6.9,2.9,1.9,6.5,2.7,10.8,2.7s7.2-.8,10.1-2.4c2.9-1.6,4.8-3.5,5.9-5.9,1.1-2.3,1.5-5.9,1.5-10.8Z";

const svgPathPizzaSlice =
  "M2.9,13.6L0,9.2c3.4-2.8,7.1-5,11.1-6.7C15.1.8,19.3,0,23.7,0s8.6.8,12.6,2.5c4,1.7,7.7,3.9,11.1,6.7l-2.9,4.3c-3.2-3-10-7.9-20.5-7.9S6.5,10.4,2.9,13.6ZM43.1,15.5l-19.4,29.2L4.3,15.6c3.2-2.9,9.9-7.6,19.7-7.6s16.4,4.9,19.2,7.5ZM18.6,15.9c0-.9-.3-1.6-.9-2.2-.6-.6-1.4-.9-2.2-.9s-1.6.3-2.2.9c-.6.6-.9,1.4-.9,2.2s.3,1.6.9,2.2c.6.6,1.4.9,2.2.9s1.6-.3,2.2-.9c.6-.6.9-1.4.9-2.2ZM27,28.2c0-.9-.3-1.6-.9-2.2-.6-.6-1.4-.9-2.2-.9s-1.6.3-2.2.9c-.6.6-.9,1.4-.9,2.2s.3,1.6.9,2.2c.6.6,1.4.9,2.2.9s1.6-.3,2.2-.9c.6-.6.9-1.4.9-2.2ZM32.8,20.2c.6-.6.9-1.4.9-2.2s-.3-1.6-.9-2.2c-.6-.6-1.4-.9-2.2-.9s-1.6.3-2.2.9c-.6.6-.9,1.4-.9,2.2s.3,1.6.9,2.2c.6.6,1.4.9,2.2.9s1.6-.3,2.2-.9Z";

const svgPathMusicTicket =
  "M53.1,18.5l-5-4.9-1,.7c-2.1,1.4-5,1.1-6.8-.7-1.8-1.8-2.2-4.6-.8-6.8l.6-1-5-4.9c-1.2-1.2-3.1-1.2-4.3,0L.9,31.4c-1.2,1.2-1.2,3.1,0,4.3l5.1,5,1-.5c2.1-1.1,4.6-.7,6.3,1,1.7,1.6,2.1,4.2,1.1,6.3l-.5,1,5.1,5c1.2,1.2,3.1,1.2,4.3,0l29.8-30.5c1.2-1.2,1.2-3.1,0-4.3ZM33.2,19.1c0,.4-.3.9-.8.9l-3.9.8v14.5h0c0,2-2.1,3.5-4.7,3.5s-4.7-1.6-4.7-3.6,2.1-3.6,4.7-3.6,1.3.1,1.9.3v-14.8c0-.4.3-.9.8-.9l5.9-1.2c.4,0,.8.2.8.6v3.5Z";

const svgPathGasPump =
  "M45.7,13.9c-.4-.9-.9-1.8-1.6-2.5L33.8,1.4l-2.9,2.9,5.9,5.9c-1.4.5-2.4,1.4-3.3,2.6-.8,1.2-1.2,2.5-1.2,4s.7,3.6,2,5,3,2,5,2,1,0,1.5-.1c.5,0,.9-.2,1.3-.5v20.2c0,.8-.3,1.5-.8,2-.5.5-1.2.8-2,.8s-1.5-.3-2-.8-.8-1.2-.8-2v-12.6c0-1.5-.5-2.9-1.6-4s-2.4-1.6-4-1.6h-2.8V5.6c0-1.5-.5-2.9-1.6-4s-2.4-1.6-4-1.6H5.6c-1.5,0-2.9.5-4,1.6-1.1,1.1-1.6,2.4-1.6,4v44.9h28v-21h4.2v14c0,2,.7,3.6,2,5,1.4,1.4,3,2,5,2s3.6-.7,5-2c1.4-1.4,2-3,2-5v-26.6c0-1-.2-1.9-.5-2.9ZM22.4,19.6H5.6V5.6h16.8v14ZM41.3,18.8c-.5.5-1.2.8-2,.8s-1.5-.3-2-.8c-.5-.5-.8-1.2-.8-2s.3-1.5.8-2c.5-.5,1.2-.8,2-.8s1.5.3,2,.8.8,1.2.8,2-.3,1.5-.8,2Z";

const svgTMobileBadge = {
  path: svgPathTMobileBadge,
  colors: {
    magenta: colors.magenta,
    full: colors.berry,
  },
  scalar: 7,
};

const svgTMobileTuesdays = {
  path: svgPathTMobileTuesdaysBadge,
  colors: {
    magenta: colors.magenta,
    full: colors.berry,
  },
  scalar: 8,
};

const svgPizzaSlice = {
  path: svgPathPizzaSlice,
  colors: {
    magenta: colors.berry,
    full: colors.berry,
  },
  scalar: 7,
};

const svgMusicTicket = {
  path: svgPathMusicTicket,
  colors: {
    magenta: colors.berry,
    full: colors.white,
  },
  scalar: 7,
};

const svgGasPump = {
  path: svgPathGasPump,
  colors: {
    magenta: colors.darkBerry,
    full: colors.black,
  },
  scalar: 7,
};

// =-=-=-=-=-=-=-=-=
// Confetti settings
// =-=-=-=-=-=-=-=-=

const defaults = {
  corners: 4,
  ticks: 140,
  zIndex: 900,
  particleCount: 1200,
  emojis: [],
};

const confettiSettings1 = {
  ...defaults,
  colorFamily: "magenta",
  svgs: [],
};
const confettiSettings2 = {
  ...defaults,
  colorFamily: "magenta",
  svgs: [svgTMobileBadge, svgTMobileTuesdays, svgPizzaSlice],
};
const confettiSettings3 = {
  ...defaults,
  colorFamily: "magenta",
  svgs: [svgTMobileBadge, svgTMobileTuesdays, svgPizzaSlice, svgMusicTicket],
};
const confettiSettings4 = {
  ...defaults,
  colorFamily: "magenta",
  svgs: [svgTMobileBadge, svgTMobileTuesdays, svgPizzaSlice, svgMusicTicket, svgGasPump],
};
const confettiSettings5 = {
  ...defaults,
  colorFamily: "full",
  svgs: [svgTMobileBadge, svgTMobileTuesdays, svgPizzaSlice, svgMusicTicket, svgGasPump],
};

// =-=-=-=-=-=-=-=
// Event listeners
// =-=-=-=-=-=-=-=

document.getElementById("tsw-confetti-button-1").addEventListener("click", () => {
  runConfetti(generateConfetti, confettiSettings1);
});

document.getElementById("tsw-confetti-button-2").addEventListener("click", () => {
  runConfetti(generateConfetti, confettiSettings2);
});

document.getElementById("tsw-confetti-button-3").addEventListener("click", () => {
  runConfetti(generateConfetti, confettiSettings3);
});

document.getElementById("tsw-confetti-button-4").addEventListener("click", () => {
  runConfetti(generateConfetti, confettiSettings4);
});

document.getElementById("tsw-confetti-big-button-1").addEventListener("click", () => {
  runConfetti(generateConfetti, confettiSettings4);
  setTimeout(() => {
    openModal();
  }, 1000);
});

document.getElementById("tsw-confetti-big-button-2").addEventListener("click", () => {
  runConfetti(generateConfetti, confettiSettings5);
});

// =-=-=-=-=-=-=-=-=-=-=
// Confetti on page load
// =-=-=-=-=-=-=-=-=-=-=

window.addEventListener("load", () => {
  runConfetti(generateConfetti, confettiSettings4);
});
