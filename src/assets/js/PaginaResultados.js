// 1. Importa la clase base
import { PaginaTemplate } from "./PaginaTemplate.js";

// 2. Importa la Vista y el Controlador principal
import { ComparacionController } from "../../controllers/ComparacionController.js";
import { ResultadosView } from "../../views/ResultadosView.js";

// 3. Importa los Modelos/Stores (Singletons y Gestores)
import Resultados from "../../models/Resultados.js";
import { GestorModelosLLM } from "../../models/GestorModelosLLM.js";
// (Asumimos que ComparisonStore no se usa por ahora, según ComparacionController)

// 4. Importa TODO el sistema de REPORTES
import { ReporteController } from "../../controllers/ReporteController.js";
import { ReportStrategyFactory } from "../../models/ReportStrategyFactory.js";
import { ChartBuilder } from "../../models/ChartBuilder.js";
import { GraficoExporter } from "../../models/GraficoExporter.js";
import { IndividualReportStrategy } from "../../models/IndividualReportStrategy.js";
import { ComparativoLLMStrategy } from "../../models/ComparativoLLMStrategy.js";

// Constante de la ruta de datos
const rutaLLM = "src/data/llm_raw.json";

export class PaginaResultados extends PaginaTemplate {
    constructor(id) {
        super();
        this.cargarCSS("/src/assets/css/Dashboard.css");
        this.id = id;
        
        // --- Instanciación Centralizada ---

        // 1. Vista
        this.view = new ResultadosView();

        // 2. Stores y Gestores
        this.resultadosStore = Resultados.getInstance();
        this.gestorLLM = new GestorModelosLLM();

        // 3. Controlador de la Página Web
        this.controller = new ComparacionController(
            this.view, 
            this.id,
            this.gestorLLM,        // <- Inyecta el gestor
            this.resultadosStore   // <- Inyecta el store
        );

        // 4. Servicios de Reportes (como en tu diagrama)
        const chartBuilder = new ChartBuilder();
        const graficoExporter = new GraficoExporter();

        // 5. Factory de Reportes (e inyectamos dependencias)
        this.strategyFactory = new ReportStrategyFactory({ 
            chartBuilder, 
            graficoExporter 
        });

        // 6. Registramos las estrategias que la factory puede crear
        this.strategyFactory.register(
            'individual', 
            (deps) => new IndividualReportStrategy(deps)
        );
        this.strategyFactory.register(
            'comparativo', 
            (deps) => new ComparativoLLMStrategy(deps)
        );

        // 7. Controlador de Reportes
        this.reporteController = new ReporteController({
            view: this.view,
            resultados: this.resultadosStore,
            gestorModelos: this.gestorLLM,
            factory: this.strategyFactory
        });
    }

    /**
     * Pide a la Vista su HTML estático (el "esqueleto")
     */
    async mostrarContenido() {
        const response = await fetch("/src/pages/resultados.html");
        const html = await response.text();
        console.log("Contenido HTML cargado");
        return html;
    }

    /**
     * Llama al Controlador para que "encienda" la página
     */
   async despuesDeCargar() {
        try {
            // 1. Cargamos los datos de LLMs UNA SOLA VEZ
            console.log("PaginaResultados: Cargando modelos LLM...");
            await this.gestorLLM.cargarModelos(rutaLLM);
            console.log("PaginaResultados: Modelos LLM cargados.");

            // 2. Iniciamos el controlador de la vista
            // (Usará los modelos ya cargados)
            await this.controller.iniciar();
            
            // 3. Conectamos los botones de PDF
            this.conectarBotonesPDF();

        } catch (error) {
            console.error("Error fatal en despuesDeCargar:", error);
        }
    }
    /**
     * Conecta los eventos de clic a los botones de descarga.
     */
    conectarBotonesPDF() {
        const btnIndividual = document.getElementById("downloadUserPDF");
        const btnComparativo = document.getElementById("downloadComparativePDF");
        
        const feedbackHandler = async (button, tipo) => {
            const originalHtml = button.innerHTML;
            button.innerHTML = `Generando... <span class="spinner"></span>`; // (Asumiendo que tienes CSS para .spinner)
            button.disabled = true;
            
            try {
                // El ID es el mismo, el controlador y la estrategia saben qué hacer
                await this.reporteController.generarReporte(tipo, { usuarioId: this.id });
            } catch (error) {
                console.error(`Error generando reporte ${tipo}:`, error);
                // Aquí podrías mostrar un modal de error
            } finally {
                // Restauramos el botón
                button.innerHTML = originalHtml;
                button.disabled = false;
            }
        };

        if (btnIndividual) {
            btnIndividual.addEventListener("click", () => {
                feedbackHandler(btnIndividual, 'individual');
            });
        }
        
        if (btnComparativo) {
             btnComparativo.addEventListener("click", () => {
                feedbackHandler(btnComparativo, 'comparativo');
             });
        }
    }
}