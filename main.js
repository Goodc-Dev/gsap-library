// ------------------------------------------------------
// Funkcja rejestrująca pluginy GSAP (ScrollTrigger)
// ------------------------------------------------------
function registerGSAPPlugins() {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.error("GSAP lub ScrollTrigger nie są załadowane.");
  }
}

// ------------------------------------------------------
// Inicjalizacja animacji “slide-in” (klasa .gsap-slide-in)
// ------------------------------------------------------
function initSlideInAnimations() {
  const slideItems = document.querySelectorAll(".gsap-slide-in");

  slideItems.forEach((item) => {
    const isStaggered = item.classList.contains("gsap-slide-in-stagger");

    if (isStaggered) {
      const children = item.children;
      gsap.from(children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reset"
        }
      });
    } else {
      gsap.from(item, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reset"
        }
      });
    }
  });
}

// ------------------------------------------------------
// Inicjalizacja animacji “counter” (klasa .gsap-counter)
// ------------------------------------------------------
function initCounterAnimations() {
  const counters = document.querySelectorAll(".gsap-counter");

  counters.forEach((elem) => {
    const originalText = elem.textContent.trim();
    const match = originalText.match(/(\d+)/);
    if (!match) return;

    const numberString = match[1];
    const endValue = parseInt(numberString, 10);
    if (isNaN(endValue)) return;

    const template = originalText;
    elem.textContent = template.replace(/(\d+)/, "0");

    const obj = { value: 0 };
    gsap.to(obj, {
      value: endValue,
      duration: 1.2,
      ease: "power1.out",
      scrollTrigger: {
        trigger: elem,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        const current = Math.floor(obj.value);
        elem.textContent = template.replace(/(\d+)/, current);
      },
      onComplete: () => {
        elem.textContent = template.replace(/(\d+)/, endValue);
      }
    });
  });
}

// ------------------------------------------------------
// Inicjalizacja animacji “hover overlay” (klasy .media-wave i .hover-bg-overlay)
// ------------------------------------------------------
function initHoverOverlayAnimations() {
  const waves = document.querySelectorAll(".media-wave");
  const overlays = document.querySelectorAll(".hover-bg-overlay");

  waves.forEach((wave, idx) => {
    let overlay = wave.querySelector(".hover-bg-overlay");
    if (!overlay && overlays.length === waves.length) {
      overlay = overlays[idx];
    }
    if (!overlay && overlays.length > 0) {
      overlay = overlays[0];
    }
    if (!overlay) return;

    wave.addEventListener("mouseenter", () => {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    wave.addEventListener("mouseleave", () => {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    });
  });
}

// ------------------------------------------------------
// Inicjalizacja animacji “hover scale” (klasa .gasp-hover-scale-up)
// ------------------------------------------------------
function initHoverScaleAnimations() {
  const links = document.querySelectorAll(".gasp-hover-scale-up");
  links.forEach((link) => {
    link.style.transformOrigin = "left center";

    link.addEventListener("mouseenter", () => {
      gsap.to(link, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out"
      });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(link, {
        scale: 1,
        duration: 0.2,
        ease: "power2.in"
      });
    });
  });
}

// ------------------------------------------------------
// Inicjalizacja animacji “underline from left” (klasa .gasp-underline)
// ------------------------------------------------------
// Nie zmieniamy display całego linku – owijamy tekst w span o szerokości tekstu.
// ------------------------------------------------------
function initUnderlineAnimations() {
  const links = document.querySelectorAll(".gasp-underline");

  links.forEach((link) => {
    // 1. Pobierz oryginalny tekst linku (zakładamy, że link zawiera tylko tekst, np. "Zabiegi")
    const text = link.textContent.trim();
    if (!text) return;

    // 2. Wyczyść zawartość linku
    link.textContent = "";

    // 3. Stwórz <span> do owinięcia tekstu (będzie miał szerokość tekstu)
    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    // Ustaw inline‐block, by span miał szerokość zawartości tekstu:
    textSpan.style.display = "inline-block";
    textSpan.style.position = "relative"; // potrzebne, żeby underline się odnosiło do tego spanu

    // 4. Stwórz <span> dla underline
    const underline = document.createElement("span");
    underline.style.position = "absolute";
    underline.style.bottom = "0";
    underline.style.left = "0";
    underline.style.height = "2px";
    underline.style.width = "0%";
    underline.style.backgroundColor = "currentColor";
    underline.style.pointerEvents = "none";

    // 5. Włóż underline do textSpan, a textSpan do linku
    textSpan.appendChild(underline);
    link.appendChild(textSpan);

    // 6. Animacja GSAP na hover linku (całego <a>)
    link.addEventListener("mouseenter", () => {
      gsap.to(underline, {
        width: "100%",
        duration: 0.3,
        ease: "power2.out"
      });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(underline, {
        width: "0%",
        duration: 0.3,
        ease: "power2.in"
      });
    });
  });
}

// ------------------------------------------------------
// Główna funkcja inicjalizująca wszystkie animacje
// ------------------------------------------------------
function initAnimations() {
  registerGSAPPlugins();
  initSlideInAnimations();
  initCounterAnimations();
  initHoverOverlayAnimations();
  initHoverScaleAnimations();
  initUnderlineAnimations();
}

// ------------------------------------------------------
// Wywołanie inicjalizacji po załadowaniu DOM
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", initAnimations);
