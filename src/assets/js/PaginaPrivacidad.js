import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaPrivacidad extends PaginaTemplate {
  async mostrarContenido() {
    // Carga el CSS específico de la página
    this.cargarCSS("/src/assets/css/SPrivacidad.css");

    // Carga el HTML estático desde /src/pages/
    const response = await fetch("/src/pages/PoliticasPrivacidad.html");
    if (!response.ok) {
      console.error("Error al cargar PoliticasPrivacidad.html");
      return "<p>Error al cargar la página de Políticas de Privacidad.</p>";
    }

    // Devuelve el contenido como texto
    return await response.text();
  }
}