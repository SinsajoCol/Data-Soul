import { PaginaTemplate } from "./PaginaTemplate.js";
import CuestionarioController from "/src/controllers/CuestionarioController.js";
import ProcesamientoController from "/src/controllers/ProcesamientoController.js";

export class PaginaCuestionario extends PaginaTemplate {

    constructor() {
        super();
        this.controlador = new CuestionarioController();
        this.procesadorCtrl = new ProcesamientoController();
    }

    async mostrarContenido() {
        const response = await fetch("/src/pages/PruebaIndividual.html");
        const html = await response.text();
        return html;
    }

    async despuesDeCargar() {
        // Le dice al controlador qué función ejecutar cuando termine
        this.controlador.onFinalizar = this.calcularResultados.bind(this);
        // Inicia el cuestionario (como antes)
        this.controlador.iniciar('./src/data/cuestionario.json');
    }

    calcularResultados(modelo) {
        console.log("El cuestionario terminó. Iniciando cálculo...");
        try {
            const rasgos = this.procesadorCtrl.calcularResultados(modelo);
            console.log("Rasgos calculados:", rasgos);
            alert("Los resultados se han calculado correctamente. ¡Gracias por completar el cuestionario!");
            window.location.hash = 'resultados';
        } catch (error) {

            console.error("Error al procesar los resultados:", error);
            alert("Hubo un error al guardar tus resultados.");
        }
    }
}