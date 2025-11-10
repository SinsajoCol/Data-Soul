import { DatosPoblacion } from "../../src/models/DatosPoblacion.js";
import { DatosIndividuales } from "../../src/models/DatosIndividuales.js";
import { Rasgos } from "../../src/models/Rasgos.js";

describe("Clase DatosPoblacion", () => {
  let grupo, ind1, ind2;

  beforeEach(() => {
    const rasgos1 = new Rasgos();
    rasgos1.agregarRasgo("Amabilidad", 4);
    rasgos1.agregarRasgo("Responsabilidad", 3);

    const rasgos2 = new Rasgos();
    rasgos2.agregarRasgo("Amabilidad", 2);
    rasgos2.agregarRasgo("Responsabilidad", 5);

    ind1 = new DatosIndividuales("u1", rasgos1);
    ind2 = new DatosIndividuales("u2", rasgos2);

    grupo = new DatosPoblacion("GrupoTest");
    grupo.agregar(ind1);
    grupo.agregar(ind2);
  });

  // Creación básica
  test("Debe crear correctamente un grupo", () => {
    expect(grupo.nombreGrupo).toBe("GrupoTest");
    expect(grupo.lista.length).toBe(2);
  });

  // Promedio simple
  test("Debe calcular el promedio de un rasgo", () => {
    const prom = grupo.obtenerPromedio("Amabilidad");
    expect(prom).toBe(3); // (4 + 2) / 2
  });

  // Promedios grupales devuelven un objeto Rasgos
  test("Debe devolver objeto Rasgos con los promedios grupales", () => {
    const promedios = grupo.obtenerPromediosGrupales();
    expect(promedios).toBeInstanceOf(Rasgos);
  });

  // Desviación estándar correcta
  test("Debe calcular correctamente la desviación estándar", () => {
    const std = grupo.obtenerDesviacionEstandar("Amabilidad");
    expect(std).toBeCloseTo(1.4142, 4); // sqrt(((4-3)^2 + (2-3)^2) / 1)
  });

  // Caso: lista vacía
  test("Debe retornar 0 si la lista está vacía en promedio o desviación", () => {
    const vacio = new DatosPoblacion("vacio");
    expect(vacio.obtenerPromedio("X")).toBe(0);
    expect(vacio.obtenerDesviacionEstandar("X")).toBe(0);
    expect(vacio.obtenerPromediosGrupales()).toBeInstanceOf(Rasgos);
  });

  // Estadísticas grupales completas
  test("Debe generar estadísticas grupales con límites de confianza", () => {
    const stats = grupo.obtenerEstadisticasGrupales();
    expect(stats.length).toBeGreaterThan(0);
    expect(stats[0]).toHaveProperty("media");
    expect(stats[0]).toHaveProperty("limInf_95");
    expect(stats[0]).toHaveProperty("limSup_95");
  });

  // Serialización
  test("Debe serializar correctamente a JSON", () => {
    const json = grupo.toJSON();
    expect(json).toHaveProperty("nombreGrupo");
    expect(Array.isArray(json.lista)).toBe(true);
  });

  // Rehidratación desde JSON
  test("Debe de rehidratar correctamente desde JSON", () => {
    const json = grupo.toJSON();
    const nuevo = DatosPoblacion.fromJSON(json);
    expect(nuevo.lista.length).toBe(2);
    expect(nuevo.lista[0]).toBeInstanceOf(DatosIndividuales);
  });
});
