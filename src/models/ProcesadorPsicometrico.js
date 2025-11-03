import { Rasgo } from './Rasgo.js';
import { Rasgos } from './Rasgos.js';

export default class ProcesadorPsicometrico {
  calcularRasgos(cuestionario) {
    const mapaRasgos = new Map();

    for (const pregunta of cuestionario) {
      if (!pregunta || pregunta.respuesta == null) continue;
      const valor = pregunta.invertida ? 6 - pregunta.respuesta : pregunta.respuesta;
      const rasgoActual = mapaRasgos.get(pregunta.dimension) || [];
      rasgoActual.push(valor);
      mapaRasgos.set(pregunta.dimension, rasgoActual);
    }

    const listaRasgos = [];
    for (const [dimension, valores] of mapaRasgos.entries()) {
      const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
      listaRasgos.push(new Rasgo(dimension, promedio));
    }

    return new Rasgos(listaRasgos);
  }
}
