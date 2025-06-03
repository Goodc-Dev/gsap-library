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
// Inicjalizacja animacji “hover overlay” (klasa .gasp-hover-overlay)
// ------------------------------------------------------
// Skrypt zakłada, że w HTML masz już <div class="gasp-hover-overlay"> wstawione
// wewnątrz kontenera.   
// Na hover nad rodzicem (.parentElement) włącza fade‐in overlay’u, na mouseleave – fade‐out.
// ------------------------------------------------------
function initHoverOverlayAnimations() {
  document.querySelectorAll(".gasp-hover-overlay").forEach((overlay) => {
    const container = overlay.parentElement;
    if (!container) return;

    // 1) Ustawiamy rodzica na position: relative, jeśli jest static
    const computed = window.getComputedStyle(container);
    if (computed.position === "static") {
      container.style.position = "relative";
    }
    container.style.overflow = "hidden";

    // 2) Ustawiamy overlay jako absolutny i niewidoczny na start
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    // Tło (background-image/ color) definiujesz w Designerze na klasie .gasp-hover-overlay

    // 3) Animacja GSAP: fade-in na hover rodzica, fade-out po wyjściu
    container.addEventListener("mouseenter", () => {
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
    });
    container.addEventListener("mouseleave", () => {
      gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.in" });
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
      const stayDuration = 1;     // czas pełnej widoczności

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
// Inicjalizacja “gallery next” z poprawionym loopem opartym na zmiennej currentIndex
// (klasy .gasp-gallery / .gasp-gallery-inner / .gasp-gallery-next)
// ------------------------------------------------------
function initGalleryNextAnimations() {
  document.querySelectorAll(".gasp-gallery").forEach((container) => {
    const inner = container.querySelector(".gasp-gallery-inner");
    const button = container.querySelector(".gasp-gallery-next");
    if (!inner || !button) return;

    const items = Array.from(inner.children);
    if (items.length === 0) return;

    // Znajdź pozycję pierwszego elementu, który jest widoczny (display ≠ none)
    let initialIndex = items.findIndex((el) =>
      window.getComputedStyle(el).display !== "none"
    );
    if (initialIndex < 0) initialIndex = 0;
    let currentIndex = initialIndex;
    const first = items[initialIndex];

    // Funkcja mierząca i ustawiająca absolutne pozycjonowanie
    function measureAndSetup() {
      // 1) Przywróć first do naturalnego flow, aby zmierzyć wysokość:
      first.style.setProperty("display", "block", "important");
      first.style.position = "static";
      first.style.visibility = "hidden";

      inner.style.position = "static";
      inner.style.height = "auto";

      const rect = first.getBoundingClientRect();
      const galleryHeight = rect.height;

      // 2) Przywróć absolutne pozycjonowanie i stałą wysokość
      inner.style.position = "relative";
      inner.style.height = galleryHeight + "px";

      items.forEach((item, idx) => {
        // Usuń dowolne display:none i wymuś block!important
        item.style.setProperty(
          "display",
          idx === initialIndex ? "block" : "none",
          "important"
        );
        // Ustaw absolutne pozycjonowanie
        item.style.position = "absolute";
        item.style.top = "0";
        item.style.left = "0";
        item.style.width = "100%";
        item.style.height = "100%";
        // Ustaw opacity i z-index: pierwszy widoczny, reszta ukryta
        if (idx === initialIndex) {
          item.style.opacity = "1";
          item.style.zIndex = "1";
        } else {
          item.style.opacity = "0";
          item.style.zIndex = "0";
        }
        item.style.visibility = "visible";
      });
    }

    if (first.tagName === "IMG" && !first.complete) {
      first.addEventListener("load", measureAndSetup);
      first.addEventListener("error", measureAndSetup);
    } else {
      measureAndSetup();
    }

    // Obsługa kliknięcia: crossfade z pętlą
    button.addEventListener("click", () => {
      const nextIndex = (currentIndex + 1) % items.length;
      const current = items[currentIndex];
      const next = items[nextIndex];

      // Przygotuj next: display:block!important, opacity 0, zIndex wyższy
      next.style.setProperty("display", "block", "important");
      next.style.opacity = "0";
      next.style.zIndex = "2";
      current.style.zIndex = "1";

      const fadeDuration = 0.5;
      // Fade-in next
      gsap.to(next, {
        opacity: 1,
        duration: fadeDuration,
        ease: "power1.out",
        onComplete: () => {
          // Po fade-in ukryj current: display: none!important, zIndex: 0
          current.style.setProperty("display", "none", "important");
          current.style.zIndex = "0";
          // Zaktualizuj currentIndex na nextIndex
          currentIndex = nextIndex;
        },
      });
    });
  });
}

// ------------------------------------------------------
// Inicjalizacja animacji “hover arrow” (klasa .gasp-hover-arrow)
// ------------------------------------------------------
// Struktura HTML-buttona może wyglądać tak:
//
// <div class="button is-icon gasp-hover-arrow">
//   <div>Czytaj więcej</div>
//   <div class="icon-arow w-embed">
//     <svg …>…</svg>
//   </div>
// </div>
//
// Skrypt automatycznie wyszukuje w obrębie .gasp-hover-arrow pierwszy
// element <svg> (czyli strzałkę) i na hover przesuwa go w prawo.
// Nie wymaga twardego odwoływania się do “icon-arow” czy innej klasy.
// ------------------------------------------------------
function initHoverArrowAnimations() {
  document.querySelectorAll(".gasp-hover-arrow").forEach((btn) => {
    // Znajdź w przycisku ikonę – szukamy pierwszego <svg>
    const arrow = btn.querySelector("svg");
    if (!arrow) return;

    // Ustawiamy transform-origin (w razie potrzeby, tu środek wysokości)
    arrow.style.transformOrigin = "center center";

    // Przy hoverze animujemy x (przesunięcie w prawo)
    btn.addEventListener("mouseenter", () => {
      gsap.to(arrow, {
        x: 5,            // przesunięcie o 5px w prawo (zmień według uznania)
        duration: 0.2,
        ease: "power2.out"
      });
    });

    // Przy mouseleave cofamy do x=0
    btn.addEventListener("mouseleave", () => {
      gsap.to(arrow, {
        x: 0,
        duration: 0.2,
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
  initGalleryLoopAnimations();
  initGalleryNextAnimations();
  initHoverArrowAnimations();
}

// ------------------------------------------------------
// Wywołanie inicjalizacji po załadowaniu DOM
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", initAnimations);
