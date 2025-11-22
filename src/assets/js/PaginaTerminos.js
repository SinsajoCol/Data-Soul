// src/assets/js/PaginaTerminos.js
import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaTerminos extends PaginaTemplate {
  async mostrarContenido() {
    // Carga el CSS específico de la página
    this.cargarCSS("/src/assets/css/STerminos.css");

    // Carga el HTML estático desde /src/pages/
    const response = await fetch("/src/pages/TerminosServicios.html");
    if (!response.ok) {
      console.error(" Error al cargar TerminosServicios.html");
      return "<p>Error al cargar la página de Términos del Servicio.</p>";
    }

    // Devuelve el contenido como texto
    return await response.text();
  }
}