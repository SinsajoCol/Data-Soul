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
            // 'comparacion' es un OBJETO (como antes)
            for (const nombreModelo in comparacion) {
                console.log(`\nModelo: ${nombreModelo}`);
                const tabla = comparacion[nombreModelo].map(item => ({
                    Rasgo: item.rasgo,
                    Rango_Humano_95: `${item.rangoHumano_95[0].toFixed(2)} - ${item.rangoHumano_95[1].toFixed(2)}`,
                    Rango_LLM_95: `${item.rangoLLM_95[0].toFixed(2)} - ${item.rangoLLM_95[1].toFixed(2)}`,
                    Coincide: item.coincide ? "✅ Sí" : "❌ No"
                }));
                console.table(tabla);
            }
        }
    }
}