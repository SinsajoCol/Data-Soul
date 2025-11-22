/**
 * Fábrica para crear instancias de Estrategias de Reporte.
 * Inyecta las dependencias necesarias (como ChartBuilder)
 * en cada estrategia que crea.
 */
export class ReportStrategyFactory {
    /**
     * @param {Object} deps - Dependencias a inyectar (ej. { chartBuilder, graficoExporter })
     */
    constructor(deps) {
        this.deps = deps;
        this._registry = new Map();
    }

    /**
     * @param {string} type - 'individual', 'comparativo'
     * @param {Function} creatorFn - Una función que toma 'deps' y devuelve una Strategy
     */
    register(type, creatorFn) {
        if (this._registry.has(type)) {
            console.warn(`Se está sobrescribiendo la estrategia: ${type}`);
        }
        this._registry.set(type, creatorFn);
    }

    /**
     * @param {string} type - 'individual', 'comparativo'
     * @returns {ReportStrategy}
     */
    create(type) {
        const creatorFn = this._registry.get(type);
        if (!creatorFn) {
            throw new Error(`Tipo de estrategia desconocido: ${type}`);
        }
        // Llama a la función (ej. (deps) => new IndividualStrategy(deps))
        // pasando las dependencias
        return creatorFn(this.deps);
    }
}