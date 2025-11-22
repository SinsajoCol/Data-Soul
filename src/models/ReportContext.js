/**
 * Contenedor de datos que se pasa a una estrategia de reporte.
 * Provee todos los datos "crudos" que la estrategia podría necesitar.
 */
export class ReportContext {
    /**
     * @param {Individuo} datosUsuario - El objeto Individuo (o null)
     * @param {Grupo} datosGrupo - El objeto Grupo (o null)
     * @param {Array<ModeloLLM>} datosModelos - Array de todos los modelos LLM
     * @param {Object} metadata - (ej: { usuarioId, rasgosOrdenados, descripciones })
     * @param {ProcesadorComparacion} procesador - Para que la estrategia haga cálculos
     */
    constructor(datosUsuario, datosGrupo, datosModelos, metadata, procesador) {
        this.datosUsuario = datosUsuario;
        this.datosGrupo = datosGrupo;
        this.datosModelos = datosModelos;
        this.metadata = metadata;
        this.procesador = procesador;

        // Ayudante para saber en qué modo estamos
        this.esGrupo = !!datosGrupo;
        this.esIndividual = !!datosUsuario;
    }
}