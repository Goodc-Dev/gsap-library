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
// Teraz animacja odpala się za każdym razem, gdy przewiniesz w dół do elementu.
// Animacja nie uruchamia się przy scrollu w górę.
// ------------------------------------------------------
function initSlideInAnimations() {
  const slideItems = document.querySelectorAll(".gsap-slide-in");
  slideItems.forEach((item) => {
    gsap.from(item, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none reset"
        // toggleActions: [onEnter, onLeave, onEnterBack, onLeaveBack]
        // "play none none reset" oznacza:
        //   onEnter      → play
        //   onLeave      → (nic)
        //   onEnterBack  → (nic)
        //   onLeaveBack  → reset (wraca do stanu początkowego)
        // Dzięki temu: przy scrollu w dół animuje się za każdym razem,
        // ale przy scrollu w górę wraca do stanu startowego bez powtarzania animacji.
        // markers: true // odkomentuj, aby zobaczyć markery w DevTools
      }
    });
  });
}

// ------------------------------------------------------
// Inicjalizacja animacji “counter” (klasa .gsap-counter)
// ------------------------------------------------------
// Uniwersalny skrypt: wyciąga pierwszą wartość liczbową z treści elementu,
// a wszelkie prefiksy lub sufiksy (np. tekst "lat", "%" itp.) pozostawia.
// ------------------------------------------------------
function initCounterAnimations() {
  const counters = document.querySelectorAll(".gsap-counter");

  counters.forEach((elem) => {
    const text = elem.textContent.trim();
    // Znajdź pierwsze wystąpienie cyfry (ciąg cyfr)
    const match = text.match(/(\d+)/);
    if (!match) return; // brak liczby → pomiń

    const numberString = match[1];           // np. "30"
    const endValue = parseInt(numberString, 10);
    if (isNaN(endValue)) return;

    // Podzielmy oryginalny tekst na prefiks, liczbę i sufiks:
    const indexStart = match.index;
    const indexEnd = indexStart + numberString.length;
    const prefix = text.slice(0, indexStart);   // np. ""
    const suffix = text.slice(indexEnd);        // np. " lat"

    // Ustaw początkowy widok (z zostawionym prefixem i suffixem, a liczbą "0")
    elem.textContent = prefix + "0" + suffix;

    // Obiekt pomocniczy do tweenowania
    const obj = { value: 0 };

    gsap.to(obj, {
      value: endValue,
      duration: 1.2,
      ease: "power1.out",
      scrollTrigger: {
        trigger: elem,
        start: "top 90%",
        toggleActions: "play none none none"
        // markers: true // odkomentuj, aby zobaczyć markery w DevTools
      },
      onUpdate: () => {
        const current = Math.floor(obj.value);
        elem.textContent = prefix + current + suffix;
      },
      onComplete: () => {
        elem.textContent = prefix + endValue + suffix;
      }
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
}

// ------------------------------------------------------
// Wywołanie inicjalizacji po załadowaniu DOM
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", initAnimations);
