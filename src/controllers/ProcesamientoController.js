import ProcesadorPsicometrico from "../models/ProcesadorPsicometrico.js";
import DatosIndividuales from '../models/DatosIndividuales.js';
import Resultados from "../models/Resultados.js"; // El Singleton

export default class ProcesamientoController {
    constructor() {
        this.procesador = new ProcesadorPsicometrico();
        // Obtiene la instancia ÚNICA de los resultados
        this.resultados = Resultados.getInstance();
    }

    /**
     * El método principal de esta clase.
     * Recibe el modelo del cuestionario.
     */
    calcularResultados(modelo) {
        // 1. Pide al procesador que calcule los rasgos
        const rasgosObjeto = this.procesador.calcularRasgos(
            modelo.getPreguntas(),
            modelo.getRespuestas()
        );
        
        const individuo = new DatosIndividuales('default_user', rasgosObjeto);

        // 3. Guarda el objeto 'DatosIndividuales' en el Singleton 'Resultados'.
        // (La clase Resultados se encargará internamente de persistirlo en localStorage).
        this.resultados.agregarResultadoIndividual(individuo);
        
        // 4. Devuelve el objeto Rasgos
        // (Esto permite a PaginaCuestionario decidir si lo usa o simplemente navega)
        return rasgosObjeto;
    }
}