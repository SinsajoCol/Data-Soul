// Importa la clase 'Rasgos' que sabe cómo manejar 'Rasgo'
import { Rasgos } from './Rasgos.js';

export default class ProcesadorPsicometrico {

    /**
     * Calcula los puntajes de los rasgos a partir de las preguntas y sus respuestas.
     *
     * @param {Array<Pregunta>} preguntas - La lista completa de objetos Pregunta
     * @param {Object} respuestas - El mapa de respuestas del usuario (ej: {1: 5, 2: 3, ...})
     * @returns {Rasgos} - Una nueva instancia de la clase Rasgos con los puntajes calculados.
     */
    calcularRasgos(preguntas, respuestas) {
        
        // 1. Usamos un objeto simple para acumular los puntajes temporalmente.
        const puntajesTemporales = {};

        // 2. Iteramos sobre cada pregunta (del modelo)
        for (const pregunta of preguntas) {
            const rasgoNombre = pregunta.rasgoAsociado; // Ej: "Extraversion"
            const valorRespuesta = respuestas[pregunta.id]; // Ej: 5

            // 3. Obtenemos el puntaje. La clase 'Pregunta' maneja la lógica de inversión (ej: 6 - respuesta).
            const puntaje = pregunta.obtenerValorAjustado(Number(valorRespuesta));

            // 4. Acumulamos el puntaje para ese rasgo.
            if (puntajesTemporales[rasgoNombre]) {
                puntajesTemporales[rasgoNombre] += puntaje; // Suma el puntaje
                conteoTemporales[rasgoNombre]++; // Incrementa el conteo de preguntas para este rasgo
            } else {
                puntajesTemporales[rasgoNombre] = puntaje;
            }
        }
        
        // 5. creamos el objeto de 'Rasgos'
        const rasgosResultado = new Rasgos();

        for (const nombreRasgo in puntajesTemporales) {
            const sumaTotal = puntajesTemporales[nombreRasgo];
            const numPreguntas = conteoTemporales[nombreRasgo];

            // Calcula el promedio (Suma / Cantidad)
            const valorPromedio = sumaTotal / numPreguntas;
            
            // Guarda el promedio (ej: 3.25) en lugar de la suma (ej: 26)
            rasgosResultado.agregarRasgo(nombreRasgo, valorPromedio);
        }

        // 6. Devolvemos la instancia final de 'Rasgos'
        return rasgosResultado;
    }
}