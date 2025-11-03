import { PaginaTemplate } from "./PaginaTemplate.js";
// 1. Importa el Controlador y la Vista
import { ComparacionController } from "/src/controllers/ComparacionController.js";
import { ResultadosView } from "/src/views/ResultadosView.js";

export class PaginaResultados extends PaginaTemplate {

    constructor() {
        super();
        // 2. Crea la Vista
        this.view = new ResultadosView();
        // 3. Crea el Controlador y le "inyecta" la Vista
        this.controller = new ComparacionController(this.view);
    }

    /**
     * Pide a la Vista su HTML estático (el "esqueleto")
     */
    async mostrarContenido() {
        return this.view.getHtmlBase();
    }

    /**
     * Llama al Controlador para que "encienda" la página
     */
    async despuesDeCargar() {
        this.controller.iniciar();
    }
}