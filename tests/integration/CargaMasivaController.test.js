// tests/integration/CargaMasivaController.test.js
import { jest } from "@jest/globals";
import { CargaMasivaController } from "../../src/controllers/CargaMasivaController.js";

class MockView {
  conectarDOM = jest.fn();
  bindEvents = jest.fn();
  mostrarError = jest.fn();
  mostrarResultados = jest.fn();
}
class MockResultados {
  static instance = null;
  static getInstance() {
    if (!this.instance) this.instance = new MockResultados();
    return this.instance;
  }
  agregarResultadosPoblacion = jest.fn();
  limpiarResultadosPoblacion = jest.fn();
}
class MockProcesador {
  calcularRasgos = jest.fn(() => ({ apertura: 4, amabilidad: 5 }));
}
class MockCuestionarioModel {
  async cargarPreguntas() {
    this.preguntas = [
      { id: 1, texto: "Soy sociable", rasgoAsociado: "Extroversión" },
      { id: 2, texto: "Soy amable", rasgoAsociado: "Amabilidad" },
    ];
  }
}

describe("CargaMasivaController (integración)", () => {
  let controller;

  beforeEach(async () => {
    controller = new CargaMasivaController(new MockView());
    controller.resultados = MockResultados.getInstance();
    controller.procesador = new MockProcesador();
    controller.model = new MockCuestionarioModel();
    await controller.cargarDefinicionesPreguntas("fakepath.json");
  });

  test("Debe inicializar correctamente las definiciones de preguntas", async () => {
    expect(controller.definicionesPreguntas.length).toBe(2);
  });

  test("Debe lanzar error si no se puede mapear ninguna pregunta", () => {
    const headers = [["Otra pregunta"], ["usuario1"]];
    expect(() => controller._procesarDatos(headers)).toThrow(
      "No se pudo mapear ninguna columna"
    );
  });

  test("Debe agregar grupo poblacional correctamente", () => {
    const headers = [
      ["soy sociable", "soy amable"],
      ["5", "4"],
      ["4", "5"]
    ];
    const grupo = controller._procesarDatos(headers);
    expect(grupo.lista.length).toBe(2);
  });
});
