export class DistanciaModeloLLM {
    /**
     * Almacena el resultado de la comparación de distancia para un solo modelo.
     * @param {string} nombreModelo - El nombre del LLM (ej. "Gemma-3")
     * @param {number} distancia - La distancia Euclidiana calculada (ej. 3.4)
     * @param {number} rasgosComparados - El número de rasgos usados (ej. 9)
     */
    constructor(nombreModelo, distancia, rasgosComparados) {
        this.nombreModelo = nombreModelo;
        this.distancia = distancia;
        this.rasgosComparados = rasgosComparados;
    }
}