import { jest } from "@jest/globals";

// --- Mock de dependencias ---
const mockGuardar = jest.fn();
const mockCargar = jest.fn(() => null);
const mockEliminar = jest.fn();

await jest.unstable_mockModule("../../src/models/AlmacenamientoLocal.js", () => ({
  default: { guardar: mockGuardar, cargar: mockCargar, eliminar: mockEliminar }
}));

await jest.unstable_mockModule("../../src/models/DatosIndividuales.js", () => ({
  DatosIndividuales: class {
    constructor(usuarioId, datos) { this.usuarioId = usuarioId; this.datos = datos; }
    static fromJSON(json) { return new this(json.usuarioId, json.datos); }
    toJSON() { return { usuarioId: this.usuarioId, datos: this.datos }; }
  }
}));

await jest.unstable_mockModule("../../src/models/DatosPoblacion.js", () => ({
  DatosPoblacion: class {
    constructor(nombreGrupo, datos) { this.nombreGrupo = nombreGrupo; this.datos = datos; }
    static fromJSON(json) { return new this(json.nombreGrupo, json.datos); }
    toJSON() { return { nombreGrupo: this.nombreGrupo, datos: this.datos }; }
  }
}));

// --- Import real ---
const { default: Resultados } = await import("../../src/models/Resultados.js");

describe("Clase Resultados (integración)", () => {
  let resultados;

  beforeEach(() => {
    resultados = new Resultados();
    resultados.individuales = {};
    resultados.poblaciones = {};
    jest.clearAllMocks();
  });

  test("Debe crear una única instancia (Singleton)", () => {
    const r1 = Resultados.getInstance();
    const r2 = Resultados.getInstance();
    expect(r1).toBe(r2);
  });

  test("Debe agregar y guardar un resultado individual", () => {
    const mockInd = { usuarioId: "U001", toJSON: jest.fn(() => ({ usuarioId: "U001" })) };

    resultados.agregarResultadoIndividual(mockInd);

    expect(resultados.individuales["U001"]).toBe(mockInd);
    expect(mockGuardar).toHaveBeenCalled();
  });

  test("Debe agregar y guardar resultados de población", () => {
    const mockPob = { nombreGrupo: "Grupo1", toJSON: jest.fn(() => ({ nombreGrupo: "Grupo1" })) };

    resultados.agregarResultadosPoblacion(mockPob);

    expect(resultados.poblaciones["Grupo1"]).toBe(mockPob);
    expect(mockGuardar).toHaveBeenCalled();
  });

  test("Debe limpiar completamente los resultados", () => {
    resultados.individuales = { A: {} };
    resultados.poblaciones = { B: {} };

    resultados.limpiar();

    expect(resultados.individuales).toEqual({});
    expect(resultados.poblaciones).toEqual({});
    expect(mockEliminar).toHaveBeenCalledWith("resultados");
  });

  test("Debe limpiar solo resultados poblacionales", () => {
    resultados.individuales = { X: { usuarioId: "X" } };
    resultados.poblaciones = { G1: { nombreGrupo: "G1" } };

    resultados.limpiarResultadosPoblacion();

    expect(resultados.poblaciones).toEqual({});
    expect(resultados.individuales).toHaveProperty("X");
    expect(mockGuardar).toHaveBeenCalled();
  });

  test("Debe cargar correctamente desde localStorage si hay datos", () => {
    const fakeData = {
      individuales: [{ usuarioId: "U002", datos: { puntaje: 90 } }],
      poblaciones: [{ nombreGrupo: "TestGroup", datos: { promedio: 4.5 } }]
    };

    mockCargar.mockReturnValueOnce(fakeData);

    const nuevo = new Resultados();

    expect(Object.keys(nuevo.individuales)).toContain("U002");
    expect(Object.keys(nuevo.poblaciones)).toContain("TestGroup");
  });
});
