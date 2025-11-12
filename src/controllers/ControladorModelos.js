// controllers/GestorModelosController.js
import { GestorModelosLLM } from '../models/GestorModelosLLM.js';


/**
 * Controlador para la gestión y presentación de los datos de Modelos LLM.
 */
export class ControladorModelos {
    /**
     * @param {GestorModelosLLM} gestor - Instancia de GestorModelosLLM.
     * @param {string} rutaJson - La ruta al archivo JSON de datos.
     */
    constructor(gestor, rutaJson = '../data/ResultadosModelos_unificado.json') {
        this.gestor = gestor;
        this.rutaJson = rutaJson;
    }

    /**
     * Inicializa el controlador cargando los modelos desde el JSON.
     * @returns {Promise<void>}
     */
    async inicializar() {
        console.log(`Cargando modelos desde: ${this.rutaJson}`);
        try {
            await this.gestor.cargarModelos(this.rutaJson);
            console.log('Modelos cargados exitosamente.');
        } catch (error) {
            console.error('Fallo en la inicialización del controlador:', error);
            // Re-lanza el error para que la vista pueda manejarlo
            throw new Error('No se pudieron cargar los datos de los modelos.');
        }
    }

    /**
     * Prepara los datos para ser renderizados por la vista.
     * Transforma la información de los modelos a un formato simple y plano.
     * @returns {Object} Un objeto con los modelos y sus estadísticas listos para la vista.
     */
    obtenerDatosParaVista() {
        if (this.gestor.modelos.length === 0) {
            return {};
        }

        const datosVista = {};
        
        // Itera sobre los modelos (ahora son objetos con nombre y estadisticas)
        this.gestor.modelos.forEach(modelo => {
            datosVista[modelo.nombre] = {};
            
            // Transforma el array de estadisticas a un objeto clave-valor
            if (Array.isArray(modelo.estadisticas)) {
                modelo.estadisticas.forEach(estadistica => {
                    datosVista[modelo.nombre][estadistica.nombre] = {
                        media: parseFloat(estadistica.media.toFixed(1)),
                        alto: estadistica.alto || 0,
                        bajo: estadistica.bajo || 0
                    };
                });
            }
        });

        return datosVista;
    }
    
    /**
     * Obtiene solo los nombres de los rasgos para usar como encabezados de tabla.
     * @returns {Array<string>} Nombres de los rasgos.
     */
    obtenerNombresRasgos() {
        if (this.gestor.modelos.length === 0) {
            return [];
        }
        // Obtiene los nombres de rasgos del primer modelo
        const primerModelo = this.gestor.modelos[0];
        if (Array.isArray(primerModelo.estadisticas)) {
            return primerModelo.estadisticas.map(e => e.nombre);
        }
        return [];
    }
}

