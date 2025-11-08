import { Rasgos } from "../../src/models/Rasgos.js";

describe("Clase Rasgos", () => {
  test("Debe agregar rasgos correctamente", () => {
    const rasgos = new Rasgos();
    rasgos.agregarRasgo("Amabilidad", 3.8);
    expect(rasgos.listaRasgos.length).toBe(1);
    expect(rasgos.listaRasgos[0].nombre).toBe("Amabilidad");
  });

  test("Debe obtener correctamente el valor de un rasgo existente", () => {
    const rasgos = new Rasgos();
    rasgos.agregarRasgo("Responsabilidad", 4.2);
    expect(rasgos.obtenerValor("Responsabilidad")).toBe(4.2);
  });

  test("Debe devolver null si el rasgo no existe", () => {
    const rasgos = new Rasgos();
    expect(rasgos.obtenerValor("Inexistente")).toBeNull();
  });

  test("Debe convertir correctamente a JSON y volver desde JSON", () => {
    const rasgos = new Rasgos();
    rasgos.agregarRasgo("Extroversión", 3.5);

    const jsonData = rasgos.toJSON();
    expect(Array.isArray(jsonData)).toBe(true);
    expect(jsonData[0]).toHaveProperty("nombre", "Extroversión");

    const reconstruido = Rasgos.fromJSON(jsonData);
    expect(reconstruido.obtenerValor("Extroversión")).toBe(3.5);
  });
});
