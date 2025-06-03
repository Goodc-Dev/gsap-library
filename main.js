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
// Obsługuje ukryte elementy (np. z display: none) – najpierw je pokazuje,
// a następnie steruje ich opacity.
// ------------------------------------------------------
function initGalleryLoopAnimations() {
  const galleries = document.querySelectorAll(".gasp-gallery-loop");

  galleries.forEach((gallery) => {
    const items = Array.from(gallery.children);
    if (items.length === 0) return;

    // 1) Ustaw kontener na relative, aby dzieci absolute działały poprawnie
    gallery.style.position = "relative";
    gallery.style.overflow = "hidden";

    // 2) Dla każdego dziecka:
    items.forEach((item, index) => {
      // Jeśli element ma klasę dnone (display: none), usuń ją z warstwy stylu
      // (lub nadpisz stylem inline, by element stał się widoczny do animacji)
      if (item.classList.contains("dnone")) {
        item.classList.remove("dnone");
      }
      // Ustaw podstawowe style absolutnego pozycjonowania:
      item.style.position = "absolute";
      item.style.top = "0";
      item.style.left = "0";
      item.style.width = "100%";
      item.style.height = "100%";

      // Wymuś display (usuwa ewentualne display: none w CSS)
      // Dla obrazów: display: block; dla div-ów: też display: block przy absolute
      item.style.display = "block";

      // Początkowo tylko pierwszy element jest widoczny (opacity 1), pozostałe 0
      item.style.opacity = index === 0 ? "1" : "0";
    });

    // 3) Stwórz timeline loopujący przez wszystkie elementy
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gallery,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      repeat: -1 // nieskończona pętla
    });

    const fadeDuration = 1;  // długość crossfade’u w sekundach
    const stayDuration = 2;  // czas pełnej widoczności w sekundach

    // 4) Dodaj do timeline fragmenty dla każdego elementu:
    items.forEach((_, i) => {
      const current = items[i];
      const next = items[(i + 1) % items.length];
      // 4a) Po stayDuration sekundach zacznij fade-out current
      tl.to(current, {
        opacity: 0,
        duration: fadeDuration,
        ease: "power1.out"
      }, `+=${stayDuration}`);
      // 4b) W tym samym czasie (ostatnia sekunda crossfade’u) fade-in next
      tl.to(next, {
        opacity: 1,
        duration: fadeDuration,
        ease: "power1.out"
      }, `-=${fadeDuration}`);
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
