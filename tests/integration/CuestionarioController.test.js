// tests/unit/CuestionarioController.test.js
import { jest } from "@jest/globals";
import CuestionarioController from "../../src/controllers/CuestionarioController.js";

// --- Mocks de dependencias ---
class MockModel {
  constructor() {
    this.paginaActual = 0;
    this.preguntas = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    this.respuestas = {};
  }
  async cargarPreguntas() {}
  cargarRespuestas() {}
  currentGroup() { return this.preguntas; }
  getRespuestas() { return this.respuestas; }
  guardarRespuesta(id, valor) { this.respuestas[id] = valor; }
  getProgreso() { return Object.keys(this.respuestas).length * 20; }
  esPaginaInicial() { return this.paginaActual === 0; }
  esPaginaFinal() { return this.paginaActual >= 1; }
  nextGroup() { this.paginaActual++; }
  prevGroup() { this.paginaActual--; }
}

class MockView {
  conectarDOM = jest.fn();
  bindEvents = jest.fn();
  renderPreguntas = jest.fn();
  actualizarProgreso = jest.fn();
  actualizarBotones = jest.fn();
}

describe("CuestionarioController", () => {
  let controller, mockModel, mockView;

  beforeEach(() => {
    mockModel = new MockModel();
    mockView = new MockView();
    controller = new CuestionarioController();
    controller.model = mockModel;
    controller.view = mockView;
  });

  test("Debe mostrar la página actual correctamente", () => {
    controller.mostrarPaginaActual();
    expect(mockView.renderPreguntas).toHaveBeenCalled();
    expect(mockView.actualizarProgreso).toHaveBeenCalled();
  });

  test("Debe guardar respuestas y actualizar el progreso", () => {
    controller.handleRespuesta(1, 4);
    expect(mockModel.respuestas[1]).toBe(4);
    expect(mockView.actualizarProgreso).toHaveBeenCalled();
  });

  test("Debe llamar a onFinalizar al llegar a la última página", () => {
    controller.model.paginaActual = 1;
    controller.model.esPaginaFinal = () => true;
    controller.onFinalizar = jest.fn();

    // Todas las preguntas respondidas
    controller.model.getRespuestas = () => ({ 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 });
    controller.model.currentGroup = () => controller.model.preguntas;

    controller.handleNext();
    expect(controller.onFinalizar).toHaveBeenCalled();
  });

  test("Debe impedir avanzar si hay preguntas sin responder", () => {
    global.alert = jest.fn(); // mock alert
    controller.model.getRespuestas = () => ({ 1: 5, 3: 3 });
    controller.model.currentGroup = () => controller.model.preguntas;

    controller.handleNext();
    expect(global.alert).toHaveBeenCalledWith(
      "Por favor, responde todas las preguntas antes de continuar."
    );
  });
});
