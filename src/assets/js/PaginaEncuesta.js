import { PaginaTemplate } from "./PaginaTemplate.js";

export class PaginaEncuesta extends PaginaTemplate {

    constructor() {
        super();
        this.cargarCSS("/src/assets/css/Encuesta.css");
    }

    async mostrarContenido() {
        const response = await fetch("/src/pages/Encuesta.html");
        return await response.text();
    }

    async despuesDeCargar() {
        const iframe = document.getElementById("encuestaFrame");

        iframe.src = "https://forms.microsoft.com/r/Rj4ScY0T8S"; 
    }
}