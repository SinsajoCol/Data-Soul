import { DatosIndividuales } from "../../src/models/DatosIndividuales.js";
import { Rasgos } from "../../src/models/Rasgos.js";
import { Rasgo } from "../../src/models/Rasgo.js";

describe("Clase DatosIndividuales", () => {
  let rasgos;
  let individuo;

  //Antes de cada prueba, inicializamos un objeto Individuo con algunos rasgos
  beforeEach(() => {
    rasgos = new Rasgos();
    rasgos.agregarRasgo("Responsabilidad", 4);
    rasgos.agregarRasgo("Amabilidad", 3);
    individuo = new DatosIndividuales("usuario_1", rasgos);
  });

  // Creación básica
  test("Debe crear correctamente un objeto DatosIndividuales", () => {
    expect(individuo.usuarioId).toBe("usuario_1");
    expect(individuo.rasgos).toBeInstanceOf(Rasgos);
  });

  // Obtener puntaje de un rasgo
  test("Debe obtener el puntaje correcto de un rasgo", () => {
    const puntaje = individuo.obtenerPuntaje("Responsabilidad");
    expect(puntaje).toBe(4);
  });

  // Error si se intenta obtener un rasgo inexistente
  test("Debe devolver null si se intenta obtener un rasgo inexistente", () => {
    expect(individuo.obtenerPuntaje("Creatividad")).toBeNull();
  });

  // Serialización a JSON
  test("Debe serializar correctamente con toJSON()", () => {
    const json = individuo.toJSON();
    expect(json.usuarioId).toBe("usuario_1");
    expect(Array.isArray(json.rasgos)).toBe(true);
  });

  // Rehidratación desde JSON
  test("Debe rehidratar correctamente desde JSON", () => {
    const data = individuo.toJSON();
    const nuevo = DatosIndividuales.fromJSON(data);
    expect(nuevo).toBeInstanceOf(DatosIndividuales);
    expect(nuevo.rasgos.listaRasgos.length).toBe(2);
  });

});
