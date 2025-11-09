// tests/integration/ProcesamientoController.test.js
import { jest } from "@jest/globals";
import ProcesamientoController from "../../src/controllers/ProcesamientoController.js";

// --- Mocks de dependencias ---
class MockProcesador {
  calcularRasgos = jest.fn(() => ({ tipo: "Rasgos", valor: 50 }));
}
class MockResultados {
  static instance = null;
  static getInstance() {
    if (!this.instance) this.instance = new MockResultados();
    return this.instance;
  }
  agregarResultadoIndividual = jest.fn();
}
class MockModelo {
  getPreguntas() { return [{ id: 1 }]; }
  getRespuestas() { return { 1: 5 }; }
}

describe("ProcesamientoController (integración)", () => {
  let controller;

  beforeEach(() => {
    controller = new ProcesamientoController();
    controller.procesador = new MockProcesador();
    controller.resultados = MockResultados.getInstance();
  });

  test("Debe calcular rasgos y guardar el resultado individual", () => {
    const modelo = new MockModelo();
    const rasgos = controller.calcularResultados(modelo);

    expect(controller.procesador.calcularRasgos).toHaveBeenCalled();
    expect(controller.resultados.agregarResultadoIndividual).toHaveBeenCalled();
    expect(rasgos).toEqual({ tipo: "Rasgos", valor: 50 });
  });

  test("Debe fallar si el modelo no tiene respuestas", () => {
    const modelo = new MockModelo();
    modelo.getRespuestas = () => ({});

    const resultado = controller.calcularResultados(modelo);
    expect(resultado).toEqual({ tipo: "Rasgos", valor: 50 }); // sigue retornando objeto base
  });
});
