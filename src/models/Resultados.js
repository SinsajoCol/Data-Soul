class Resultados {
    static instance = null;

    constructor() {
        this.individuales = {}; // { usuarioId: DatosIndividuales }
        this.poblaciones = {};  // { grupoId: DatosPoblacion }
    }

    static getInstance() {
        if (!Resultados.instance) {
        Resultados.instance = new Resultados();
        }
        return Resultados.instance;
    }

    agregarResultadoIndividual(individuo) {
        this.individuales[individuo.usuarioId] = individuo;
    }

    agregarResultadosPoblacion(grupo) {
        this.poblaciones[grupo.nombreGrupo] = grupo;
    }

    obtenerResultadosIndividuales() {
        return this.individuales;
    }

    obtenerResultadosPoblacion() {
        return this.poblaciones;
    }

    guardarEnLocalStorage() {
        const data = {
            individuales: Object.values(this.individuales).map(i => i.toJSON()),
            poblaciones: Object.values(this.poblaciones).map(p => p.toJSON())
        };
        AlmacenamientoLocal.guardar("resultados", data);
    }

    cargarDeLocalStorage() {
        const datos = AlmacenamientoLocal.cargar("resultados");
        if (datos) {// se encontraron datos y se limpian las variables internas
            this.individuales = {};
            this.poblaciones = {};

            for (const indPojo of datos.individuales || []) {
                const individuoInstancia = DatosIndividuales.fromJSON(indPojo); //retorna una instancia de DatosIndividuales
                this.individuales[individuoInstancia.usuarioId] = individuoInstancia; //se agrega a la lista de individuales
            }

            for (const poblacionPojo of datos.poblaciones || []) {
                const grupoInstancia = DatosPoblacion.fromJSON(poblacionPojo); //retorna una instancia de DatosPoblacion
                this.poblaciones[grupoInstancia.nombreGrupo] = grupoInstancia; //se agrega a la lista de poblaciones
            }
        }
    }

    limpiar() {
        this.individuales = {};
        this.poblaciones = {};
        AlmacenamientoLocal.eliminar("resultados");
    }
}