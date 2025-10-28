import Cuestionario from "../models/Cuestionario.js";
import PaginaCuestionario from "../views/PaginaCuestionario.js";

export default class CuestionarioController {
  constructor() {
    this.model = new Cuestionario();
    this.view = new PaginaCuestionario();

    this.view.onNextClick = this.handleNext.bind(this);
    this.view.onPrevClick = this.handlePrev.bind(this);
    this.view.onRespuestaClick = this.handleRespuesta.bind(this);
  }

  async iniciar(jsonUrl) {
    await this.view.render(); // ✅ primero renderiza header/footer + contenido
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
    if (this.model.esPaginaFinal()) {
      alert("¡Test completado! Los resultados se han guardado.");
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
