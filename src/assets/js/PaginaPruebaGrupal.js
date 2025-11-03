import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaPruebaGrupal extends PaginaTemplate {
  async mostrarContenido() {
    const response = await fetch("/src/pages/PruebaGrupal.html");
    const html = await response.text();
    return html;
  }
}