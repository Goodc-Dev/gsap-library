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
      duration: 1.8,
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
// Działa dla każdego linku: nie zakłada tylko czystego tekstu, 
// a zachowuje ewentualne HTML wewnątrz.
// ------------------------------------------------------
function initUnderlineAnimations() {
  const links = document.querySelectorAll(".gasp-underline");

  links.forEach((link) => {
    // 1. Pobierz całą zawartość HTML linku (np. tekst, ikony itp.)
    const originalHTML = link.innerHTML.trim();
    if (!originalHTML) return;

    // 2. Wyczyść zawartość, by wstawić wrapper
    link.innerHTML = "";

    // 3. Stwórz <span> do owinięcia oryginalnej zawartości
    const wrapper = document.createElement("span");
    wrapper.innerHTML = originalHTML;
    // Ustaw inline-block, aby szerokość odpowiadała zawartości
    wrapper.style.display = "inline-block";
    wrapper.style.position = "relative";

    // 4. Stwórz <span> dla underline
    const underline = document.createElement("span");
    underline.style.position = "absolute";
    underline.style.bottom = "0";
    underline.style.left = "0";
    underline.style.height = "1px";
    underline.style.width = "0%";
    underline.style.backgroundColor = "currentColor";
    underline.style.pointerEvents = "none";

    // 5. Włóż underline do wrappera, a wrapper do linku
    wrapper.appendChild(underline);
    link.appendChild(wrapper);

    // 6. Animacja GSAP na hover całego linku
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
// Inicjalizacja animacji “gallery loop” (klasa .gasp-gallery-loop)
// ------------------------------------------------------
// Zmodyfikowana wersja: najpierw fade-in nowego elementu, potem fade-out poprzedniego.
// Skrócone czasy animacji, aby nie było widocznego tła pod obrazem.
// ------------------------------------------------------
function initGalleryLoopAnimations() {
  const galleries = document.querySelectorAll(".gasp-gallery-loop");

  galleries.forEach((gallery) => {
    const items = Array.from(gallery.children);
    if (items.length === 0) return;

    // 1) Ustaw kontener na relative i overflow:hidden
    gallery.style.position = "relative";
    gallery.style.overflow = "hidden";

    // 2) Poczekaj, aż pierwszy element <img> się wczyta (jeśli to <img>)
    const firstItem = items[0];
    const waitForImage = firstItem.tagName === "IMG"
      ? new Promise((resolve) => {
          if (firstItem.complete) {
            resolve();
          } else {
            firstItem.addEventListener("load", resolve);
            firstItem.addEventListener("error", resolve);
          }
        })
      : Promise.resolve();

    waitForImage.then(() => {
      // 3) Ustaw wysokość galerii na wysokość pierwszego elementu
      const rect = firstItem.getBoundingClientRect();
      gallery.style.height = rect.height + "px";

      // 4) Usuń dnone i ustaw absolutne pozycjonowanie dla każdego dziecka
      items.forEach((item, idx) => {
        if (item.classList.contains("dnone")) {
          item.classList.remove("dnone");
        }
        item.style.position = "absolute";
        item.style.top = "0";
        item.style.left = "0";
        item.style.width = "100%";
        item.style.height = "auto";
        item.style.display = "block";

        // Wyrównaj z-index, by wszystkie startowały poniżej (0),
        // a pierwszy był widoczny
        item.style.zIndex = idx === 0 ? "1" : "0";

        // Initial opacity: tylko pierwszy element widoczny
        item.style.opacity = idx === 0 ? "1" : "0";
      });

      // 5) Timeline loopujący
      const fadeInDuration = 0.5;   // fade-in nowego
      const fadeOutDuration = 0.5;  // fade-out starego
      const stayDuration = 1.5;     // czas pełnej widoczności

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gallery,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        repeat: -1
      });

      items.forEach((_, i) => {
        const current = items[i];
        const next = items[(i + 1) % items.length];

        // 5a) Ustaw zIndex=1 na next, by był nad current
        tl.set(next, { zIndex: 1 }, `+=${stayDuration}`);

        // 5b) Fade-in next (opacity 0 → 1)
        tl.to(next, {
          opacity: 1,
          duration: fadeInDuration,
          ease: "power1.out"
        }, `-=${0}`); // zaczynamy natychmiast po ustawieniu zIndex

        // 5c) Fade-out current (opacity 1 → 0) dopiero po zakończeniu fadeIn
        tl.to(current, {
          opacity: 0,
          duration: fadeOutDuration,
          ease: "power1.out"
        }, `+=${fadeInDuration}`); 

        // 5d) Po fade-out cofamy zIndex current na 0, żeby rzucić go na spód
        tl.set(current, { zIndex: 0 }, `+=0`);
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
  initGalleryLoopAnimations();
}

// ------------------------------------------------------
// Wywołanie inicjalizacji po załadowaniu DOM
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", initAnimations);
