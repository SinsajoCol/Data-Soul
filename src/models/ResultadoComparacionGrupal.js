export class ResultadoComparacionGrupal {
    /**
     * Almacena el reporte completo de comparación de un grupo.
     * @param {string} idGrupo - El ID del grupo (ej. "grupo_csv_123")
     * @param {Object} resultadosPorModelo - ej: { "Gemma-3": [ComparacionGrupalRasgo, ...], ... }
     */
    constructor(idGrupo, resultadosPorModelo) {
        this.idGrupo = idGrupo;
        this.resultadosPorModelo = resultadosPorModelo;
    }
}