import { PaginaTemplate } from "./PaginaTemplate.js";
// 1. Importa el Controlador y la nueva Vista
import { CargaMasivaController } from "/src/controllers/CargaMasivaController.js";
import { PruebaGrupalView } from "/src/views/PruebaGrupalView.js";

export class PaginaPruebaGrupal extends PaginaTemplate {

    constructor() {
        super();
        // 2. Crea la Vista
        this.view = new PruebaGrupalView();
        // 3. Crea el Controlador y le "inyecta" la Vista
        this.controller = new CargaMasivaController(this.view);
    }

    /**
     * Pide a la Vista su HTML (el que nos pasaste)
     */
    async mostrarContenido() {
        const response = await fetch("/src/pages/PruebaGrupal.html");
        if (!response.ok) {
            console.error("❌ No se pudo cargar PruebaGrupal.html:", response.status);
            return "<p>Error cargando la página.</p>";
        }
        return await response.text();
    }

    /**
     * Llama al Controlador para que "encienda" la página
     */
    async despuesDeCargar() {
        console.log("📄 PaginaPruebaGrupal inicializada.");
        this.controller.iniciar();
    }
}
