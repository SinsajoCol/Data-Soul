// 1. Importa la clase base
import { PaginaTemplate } from "./PaginaTemplate.js";
// 1. Importa el Controlador y la Vista
import { ComparacionController } from "/src/controllers/ComparacionController.js";
import { ResultadosView } from "/src/views/ResultadosView.js";

export class PaginaResultados extends PaginaTemplate {
    /**
     * @param {string} id - El ID del grupo ("grupo_123") o individuo ("default_user")
     * que recibe desde el router (main.js)
     */
    constructor(id) {
        super();
        this.cargarCSS("/src/assets/css/Dashboard.css");
        this.id = id; // Guarda el ID (ej. "default_user" o "grupo_123")
        
        this.view = new ResultadosView();
        this.controller = new ComparacionController(this.view, this.id);
    }

    /**
     * Pide a la Vista su HTML estático (el "esqueleto")
     */
    async mostrarContenido() {
        const response = await fetch("/src/pages/resultados.html");
        const html = await response.text();
        console.log("Contenido cargado");
        return html;
        //return this.view.getHtmlBase();
    }

    /**
     * Llama al Controlador para que "encienda" la página
     */
    async despuesDeCargar() {
        console.log("1")
        const view = new ResultadosView();
        //view.init();
        this.controller.iniciar();
    }
}