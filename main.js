// Rejestrujemy plugin
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".gsap-slide-in");
  items.forEach(item => {
    gsap.from(item, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none none"
        // markers: true  // odkomentuj, jeśli chcesz podgląd triggera
      }
    });
  });
});
