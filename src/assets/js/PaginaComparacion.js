// 1. Importa la clase base
import { PaginaTemplate } from "./PaginaTemplate.js";

// 2. Importa el Controlador y la Vista de esta página
import { ComparacionController } from "/src/controllers/ComparacionController.js";
import { ComparacionView } from "/src/views/ComparacionView.js";

export class PaginaComparacion extends PaginaTemplate {

    /**
     * @param {string} id - El ID del grupo ("grupo_123") o individuo ("default_user")
     * que recibe desde el router (main.js)
     */
    constructor(id) {
        super();
        this.id = id; // Guarda el ID (ej. "default_user" o "grupo_123")
        
        // 3. Crea la Vista
        this.view = new ComparacionView();
        
        // 4. Crea el Controlador y le "inyecta" la Vista y el ID
        this.controller = new ComparacionController(this.view, this.id);
    }

    /**
     * Pide a la Vista su HTML estático (el "esqueleto")
     */
    async mostrarContenido() {
        return this.view.getHtmlBase();
    }

    /**
     * Llama al Controlador para que "encienda" la página
     * (El controlador cargará los datos y llamará a la vista para renderizarlos)
     */
    async despuesDeCargar() {
        this.controller.iniciar();
    }
}