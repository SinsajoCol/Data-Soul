import { jest } from "@jest/globals";

// --- MOCK CORRECTO de AlmacenamientoLocal ---
const mockGuardar = jest.fn();
const mockCargar = jest.fn(() => ({ "1": 4 }));

// Registramos el mock antes de importar las clases reales
await jest.unstable_mockModule("../../src/models/AlmacenamientoLocal.js", () => ({
  default: {
    guardar: mockGuardar,
    cargar: mockCargar
  }
}));

// Importamos los módulos reales después del mock
const { default: Cuestionario } = await import("../../src/models/Cuestionario.js");
const { Pregunta } = await import("../../src/models/Preguntas.js");
const { default: AlmacenamientoLocal } = await import("../../src/models/AlmacenamientoLocal.js");

describe("Clase Cuestionario", () => {
  let cuestionario;

  beforeEach(() => {
    cuestionario = new Cuestionario();
    cuestionario.preguntas = [
      new Pregunta(1, "Soy sociable", "Extroversión"),
      new Pregunta(2, "Soy responsable", "Responsabilidad"),
      new Pregunta(3, "Soy creativo", "Apertura"),
      new Pregunta(4, "Soy tranquilo", "Neuroticismo"),
      new Pregunta(5, "Soy empático", "Amabilidad")
    ];
    mockGuardar.mockClear();
    mockCargar.mockClear();
  });

  test("Debe guardar y cargar respuestas correctamente", () => {
    cuestionario.guardarRespuesta(1, 5);
    expect(mockGuardar).toHaveBeenCalledWith("respuestas", { 1: 5 });
  });

  test("Debe calcular correctamente el progreso", () => {
    cuestionario.respuestas = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 };
    const progreso = cuestionario.getProgreso();
    expect(progreso).toBe(100); // todas respondidas
  });

  test("Debe retornar correctamente el grupo actual de 5 preguntas", () => {
    const grupo = cuestionario.currentGroup();
    expect(grupo.length).toBe(5);
  });

  test("Debe pasar de página y retroceder correctamente", () => {
    cuestionario.preguntas = Array.from({ length: 10 }, (_, i) => new Pregunta(i + 1, `P${i + 1}`, "X"));
    expect(cuestionario.esPaginaInicial()).toBe(true);

    cuestionario.nextGroup();
    expect(cuestionario.paginaActual).toBe(1);

    cuestionario.prevGroup();
    expect(cuestionario.paginaActual).toBe(0);
  });
});
