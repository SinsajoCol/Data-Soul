import { Rasgos } from './Rasgos.js';


export default class ProcesadorPsicometrico {

    /**
     * Calcula los puntajes de los rasgos a partir de las preguntas y sus respuestas.
     *
     * @param {Array<Pregunta>} preguntas - La lista completa de objetos Pregunta
     * @param {Object} respuestas - El mapa de respuestas (ej: {1: 5, 2: 3, ...})
     * @returns {Rasgos} - Una nueva instancia de la clase Rasgos con los puntajes calculados.
     */
    calcularRasgos(preguntas, respuestas) {

        // 1. Usamos un objeto simple para acumular los puntajes temporalmente.
        // Es más eficiente para sumas rápidas.
        const puntajesTemporales = {};

        // 2. Iteramos sobre cada pregunta (del modelo)
        for (const pregunta of preguntas) {
            const rasgoNombre = pregunta.rasgoAsociado;
            const valorRespuesta = respuestas[pregunta.id];

            // 4. Obtenemos el puntaje. La clase 'Pregunta' maneja la lógica
            // de inversión (ej: 6 - respuesta).
            const puntaje = pregunta.obtenerValorAjustado(Number(valorRespuesta));

            // 5. Acumulamos el puntaje para ese rasgo.
            if (puntajesTemporales[rasgoNombre]) {
                puntajesTemporales[rasgoNombre] += puntaje;
            } else {
                puntajesTemporales[rasgoNombre] = puntaje;
            }
        }

        // 6. Convertimos el objeto temporal al objeto 'Rasgos'
        const rasgosResultado = new Rasgos();

        for (const nombreRasgo in puntajesTemporales) {
            const valorTotal = puntajesTemporales[nombreRasgo];
            // Usamos el método de la clase 'Rasgos' para añadir
            rasgosResultado.agregarRasgo(nombreRasgo, valorTotal);
        }

        // 7. Devolvemos la instancia final de 'Rasgos'
        return rasgosResultado;
    }
}


// ---- NUEVA FUNCIÓN (NO TOCAR LA CLASE PRINCIPAL NI SUS COMENTARIOS) ----

/**
 * Cálculo masivo para plantillas (respetando lógica de inversión).
 * Recibe: array de {dimension, respuesta, invertida}
 * Devuelve: Rasgos (igual que la función principal)
 */
export function calcularRasgosDePlantilla(respuestasUsuario) {
    const puntajesPorDimension = {};
    for (const p of respuestasUsuario) {
        if (p.dimension == null || p.respuesta == null) continue;
        const valor = p.invertida ? 6 - p.respuesta : p.respuesta;
        if (!puntajesPorDimension[p.dimension])
            puntajesPorDimension[p.dimension] = [];
        puntajesPorDimension[p.dimension].push(valor);
    }
    const r = new Rasgos();
    for (const [dim, lista] of Object.entries(puntajesPorDimension)) {
        const promedio = lista.reduce((a, b) => a + b, 0) / lista.length;
        r.agregarRasgo(dim, promedio);
    }
    return r;
}
