import { DistanciaModeloLLM } from './DistanciaModeloLLM.js'; // Importar para JSDoc

export class ResultadoComparacionIndividual {
    /**
     * @param {string} idHumano - El ID del usuario (ej. "default_user")
     * @param {Array<DistanciaModeloLLM>} ranking - El array ordenado de instancias de DistanciaModeloLLM
     */
    
    constructor(idHumano, ranking) {
        this.idHumano = idHumano;
        this.ranking = ranking; 
    }

    /**
     * Un método "helper" para obtener fácilmente el modelo más similar.
     */
    getModeloMasCercano() {
        // Devuelve el primer ítem (distancia más baja) o null si está vacío
        return this.ranking.length > 0 ? this.ranking[0] : null;
    }
}