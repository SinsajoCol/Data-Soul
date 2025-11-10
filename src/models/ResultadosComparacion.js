export default class ResultadosComparacion {
    static instance = null;

    constructor() {
        // Un Map para guardar { id => resultadoDeComparacion }
        // 'id' puede ser "default_user" o "grupo_123"
        // 'resultadoDeComparacion' puede ser 'ResultadoComparacionIndividual' o 'ResultadoComparacionGrupal'
        this.resultados = new Map();
    }

    /**
     * Obtiene la instancia única (Singleton) de esta clase.
     */
    static getInstance() {
        if (!ResultadosComparacion.instance) {
            ResultadosComparacion.instance = new ResultadosComparacion();
        }
        return ResultadosComparacion.instance;
    }

    /**
     * Guarda el último resultado de comparación en memoria.
     * @param {string} id - (ej. "default_user" o "grupo_123")
     * @param {Object} data - El objeto (ResultadoComparacionIndividual o ResultadoComparacionGrupal)
     */
    setResultados(id, data) {
        this.resultados.set(id, data);
        console.log("Resultados de comparación guardados en el Singleton:", this.resultados);
    }

    /**
     * Obtiene el resultado de una comparación guardada.
     */
    getResultados(id) {
        return this.resultados.get(id);
    }

    /**
     * Borra todos los resultados de comparación guardados.
     */
    limpiar() {
        this.resultados.clear();
    }
}