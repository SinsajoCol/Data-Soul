import { PaginaTemplate } from "./PaginaTemplate.js";
import { RasgosLLM } from "../../views/RasgosLLM.js";

export class PaginaLLM extends PaginaTemplate {
  constructor() {
    super();
    this.cargarCSS("/src/assets/css/SRasgosLLM.css");
  }

  async mostrarContenido() {
    try {
      const response = await fetch("/src/pages/RasgosLLM.html");
      if (!response.ok) throw new Error("No se pudo cargar RasgosLLM.html");

      const html = await response.text();

      queueMicrotask(async () => {
        await new Promise((r) => setTimeout(r, 50));
        const vista = new RasgosLLM();
        await vista.inicializar();
      });

      return html;
    } catch (error) {
      console.error("Error cargando contenido de LLM:", error);
      return `<p style="color:red;text-align:center;">Error cargando la página de Rasgos LLM.</p>`;
    }
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

    const fillSlider = () => {
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
    };

    fillSlider();

    const animate = () => {
      offset -= sliderSpeed;
      if (Math.abs(offset) >= slider.scrollWidth / 2) {
        offset = 0;
      }
      slider.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", () => {
      slider.style.transform = "translateX(0)";
      offset = 0;
      fillSlider();
    });
  }
}