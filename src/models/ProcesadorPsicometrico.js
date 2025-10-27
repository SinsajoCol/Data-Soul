import { Rasgo } from "./Rasgo.js";
import { Rasgos } from "./Rasgos.js";

/**
 * Clase encargada de procesar los puntajes del cuestionario
 * y calcular los rasgos individuales o grupales.
 */
export class ProcesadorPsicometrico {
  
  /**
   * Calcula los rasgos individuales a partir de un cuestionario.
   * @param {Cuestionario} cuestionario - Objeto que contiene las preguntas y respuestas.
   * @returns {Rasgos} Objeto con los rasgos calculados.
   */
  calcularRasgos(cuestionario) {
    const mapaRasgos = new Map();

    for (const pregunta of cuestionario) {
      if (pregunta.respuesta == null) continue;

      // Si la pregunta es invertida: 5 -> 1, 4 -> 2, 3 -> 3, etc.
      let valor = pregunta.invertida ? 6 - pregunta.respuesta : pregunta.respuesta;
      let rasgoActual = mapaRasgos.get(pregunta.dimension) || [];

      rasgoActual.push(valor);
      mapaRasgos.set(pregunta.dimension, rasgoActual);
    }

    // Calcular promedio de cada rasgo
    const listaRasgos = [];
    for (const [dimension, valores] of mapaRasgos.entries()) {
      const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
      listaRasgos.push(new Rasgo(dimension, promedio));
    }

    return new Rasgos(listaRasgos);
  }

  /**
   * Procesa múltiples cuestionarios para obtener rasgos poblacionales.
   * @param {Cuestionario[]} cuestionarios - Lista de cuestionarios (por usuario).
   * @returns {Rasgos[]} Lista de resultados por usuario.
   */
  calcularRasgosMasivos(cuestionarios) {
    const resultados = [];
    for (const cuestionario of cuestionarios) {
      const rasgos = this.calcularRasgos(cuestionario);
      resultados.push(rasgos);
    }
    return resultados;
  }
}