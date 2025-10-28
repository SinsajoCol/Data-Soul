import { PaginaTemplate } from "./PaginaTemplate.js";
import CuestionarioController from "/src/controllers/CuestionarioController.js";

export class PaginaCuestionario extends PaginaTemplate {

    constructor() {
        super();
        this.controlador = new CuestionarioController();
    }

    async mostrarContenido() {
        const response = await fetch("/src/pages/PruebaIndividual.html");
        const html = await response.text();
        return html;
    }

    async despuesDeCargar() {
        this.controlador.iniciar('./src/data/cuestionario.json');
    }
}