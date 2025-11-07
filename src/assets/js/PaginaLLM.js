import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaLLM extends PaginaTemplate {
  constructor() {
    super();
    this.cargarCSS("/src/assets/css/SRasgosLLM.css");
  }

  async mostrarContenido() {
    const response = await fetch("/src/pages/RasgosLLM.html");
    if (!response.ok) {
      console.error("Error al cargar /src/pages/RasgosLLM.html:", response.status);
      return "<p>Error al cargar contenido.</p>";
    }
    const html = await response.text();
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

  despuesDeCargar() {
    this.iniciarCarrusel();
  }

  iniciarCarrusel() {
    const slider = document.querySelector(".slider");
    if (!slider) return;

    let sliderSpeed = 0.5;
    let offset = 0;

    function fillSlider() {
      const sliderWidth = slider.scrollWidth;
      const containerWidth = slider.parentElement.offsetWidth;
      let totalWidth = sliderWidth;

      while (totalWidth < containerWidth * 2) {
        slider.querySelectorAll("img").forEach((img) => {
          const clone = img.cloneNode(true);
          slider.appendChild(clone);
        });
        totalWidth = slider.scrollWidth;
      }
    }
    fillSlider();

    function animate() {
      offset -= sliderSpeed;
      if (Math.abs(offset) >= slider.scrollWidth / 2) {
        offset = 0;
      }
      slider.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
      slider.style.transform = "translateX(0)";
      offset = 0;
      fillSlider();
    });
  }
}
