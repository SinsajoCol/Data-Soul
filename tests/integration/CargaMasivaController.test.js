import { jest } from "@jest/globals";

// --- Mocks de dependencias ---
const mockView = {
  conectarDOM: jest.fn(),
  bindEvents: jest.fn(),
  mostrarError: jest.fn(),
  mostrarResultados: jest.fn()
};

const mockResultados = {
  agregarResultadosPoblacion: jest.fn(),
  limpiarResultadosPoblacion: jest.fn()
};

const mockProcesador = {
  calcularRasgos: jest.fn(() => ({
    agregarRasgo: jest.fn(),
    listaRasgos: []
  }))
};

const mockCuestionarioModel = {
  cargarPreguntas: jest.fn(async () => {
    mockCuestionarioModel.preguntas = [
      { id: 1, texto: "Soy amable", rasgo: "Amabilidad" },
      { id: 2, texto: "Soy responsable", rasgo: "Responsabilidad" }
    ];
  }),
  preguntas: []
};

// Mock de Resultados (Singleton)
jest.unstable_mockModule("../../src/models/Resultados.js", () => ({
  default: { getInstance: () => mockResultados }
}));

// Mock de dependencias reales
jest.unstable_mockModule("../../src/models/ProcesadorPsicometrico.js", () => ({
  default: jest.fn(() => mockProcesador)
}));

jest.unstable_mockModule("../../src/models/Cuestionario.js", () => ({
  default: jest.fn(() => mockCuestionarioModel)
}));

// Importar después de registrar mocks
const { CargaMasivaController } = await import("../../src/controllers/CargaMasivaController.js");

describe("CargaMasivaController", () => {
  let controller;

  beforeEach(async () => {
    controller = new CargaMasivaController(mockView);
    await controller.cargarDefinicionesPreguntas("fake-url.json");
    jest.clearAllMocks();
  });

  // ✅ Inicialización correcta
  test("Debe iniciar correctamente y conectar la vista", async () => {
    await controller.iniciar();
    expect(mockView.conectarDOM).toHaveBeenCalled();
    expect(mockCuestionarioModel.cargarPreguntas).toHaveBeenCalled();
  });

  // ✅ Error al cargar definiciones
  test("Debe manejar error al cargar definiciones", async () => {
    mockCuestionarioModel.cargarPreguntas.mockRejectedValueOnce(new Error("Error al cargar"));
    await expect(controller.cargarDefinicionesPreguntas("url.json")).rejects.toThrow("Error al cargar");
  });

  // ✅ Limpieza de datos antiguos
  test("Debe limpiar resultados antiguos al llamar _limpiarDatosAntiguos()", () => {
    controller._limpiarDatosAntiguos();
    expect(mockResultados.limpiarResultadosPoblacion).toHaveBeenCalled();
  });

  // ✅ Procesamiento de datos correcto
  test("Debe procesar correctamente datos válidos", () => {
    const data = [
      ["Soy amable", "Soy responsable"],
      ["5", "4"],
      ["3", "2"]
    ];

    const result = controller._procesarDatos(data);
    expect(result.lista.length).toBeGreaterThan(0);
    expect(mockProcesador.calcularRasgos).toHaveBeenCalled();
  });

  // ❌ Error cuando no se mapea ninguna pregunta
  test("Debe lanzar error si no se mapea ninguna columna", () => {
    controller.definicionesPreguntas = [
      { id: 1, texto: "Pregunta inexistente", rasgo: "X" }
    ];
    const data = [["otra columna"], ["4"]];
    expect(() => controller._procesarDatos(data)).toThrow("No se pudo mapear ninguna columna");
  });

  // ❌ Error si el archivo está vacío o incompleto
  test("Debe lanzar error si el archivo no tiene datos suficientes", async () => {
    const fakeFile = new File([""], "vacio.csv");
    await controller.manejarArchivoSubido(fakeFile);
    expect(mockView.mostrarError).toHaveBeenCalled();
  });

  // ✅ Error por extensión no válida
  test("Debe mostrar error si el archivo no tiene extensión válida", async () => {
    const fakeFile = new File(["contenido"], "archivo.txt");
    await controller.manejarArchivoSubido(fakeFile);
    expect(mockView.mostrarError).toHaveBeenCalledWith(expect.stringContaining("Solo se admiten archivos XLSX o CSV"));
  });
});
