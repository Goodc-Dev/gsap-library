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
    // 1. Pobranie oryginalnego tekstu i wyciągnięcie pierwszej liczby:
    const originalText = elem.textContent.trim();
    const match = originalText.match(/(\d+)/);
    if (!match) return; // brak liczby → pomiń

    const numberString = match[1];                // np. "30"
    const endValue = parseInt(numberString, 10);  // np. 30
    if (isNaN(endValue)) return;

    // 2. Przygotowanie wzorca (szablonu) do podmiany liczby:
    //    będziemy każdorazowo robić replace(/(\d+)/, currentValue)
    const template = originalText;

    // 3. Ustawiamy początkową zawartość = szablon z "0" w miejsce liczby
    elem.textContent = template.replace(/(\d+)/, "0");

    // 4. Obiekt pomocniczy do tweenowania
    const obj = { value: 0 };

    gsap.to(obj, {
      value: endValue,
      duration: 1.2,
      ease: "power1.out",
      scrollTrigger: {
        trigger: elem,
        start: "top 90%",
        toggleActions: "play none none none"
        // markers: true  // odkomentuj, aby zobaczyć markery w DevTools
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
