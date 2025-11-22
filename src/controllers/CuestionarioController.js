import CuestionarioModel from "../models/Cuestionario.js";
import CuestionarioView from "../views/CuestionarioView.js";

export default class CuestionarioController {
    constructor() {
        this.model = null;
        this.view = null;
        this.onFinalizar = null;
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

    handleNext() {
        if (!this.validarPaginaActual()) {// Validación: todas las preguntas respondidas
            alert("Por favor, responde todas las preguntas antes de continuar.");
            return; 
        }

        if (this.model.esPaginaFinal()) {
            // Cuestionario completado
            if (this.onFinalizar) {
                this.onFinalizar(this.model); // ¡Anuncia que terminó y pasa los datos!
                console.log("Cuestionario completado");
            }

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
    validarPaginaActual() {
        // 1. Obtiene las 5 preguntas que se están mostrando
        const preguntasActuales = this.model.currentGroup();
        
        // 2. Obtiene TODAS las respuestas guardadas
        const respuestas = this.model.getRespuestas();

        // 3. Itera sobre las 5 preguntas de la página
        for (const pregunta of preguntasActuales) {
            
            // 4. Comprueba si la respuesta para esta pregunta NO existe
            // (es decir, es undefined o null)
            if (respuestas[pregunta.id] === undefined || respuestas[pregunta.id] === null) {
                console.warn(`Validación falló: Pregunta ID ${pregunta.id} no está respondida.`);
                return false; // ¡Encontró una sin responder! Detiene el bucle.
            }
        }

        // 5. Si el bucle termina, todas las preguntas tenían respuesta
        return true; 
    }
}