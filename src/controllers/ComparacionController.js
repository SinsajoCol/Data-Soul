import Resultados from "../models/Resultados.js"; // El Singleton

export class ComparacionController {

    /**
     * @param {ResultadosView} view La instancia de la vista
     */
    constructor(view) {
        this.view = view;
        // Obtiene la instancia del Modelo (Singleton)
        this.resultadosDB = Resultados.getInstance();
    }

    /**
     * El "interruptor de encendido" de esta página
     */
    iniciar() {
        // 1. Le dice a la Vista que busque sus elementos en el DOM
        this.view.conectarDOM();

        // 2. Obtiene los datos del Modelo
        const todosIndividuos = this.resultadosDB.obtenerResultadosIndividuales();
        const miIndividuo = todosIndividuos['default_user'];

        // 3. Decide qué mostrar
        if (!miIndividuo) {
            // Le dice a la Vista que muestre un error
            this.view.renderError("No se encontraron resultados para mostrar.");
        } else {
            // Le dice a la Vista que renderice los datos
            this.view.render(miIndividuo.rasgos);
        }
    }
}