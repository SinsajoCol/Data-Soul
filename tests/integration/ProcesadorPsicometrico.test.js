import ProcesadorPsicometrico from "../../src/models/ProcesadorPsicometrico.js";
import { Rasgos } from "../../src/models/Rasgos.js";

describe("Integración: ProcesadorPsicometrico + Rasgos + Rasgo", () => {
  test("Debe calcular correctamente los promedios por rasgo", () => {
    const preguntas = [
      { id: 1, rasgoAsociado: "Extroversión", obtenerValorAjustado: () => 5 },
      { id: 2, rasgoAsociado: "Extroversión", obtenerValorAjustado: () => 3 },
      { id: 3, rasgoAsociado: "Responsabilidad", obtenerValorAjustado: () => 4 }
    ];

    const respuestas = { 1: 5, 2: 3, 3: 4 };
    const procesador = new ProcesadorPsicometrico();
    const resultado = procesador.calcularRasgos(preguntas, respuestas);

    expect(resultado).toBeInstanceOf(Rasgos);
    expect(resultado.obtenerValor("Extroversión")).toBe(4); // (5+3)/2
    expect(resultado.obtenerValor("Responsabilidad")).toBe(4);
  });
});
