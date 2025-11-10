import { ResultadoComparacionIndividual } from './ResultadoComparacionIndividual.js';
import { DistanciaModeloLLM } from './DistanciaModeloLLM.js';
import { ResultadoComparacionGrupal } from './ResultadoComparacionGrupal.js';

export default class ComparadorRasgos {
    /**
     * CASO 1: Compara un individuo vs. LLM
     * @returns {ResultadoComparacionIndividual} Un objeto Modelo con el ranking.
     */
    compararIndividuo(individuo, modelosLLM) {
        //El array contendrá instancias de 'DistanciaModeloLLM'
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

            if (rasgosComparados == 8) { // Asegura que se compararon todos los rasgos
                const distanciaEuclidiana = Math.sqrt(sumaDeCuadrados);
                
                // 3. Creamos una instancia de 'DistanciaModeloLLM' y la agregamos al array
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
     * CASO 2: Compara un grupo (individuo por individuo) contra el rango (IC 95%) de los LLM.
     * @returns {ResultadoComparacionGrupal} Un objeto Modelo con el reporte.
     */

  compararGrupo(grupo, modelosLLM) {
        // Objeto temporal para guardar { "Gemma-3": [Array de resultados de rasgo], ... }
        const resultadosFinales = {}; 
        
        // Obtenemos la lista de todos los individuos del grupo
        const individuosDelGrupo = grupo.lista;
        const N_Grupo = individuosDelGrupo.length; // ej. 17

        if (N_Grupo === 0) {
            throw new Error("El grupo no tiene participantes.");
        }

        modelosLLM.forEach(modelo => {
            // Este array guardará los resultados de cada rasgo para este modelo
            const comparacionesRasgos = []; 

            // Itera sobre los rasgos del LLM (ej. Extraversión, Amabilidad...)
            modelo.estadisticas.forEach(statLLM => {
                const rasgoNombre = statLLM.nombre;
                const llm_limInf = statLLM.limInf_95;
                const llm_limSup = statLLM.limSup_95;
                
                // 1. Contadores para este rasgo
                const conteo = { porDebajo: 0, dentro: 0, porArriba: 0 };

                // 2. Itera sobre CADA individuo del grupo
                individuosDelGrupo.forEach(individuo => {
                    const puntajeHumano = individuo.obtenerPuntaje(rasgoNombre);

                    if (puntajeHumano === null) return; // Salta si el individuo no tiene ese rasgo

                    // 3. Clasifica al individuo
                    if (puntajeHumano < llm_limInf) {
                        conteo.porDebajo++;
                    } else if (puntajeHumano > llm_limSup) {
                        conteo.porArriba++;
                    } else {
                        conteo.dentro++;
                    }
                });

                // 4. Calcula los porcentajes
                const porcentajes = {
                    porDebajo: ((conteo.porDebajo / N_Grupo) * 100).toFixed(1) + '%',
                    dentro: ((conteo.dentro / N_Grupo) * 100).toFixed(1) + '%',
                    porArriba: ((conteo.porArriba / N_Grupo) * 100).toFixed(1) + '%'
                };
                
                // 5. Guarda el resultado de este rasgo
                comparacionesRasgos.push({
                    rasgo: rasgoNombre,
                    rangoLLM_95: [llm_limInf, llm_limSup],
                    conteo: conteo,
                    porcentaje: porcentajes
                });
            });
            
            resultadosFinales[modelo.nombre] = comparacionesRasgos;
        });

        // 6. DEVUELVE EL MODELO CONTENEDOR
        return new ResultadoComparacionGrupal(grupo.nombreGrupo, resultadosFinales);
    }
}

  