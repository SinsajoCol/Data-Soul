import { PaginaTemplate } from "./PaginaTemplate.js";
// 1. Importa el Controlador y la Vista
import { ComparacionController } from "/src/controllers/ComparacionController.js";
import { ResultadosView } from "/src/views/ResultadosView.js";

export class PaginaResultados extends PaginaTemplate {

    constructor() {
        super();
        this.cargarCSS("/src/assets/css/Dashboard.css");
        // 2. Crea la Vista
        this.view = new ResultadosView();
        // 3. Crea el Controlador y le "inyecta" la Vista
        this.controller = new ComparacionController(this.view);
    }

    /**
     * Pide a la Vista su HTML estático (el "esqueleto")
     */
    async mostrarContenido() {
         const response = await fetch("/src/pages/resultados.html");
         const html = await response.text();
        return html;
        //return this.view.getHtmlBase();
    }

    /**
     * Llama al Controlador para que "encienda" la página
     */
    async despuesDeCargar() {
        const view = new ResultadosView();
        view.init();
        this.controller.iniciar();
    }
}