import CuestionarioModel from "../models/Cuestionario.js";
import CuestionarioView from "../views/CuestionarioView.js";

export default class CuestionarioController {
    constructor() {
        this.model = null;
        this.view = null;
    }

    async iniciar(jsonUrl) {
        // 1. Crea las instancias
        this.model = new CuestionarioModel();
        this.view = new CuestionarioView();
        
        // 2. Conecta la Vista al DOM (¡Importante!)
        // (Esto busca los IDs)
        this.view.conectarDOM(); 

        // 3. Conecta los handlers del Controlador a la Vista
        this.view.onNextClick = this.handleNext.bind(this);
        this.view.onPrevClick = this.handlePrev.bind(this);
        this.view.onRespuestaClick = this.handleRespuesta.bind(this);
        
        // 4. Conecta los listeners internos de la Vista
        // (Esto hace los addEventListener)
        this.view.bindEvents(); 

        // 5. Carga datos y dibuja la UI inicial
        await this.model.cargarPreguntas(jsonUrl);
        this.model.cargarRespuestas();
        this.mostrarPaginaActual();
    }
    
    mostrarPaginaActual() {
        const preguntas = this.model.currentGroup();
        const respuestas = this.model.getRespuestas();
        this.view.renderPreguntas(preguntas, respuestas);
        this.actualizarUI();
    }

    actualizarUI() {
        const progreso = this.model.getProgreso();
        const esPrimera = this.model.esPaginaInicial();
        const esUltima = this.model.esPaginaFinal();
        this.view.actualizarProgreso(progreso);
        this.view.actualizarBotones(esPrimera, esUltima);
    }

    // --- Handlers (Lógica de tus antiguos listeners) ---

    handleNext() {
        if (this.model.esPaginaFinal()) {
            alert("¡Test completado! Los resultados se han guardado.");
            // window.location.href = "resultados.html"; // O usa tu router
        } else {
            this.model.nextGroup();
            this.mostrarPaginaActual();
        }
    }

    handlePrev() {
        this.model.prevGroup();
        this.mostrarPaginaActual();
    }

    handleRespuesta(id, valor) {
        this.model.guardarRespuesta(id, valor);
        this.view.actualizarProgreso(this.model.getProgreso());
    }
}