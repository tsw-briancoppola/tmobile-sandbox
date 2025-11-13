const addContent = () => {
  const box = document.querySelectorAll(".tsw-box");

  box.forEach((b) => {
    b.textContent = "Hello!";
  });
};

// GSAP animations on load

gsap.registerPlugin(ScrollTrigger);

const animateBoxes = () => {
  const tl = gsap.timeline();

  tl.to(".tsw-box", { rotation: 360, duration: 1, ease: "power2.out", yoyo: true, repeat: 1 });
  tl.to(".tsw-box", { scale: 1.5, duration: 0.5, ease: "power2.inOut", yoyo: true, repeat: 1 }, "<2");
  tl.to(".tsw-box", { y: -30, duration: 0.1, ease: "power2.out", stagger: 0.1, yoyo: true, repeat: 1 }, "<1");
};

window.addEventListener("load", () => {
  addContent();
  animateBoxes();
});

// Buttons

const tswButtonSpin = document.querySelector(".tsw-button-spin");
const tswButtonScale = document.querySelector(".tsw-button-scale");
const tswButtonBounce = document.querySelector(".tsw-button-bounce");

tswButtonSpin.addEventListener("click", () => {
  gsap.to(".tsw-box", { rotation: 360, duration: 1, ease: "power2.out", stagger: 0.2, yoyo: true, repeat: 1 });
});

tswButtonScale.addEventListener("click", () => {
  gsap.to(".tsw-box", { scale: 1.5, duration: 0.5, ease: "power2.inOut", yoyo: true, repeat: 1 });
});

tswButtonBounce.addEventListener("click", () => {
  gsap.to(".tsw-box", { y: -30, duration: 0.1, ease: "power2.out", stagger: 0.1, yoyo: true, repeat: 1 });
});
