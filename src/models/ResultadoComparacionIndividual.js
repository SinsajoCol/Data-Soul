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
    
}