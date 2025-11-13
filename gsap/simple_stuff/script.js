const boxAnimations = () => {
  const tl = gsap.timeline({ repeat: 2, yoyo: true }); // Creates a timeline that repeats and reverses

  tl.to(".box", {
    duration: 1,
    x: 400,
    ease: "power1.inOut",
  })
    .to(".box", {
      duration: 0.5,
      y: 100, // Moves down
      rotation: 180,
      backgroundColor: "red",
    })
    .to(".box", {
      duration: 1,
      x: 0, // Moves back to start position on x-axis
      scale: 0.5,
      backgroundColor: "blue",
    });
};

let timer = setTimeout(boxAnimations, 2000);

console.log("Timer started...");

// You can optionally cancel the timer before it executes
// clearTimeout(timer);
