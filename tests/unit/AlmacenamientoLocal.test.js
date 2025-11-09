import { jest } from "@jest/globals";
import AlmacenamientoLocal from "../../src/models/AlmacenamientoLocal.js";

describe("Clase AlmacenamientoLocal", () => {
  // Simulamos localStorage con un mock en memoria
  const mockStorage = (() => {
    let store = {};
    return {
      setItem: jest.fn((key, value) => { store[key] = value; }),
      getItem: jest.fn((key) => store[key] || null),
      removeItem: jest.fn((key) => delete store[key]),
      clear: jest.fn(() => { store = {}; }),
    };
  })();

  beforeAll(() => {
    // Reemplazamos localStorage global por el mock
    global.localStorage = mockStorage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe guardar correctamente un valor", () => {
    const data = { nombre: "Daniel", puntaje: 90 };
    AlmacenamientoLocal.guardar("usuario", data);

    expect(mockStorage.setItem).toHaveBeenCalledWith("usuario", JSON.stringify(data));
  });

  test("Debe cargar correctamente un valor guardado", () => {
    const data = { nombre: "Arley", puntaje: 85 };
    mockStorage.getItem.mockReturnValueOnce(JSON.stringify(data));

    const resultado = AlmacenamientoLocal.cargar("usuario");
    expect(resultado).toEqual(data);
  });

  test("Debe retornar null si la clave no existe", () => {
    mockStorage.getItem.mockReturnValueOnce(null);
    const resultado = AlmacenamientoLocal.cargar("inexistente");
    expect(resultado).toBeNull();
  });

  test("Debe eliminar correctamente una clave", () => {
    AlmacenamientoLocal.eliminar("usuario");
    expect(mockStorage.removeItem).toHaveBeenCalledWith("usuario");
  });

  test("Debe limpiar todo el localStorage", () => {
    AlmacenamientoLocal.limpiartodo();
    expect(mockStorage.clear).toHaveBeenCalled();
  });

  test("Debe manejar errores al guardar", () => {
    mockStorage.setItem.mockImplementationOnce(() => { throw new Error("Fallo en almacenamiento"); });
    console.error = jest.fn();

    AlmacenamientoLocal.guardar("test", { x: 1 });
    expect(console.error).toHaveBeenCalledWith("Error al guardar en localStorage:", expect.any(Error));
  });
});
