// zamiast ładować z GitHuba, od razu wrzucamy tę samą logikę
console.log("inline custom.js: start");
gsap.registerPlugin(ScrollTrigger);

    document.addEventListener("DOMContentLoaded", () => {
      console.log("inline custom.js: DOMContentLoaded");
      const items = document.querySelectorAll(".gsap-slide-in");
      console.log("inline custom.js: znaleziono .gsap-slide-in:", items.length);
      items.forEach(item => {
        console.log("inline custom.js: animuję element", item);
        gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none none",
            markers: true
          }
        });
      });
    });
