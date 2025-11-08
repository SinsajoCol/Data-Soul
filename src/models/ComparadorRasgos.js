import { ResultadoComparacionIndividual } from './ResultadoComparacionIndividual.js';
import { DistanciaModeloLLM } from './DistanciaModeloLLM.js';

export default class ComparadorRasgos {
    /**
     * CASO 1: Compara un individuo vs. LLM
     * @returns {ResultadoComparacionIndividual} Un objeto Modelo con el ranking.
     */
    compararIndividuo(individuo, modelosLLM) {
        // 2. El array contendrá instancias de 'DistanciaModeloLLM'
        const resultadosDistancia = []; 

        modelosLLM.forEach(modelo => {
            let sumaDeCuadrados = 0;
            let rasgosComparados = 0;

            // ... (Lógica de cálculo de 'sumaDeCuadrados' y 'rasgosComparados') ...
            individuo.rasgos.listaRasgos.forEach(rasgoHumano => {
                const statLLM = modelo.estadisticas.find(s => s.nombre === rasgoHumano.nombre);
                if (!statLLM) return;
                const puntajeHumano = rasgoHumano.valor;
                const mediaLLM = statLLM.media;
                sumaDeCuadrados += Math.pow(puntajeHumano - mediaLLM, 2);
                rasgosComparados++;
            });

            if (rasgosComparados > 0) {
                const distanciaEuclidiana = Math.sqrt(sumaDeCuadrados);
                
                // 3. ¡AQUÍ ESTÁ EL CAMBIO!
                // En lugar de un objeto simple: { nombreModelo: ..., distancia: ... }
                // Creamos una instancia de la nueva clase:
                resultadosDistancia.push(
                    new DistanciaModeloLLM(
                        modelo.nombre, 
                        distanciaEuclidiana, 
                        rasgosComparados
                    )
                );
            }
        });

        // 4. Ordena el array de instancias (sigue funcionando igual)
        const ranking = resultadosDistancia.sort((a, b) => a.distancia - b.distancia);

        // 5. Retorna la clase contenedora (sigue funcionando igual)
        return new ResultadoComparacionIndividual(individuo.usuarioId, ranking);
    }

  /**
   * CASO 2: Compara un grupo (con sus rangos) contra los modelos.
   * @param {DatosPoblacion} grupo - El objeto del grupo
   * @param {Array<ModeloLLM>} modelosLLM - La lista de modelos
   * @returns {Object} Un objeto con los resultados de la comparación
   */
  compararGrupo(grupo, modelosLLM) {
    const resultadosFinales = {};
    const statsGrupo = grupo.obtenerEstadisticasGrupales(); // [{nombre, media, limInf...}]

    modelosLLM.forEach(modelo => {
        const comparacionesModelo = [];

        statsGrupo.forEach(statHumano => {
            const statLLM = modelo.estadisticas.find(s => s.nombre === statHumano.nombre);
            if (!statLLM) return;

            const rangoHumano = [statHumano.limInf_95, statHumano.limSup_95];
            const rangoLLM = [statLLM.limInf_95, statLLM.limSup_95];

            // 1. Comprueba si los dos rangos se TRASLAPAN
            const coincide = (rangoHumano[0] <= rangoLLM[1] && rangoHumano[1] >= rangoLLM[0]);
            
            comparacionesModelo.push({
                rasgo: statHumano.nombre,
                mediaHumana: statHumano.media,
                rangoHumano_95: rangoHumano,
                mediaLLM: statLLM.media,
                rangoLLM_95: rangoLLM,
                coincide: coincide
            });
        });
        resultadosFinales[modelo.nombre] = comparacionesModelo;
    });

    return resultadosFinales;
  }
}

  