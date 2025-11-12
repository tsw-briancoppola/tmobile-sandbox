gsap.registerPlugin(ScrollTrigger);

// Create timeline for all panel animations
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".tsw-panel1",
    start: "top top",
    end: "+=4000",
    scrub: 1,
    pin: true,
  },
});

// Add panel animations to timeline with sequential timing
tl.to(".tsw-panel2", { x: "0%", duration: 1 }, 0)
  .to(".tsw-panel3", { x: "0%", duration: 1 }, 1)
  .to(".tsw-panel4", { y: "0%", duration: 1 }, 2)
  .to(".tsw-panel5", { y: "0%", duration: 1 }, 3);

// Progress bar
// gsap.to(".progress-bar", {
//   scaleX: 1,
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".panel1",
//     start: "top top",
//     end: "+=4000",
//     scrub: 0.3,
//   },
// });

// Update section counter based on timeline progress
ScrollTrigger.create({
  trigger: ".tsw-panel1",
  start: "top top",
  end: "+=4000",
  onUpdate: (self) => {
    const section = Math.min(Math.floor(self.progress * 5) + 1, 5);
    document.getElementById("tsw-current-section").textContent = section;
  },
});

// Hide scroll indicator
ScrollTrigger.create({
  trigger: ".tsw-panel1",
  start: "top top",
  end: "+=500",
  onEnter: () => gsap.to(".tsw-scroll-indicator", { opacity: 0, duration: 0.5 }),
});
