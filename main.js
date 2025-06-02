// main.js
import { gsap } from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
import { ScrollTrigger } from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";

// Zarejestruj plugin (jeśli używasz ScrollTriggera)
gsap.registerPlugin(ScrollTrigger);

// Teraz GSAP jest dostępny do użycia
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
      }
    });
  });
});