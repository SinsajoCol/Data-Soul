import Resultados from "../models/Resultados.js"; // El Singleton
import { GestorModelosLLM } from "../models/GestorModelosLLM.js";
const rutaLLM = "src/data/llm_raw.json";

export class ComparacionController {

    constructor(view, id) {
        this.view = view;
        this.id = id;
        this.resultados = Resultados.getInstance();
        this.gestorLLM = new GestorModelosLLM();
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

            let humanStats;       // Los datos estadísticos (media, IC)
            let humanDataLabel;   // "Grupo: X" o "Individuo: Y"

            // 3. ¡AQUÍ ESTÁ LA LÓGICA DE BIFURCACIÓN!
            if (grupos[this.id]) {
                // --- CASO A: Es un GRUPO ---
                const grupo = grupos[this.id];
                humanDataLabel = `Grupo: ${grupo.nombreGrupo}`;
                // Calcula las estadísticas del grupo
                humanStats = grupo.obtenerEstadisticasGrupales(); 
                
            } else if (individuos[this.id]) {
                // --- CASO B: Es un INDIVIDUO ---
                const individuo = individuos[this.id];
                humanDataLabel = `Individuo: ${individuo.usuarioId}`;
                
                // Transforma los datos del individuo al mismo formato estadístico
                // (su "promedio" es su puntaje, y sus límites son ese mismo puntaje)
                humanStats = individuo.rasgos.listaRasgos.map(rasgo => ({
                    nombre: rasgo.nombre,
                    media: rasgo.valor,
                    stdDev: 0,
                    stdErr: 0,
                    limInf_95: rasgo.valor,
                    limSup_95: rasgo.valor
                }));
            } else {
                throw new Error(`No se encontraron datos para el ID: "${this.id}"`);
            }
            
            // 4. (Opcional) Muestra las tablas en consola
            this.mostrarTablasConsola(humanDataLabel, humanStats, modelosLLM);
            // 5. Pasa los datos a la Vista para renderizar
            this.view.render(humanDataLabel, humanStats, modelosLLM);

        } catch (error) {
            console.error("Error al cargar datos de comparación:", error);
            this.view.mostrarError(error.message);
        }
    }

    mostrarTablasConsola(humanDataLabel, humanStats, modelosLLM) {
        // Tabla de Estadísticas Humanas (Grupo O Individuo)
        console.log(`--- ESTADÍSTICAS ${humanDataLabel.toUpperCase()} (IC 95%) ---`);
        console.table(humanStats.map(stat => ({
            Rasgo: stat.nombre,
            Promedio: stat.media.toFixed(2),
            Lim_Inf_95: stat.limInf_95.toFixed(2),
            Lim_Sup_95: stat.limSup_95.toFixed(2)
        })));

        // Tablas de Estadísticas (LLMs)
        console.log("--- ESTADÍSTICAS MODELOS LLM (IC 95%) ---");
        modelosLLM.forEach(modeloLLM => {
            console.log(`\nModelo: ${modeloLLM.nombre}`);
            console.table(modeloLLM.estadisticas.map(stat => ({
                Rasgo: stat.nombre,
                Promedio: stat.media.toFixed(2),
                Lim_Inf_95: stat.limInf_95.toFixed(2),
                Lim_Sup_95: stat.limSup_95.toFixed(2)
            })));
        });
    }
}