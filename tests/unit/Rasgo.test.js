import { Rasgo } from "../../src/models/Rasgo.js";

describe("Clase Rasgo (con validaciones)", () => {

  test("Debe crear un rasgo correctamente cuando tiene nombre y valor válidos", () => {
    const rasgo = new Rasgo("Extroversión", 4);
    expect(rasgo.nombre).toBe("Extroversión");
    expect(rasgo.valor).toBe(4);
  });

  test("Debe lanzar error si no se proporciona valor", () => {
    expect(() => new Rasgo("Responsabilidad")).toThrow("El rasgo debe tener un valor definido.");
  });

  test("Debe lanzar error si el valor es menor que 1", () => {
    expect(() => new Rasgo("Amabilidad", 0)).toThrow("El valor del rasgo debe estar entre 1 y 5.");
  });

  test("Debe lanzar error si el valor es mayor que 5", () => {
    expect(() => new Rasgo("Amabilidad", 6)).toThrow("El valor del rasgo debe estar entre 1 y 5.");
  });

  test("Debe lanzar error si el valor no es un número", () => {
    expect(() => new Rasgo("Responsabilidad", "cuatro")).toThrow("El valor del rasgo debe estar entre 1 y 5.");
  });
});

