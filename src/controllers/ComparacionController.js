import Resultados from "../models/Resultados.js"; // El Singleton
import { GestorModelosLLM } from "../models/GestorModelosLLM.js";
import ProcesadorComparacion  from "../models/ProcesadorComparacion.js";
import ResultadosComparacion from "../models/ResultadosComparacion.js";
const rutaLLM = "src/data/llm_raw.json";

const TRAIT_MAP = {
    "Apertura": "Openness",
    "Responsabilidad": "Conscientiousness",
    "Extraversión": "Extraversion",
    "Amabilidad": "Agreeableness",
    "Neuroticismo": "Neuroticism",
    "Maquiavelismo": "Machiavellianism",
    "Narcisismo": "Narcissism",
    "Psicopatía": "Psychopathy"
};

export class ComparacionController {

    /**
     * @param {ResultadosView} view La instancia de la vista
     */
    constructor(view,id) {
        this.view = view;
        this.id = id;
        this.r = Resultados.getInstance();
        this.gestorLLM = new GestorModelosLLM();
        this.procesadorComparacion = new ProcesadorComparacion();
    }

    /**
     * El "interruptor de encendido" de esta página
     */
    async iniciar() {
        try {

            console.log("Controlador cargado. Iniciando carga de datos...");
            this.view.conectarDOM();
            await this.gestorLLM.cargarModelos(rutaLLM);
            const modelosLLM = this.gestorLLM.modelos;

            // Obtiene los datos humanos del Singleton (esto es sync)
            const individuos = this.r.obtenerResultadosIndividuales();
            const grupos = this.r.obtenerResultadosPoblacion();

            if (individuos[this.id]) {
                // --- CASO INDIVIDUAL ---
                const individuo = individuos[this.id];
                console.log(`Renderizando dashboard para INDIVIDUO: ${this.id}`);

                // a) Calcula el ranking de similitud (Distancia Euclidiana)
                const comparacion = this.procesadorComparacion.compararIndividuo(individuo, modelosLLM);
                const modeloMasSimilar = comparacion.getModeloMasCercano();
                const nombreModeloMasSimilar = modeloMasSimilar ? modeloMasSimilar.nombreModelo : null;

                // b) Formatea los datos para las gráficas
                const plantillaRasgos = this.view.rasgos; // ["Apertura", "Responsabilidad", ...]
                
                const humanDataForView = plantillaRasgos.map(nombreRasgoESP => {
                    const rasgo = individuo.rasgos.listaRasgos.find(r => r.nombre === nombreRasgoESP);
                    return rasgo ? rasgo.valor : 0; 
                });

                const llmsDataForView = {};
                const llmImagesForView = { /* ... (tu lógica de imágenes) ... */ };
                
                modelosLLM.forEach(modelo => {
                    const llmScoresOrdenados = plantillaRasgos.map(nombreRasgoESP => {
                        const nombreRasgoLLM = TRAIT_MAP[nombreRasgoESP]; 
                        const stat = modelo.estadisticas.find(s => s.nombre === nombreRasgoLLM);
                        return stat ? stat.media : 0;
                    });
                    llmsDataForView[modelo.nombre] = llmScoresOrdenados;
                });
                
                // c) Llama al render INDIVIDUAL (el dashboard)
                this.view.render(
                    humanDataForView,
                    llmsDataForView,
                    llmImagesForView,
                    nombreModeloMasSimilar
                );

            } else if (grupos[this.id]) {
                // --- CASO GRUPO ---
                 const grupo = grupos[this.id];
                console.log(`Renderizando dashboard para GRUPO: ${this.id}`);

                // a) Calcula la distribución de porcentajes
                const comparacion = this.procesadorComparacion.compararGrupo(grupo, modelosLLM);
                
                // b) Llama al render GRUPAL
                this.view.renderGrupo(comparacion);
        } else {
                 throw new Error(`No se encontraron datos para el ID: "${this.id}"`);
        }

        } catch(error) {
            console.error("Error al iniciar el ComparacionController:", error);
            if (this.view.mostrarError) this.view.mostrarError(error.message);
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