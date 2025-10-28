// pages/PaginaInicio.js
import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaInicio extends PaginaTemplate {
  async mostrarContenido() {
    const response = await fetch("/src/pages/Inicio.html");
    const html = await response.text();
    return html;
  }
}