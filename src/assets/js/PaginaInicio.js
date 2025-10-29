// pages/PaginaInicio.js
import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaInicio extends PaginaTemplate {
  constructor() {
    super();
    this.cargarCSS("/src/assets/css/SInicio.css");
  }

  async mostrarContenido() {
    const response = await fetch("/src/pages/Inicio.html");
    if (!response.ok) {
      console.error("Error al cargar /src/pages/Inicio.html:", response.status);
      return "<p>Error al cargar contenido.</p>";
    }

    const html = await response.text();

    setTimeout(() => this.inicializarCarrusel(), 100);

    return html;
  }

  cargarCSS(ruta) {
    if (!document.querySelector(`link[href="${ruta}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = ruta;
      document.head.appendChild(link);
    }
  }

  inicializarCarrusel() {
    const carousel = document.querySelector(".carousel-main");
    const slides = document.querySelectorAll(".carousel-main > .tarjeta");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const dots = document.querySelectorAll(".dot");

    if (!carousel || slides.length === 0) {
      console.warn("⚠️ No se encontró el carrusel en el DOM todavía.");
      return;
    }

    let currentIndex = 0;

    function updateCarousel() {
      const slideWidth = slides[0].offsetWidth;
      carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i === currentIndex)
      );

      prevBtn.style.opacity = currentIndex === 0 ? "0.4" : "1";
      nextBtn.style.opacity = currentIndex === slides.length - 1 ? "0.4" : "1";
    }

    nextBtn.addEventListener("click", () => {
      if (currentIndex < slides.length - 1) currentIndex++;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) currentIndex--;
      updateCarousel();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
      });
    });

    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        slide.classList.toggle("flipped");
      });
    });

    // Inicializar carrusel
    updateCarousel();

    // Recalcular si cambia el tamaño
    window.addEventListener("resize", updateCarousel);
  }
}