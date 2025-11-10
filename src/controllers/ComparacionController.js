import Resultados from "../models/Resultados.js"; // El Singleton
import { GestorModelosLLM } from "../models/GestorModelosLLM.js";
import ProcesadorComparacion  from "../models/ProcesadorComparacion.js";
import ResultadosComparacion from "../models/ResultadosComparacion.js";
const rutaLLM = "src/data/llm_raw.json";

export class ComparacionController {

    constructor(view, id) {
        this.view = view;
        this.id = id;
        this.resultados = Resultados.getInstance();
        this.gestorLLM = new GestorModelosLLM();
        this.procesadorComparacion = new ProcesadorComparacion();
    }

    /**
     * El "interruptor de encendido" de esta página
     */
    async iniciar() {

        this.view.conectarDOM(); // Conecta la vista (para gráficas, etc.)
        try {
            // 1. Carga los modelos LLM
            await this.gestorLLM.cargarModelos(rutaLLM);
            const modelosLLM = this.gestorLLM.modelos;

            // 2. Carga los datos del grupo desde el Singleton
            const grupos = this.resultados.obtenerResultadosPoblacion();
            const individuos = this.resultados.obtenerResultadosIndividuales();

            let humanDataLabel;   // "Grupo: X" o "Individuo: Y"

            let comparacion; // El resultado del procesamiento
            let tipoComparacion; // "individual" o "grupo"

            // 3. ¡AQUÍ ESTÁ LA LÓGICA DE BIFURCACIÓN!
            if (grupos[this.id]) {
                // --- CASO A: Es un GRUPO ---
                const grupo = grupos[this.id];
                humanDataLabel = `Grupo: ${grupo.nombreGrupo}`;
                tipoComparacion = "grupo";
                // Calcula las estadísticas del grupo
                comparacion = this.procesadorComparacion.compararGrupo(grupo, modelosLLM);
                
            } else if (individuos[this.id]) {
                // --- CASO B: Es un INDIVIDUO ---
                const individuo = individuos[this.id];
                humanDataLabel = `Individuo: ${individuo.usuarioId}`;
                tipoComparacion = "individual";
                
                comparacion = this.procesadorComparacion.compararIndividuo(individuo, modelosLLM);

            } else {
                throw new Error(`No se encontraron datos para el ID: "${this.id}"`);
            }
            
            ResultadosComparacion.getInstance().setResultados(this.id, comparacion);

            // 4. Muestra las tablas en consola (¡Ahora 'comparacion' y 'tipo' existen!)
            this.mostrarTablasConsola(humanDataLabel, comparacion, tipoComparacion);
            
            // 5. Pasa los datos a la Vista para renderizar
            this.view.render(humanDataLabel, comparacion, tipoComparacion);

        } catch (error) {
            console.error("Error al cargar datos de comparación:", error);
            this.view.mostrarError(error.message);
        }
    }

    mostrarTablasConsola(humanDataLabel, comparacion, tipo) {
        console.log(`--- COMPARACIÓN ${tipo.toUpperCase()} PARA: ${humanDataLabel.toUpperCase()} ---`);
        
        if (tipo === "individual") {
            // 'comparacion' ES el array de resultados
            console.log("Ranking de Modelos (Distancia Euclidiana - 0 es idéntico):");
            const tabla = comparacion.map(item => ({
                "Modelo LLM": item.nombreModelo,
                "Distancia": item.distancia.toFixed(2),
                "Rasgos Comparados": item.rasgosComparados
            }));
            console.table(tabla);

        } else { // tipo === "grupo"
            // 'comparacion' es el objeto ResultadoComparacionGrupal
            for (const nombreModelo in comparacion.resultadosPorModelo) {
                console.log(`\nModelo: ${nombreModelo}`);
                
                const tabla = comparacion.resultadosPorModelo[nombreModelo].map(item => ({
                    Rasgo: item.rasgo,
                    Promedio_LLM: item.mediaLLM.toFixed(2),
                    Rango_LLM_95: `${item.rangoLLM_95[0].toFixed(2)} - ${item.rangoLLM_95[1].toFixed(2)}`,
                    "%_Debajo": item.porcentaje.porDebajo,
                    "%_Dentro": item.porcentaje.dentro,
                    "%_Arriba": item.porcentaje.porArriba
                }));
                console.table(tabla);
            }

        }
    }
}