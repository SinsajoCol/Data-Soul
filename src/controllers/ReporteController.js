import { ReportContext } from '../models/ReportContext.js';
import ProcesadorComparacion from '../models/ProcesadorComparacion.js';
import { Rasgo } from '../models/Rasgo.js';
import { Rasgos } from '../models/Rasgos.js';

/**
 * Orquesta la generación de reportes PDF.
 * No renderiza la vista web, solo coordina la creación de PDFs.
 */
export class ReporteController {

    /**
     * @param {Object} deps - Dependencias
     * @param {ResultadosView} deps.view - La vista (para metadata, si es necesario)
     * @param {Resultados} deps.resultados - El singleton de resultados
     * @param {GestorModelosLLM} deps.gestorModelos - El gestor de modelos
     * @param {ReportStrategyFactory} deps.factory - La fábrica de estrategias
     */
    constructor({ view, resultados, gestorModelos, factory }) {
        this.view = view;
        this.resultados = resultados;
        this.gestorModelos = gestorModelos;
        this.factory = factory;
        this.procesador = new ProcesadorComparacion(); // Para lógica de negocio
    }

    /**
     * Método principal llamado por el clic del botón.
     * @param {string} tipo - 'individual' o 'comparativo'
     * @param {Object} opciones - Opciones extra (ej. { usuarioId: 'default_user' })
     */
    async generarReporte(tipo, opciones = {}) {
        console.log(`ReporteController: Iniciando generación de reporte: ${tipo}`);

        const strategy = this.factory.create(tipo);
        if (!strategy) {
            console.error(`Estrategia de reporte no encontrada: ${tipo}`);
            return;
        }

        try {
            // Obtenemos el MAPA completo de individuos (plural)
            const todosLosIndividuos = this.resultados.obtenerResultadosIndividuales();
            const todasLasPoblaciones = this.resultados.obtenerResultadosPoblacion();
            const modelos = this.gestorModelos.modelos;


            let individuoParaReporte = null;
            let grupoParaReporte = null;
            const id = opciones.usuarioId;

            if (tipo === 'individual') {
                // El usuario quiere un "Reporte Individual".

                if (todosLosIndividuos[id]) {
                    // Caso 1: Es un individuo real. Fácil.
                    console.log("Generando reporte para individuo real.");
                    individuoParaReporte = todosLosIndividuos[id];

                } else if (todasLasPoblaciones[id]) {
                    // Caso 2: Es un grupo, pero quieren el reporte "individual" (promedios).
                    console.log("Generando reporte 'Individual' para promedios de grupo.");
                    const grupo = todasLasPoblaciones[id];

                    // Creamos un 'Individuo' ficticio usando los promedios del grupo.
                    individuoParaReporte = this._crearIndividuoDesdePromedioGrupo(grupo);
                }

            } else if (tipo === 'comparativo') {
                // El usuario quiere un "Reporte Comparativo".
                // La estrategia se encargará de si es grupo o individuo.
                console.log("Generando reporte 'Comparativo'.");
                individuoParaReporte = todosLosIndividuos[id]; // (puede ser null)
                grupoParaReporte = todasLasPoblaciones[id];     // (puede ser null)
            }


            // (El controlador no sabe si es individuo o grupo, el contexto sí)

            // 2. Construir el contexto
            // Las estrategias extraerán lo que necesiten de aquí.
            const context = new ReportContext(
                individuoParaReporte,  // Puede ser null si es un grupo
                grupoParaReporte,      // Puede ser null si es un individuo
                modelos,    // Todos los modelos LLM
                {
                    usuarioId: id,
                    rasgosOrdenados: this.view.rasgos,
                    descripciones: this.view.descripciones
                },
                this.procesador // Pasamos el procesador para que las estrategias lo usen
            );

            // 3. Generar el PDF (Blob)
            // La estrategia es ahora responsable de todo:
            // construir gráficas, exportarlas y maquetar el PDF.
            const pdfBlob = await strategy.generarPDF(context);

            // 4. Disparar la descarga
            const filename = `Reporte_${tipo}_${opciones.usuarioId}.pdf`;
            this.triggerDownload(pdfBlob, filename);

        } catch (error) {
            console.error("Error generando el reporte PDF:", error);
            // (Considera un modal/alerta para el usuario)
        }
    }

    /**
     * Crea un objeto 'Individuo' temporal (ficticio) a partir de los
     * promedios de un objeto 'Grupo'.
     * @param {Grupo} grupo - El objeto Grupo del cual calcular promedios.
     * @returns {Object} Un objeto que simula la estructura de un Individuo.
     */
    _crearIndividuoDesdePromedioGrupo(grupo) {
        // 1. Obtenemos las estadísticas (ej. [{nombre: 'Apertura', media: 3.85}, ...])
        const statsGrupales = grupo.obtenerEstadisticasGrupales();

        // 2. Creamos una instancia de Rasgos
        const rasgosFicticios = new Rasgos();

        // 3. Llenamos la instancia de Rasgos usando su propio método
        statsGrupales.forEach(stat => {
            // Asegurarnos de que el valor sea numérico
            const valorMedia = (typeof stat.media === 'number' && !isNaN(stat.media)) ? stat.media : 1;

            // Aseguramos que esté en el rango [1, 5] que espera el constructor de Rasgo
            const valorValido = Math.max(1, Math.min(5, valorMedia));

            // Usamos el método 'agregarRasgo' que llama a 'new Rasgo' internamente
            rasgosFicticios.agregarRasgo(stat.nombre, valorValido);
        });

        // 4. Retornamos el objeto 'Individuo' ficticio
        // La 'IndividualReportStrategy' busca en 'datosUsuario.rasgos.listaRasgos'
        return {
            usuarioId: grupo.id, // o grupo.nombreGrupo
            rasgos: rasgosFicticios, // Asignamos la instancia de Rasgos
        };
    }

    /**
     * Crea un enlace temporal y hace clic para descargar el archivo.
     * @param {Blob} blob 
     * @param {string} filename 
     */
    triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}