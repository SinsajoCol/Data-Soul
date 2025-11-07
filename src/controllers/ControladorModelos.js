// controllers/GestorModelosController.js
import { GestorModelosLLM } from '../models/GestorModelosLLM.js';
//import { GestorModelosLLM } from './GestorModelosLLM.js';

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
     * * @returns {Array<Object>} Un array de objetos listos para la vista.
     */
    obtenerDatosParaVista() {
        if (this.gestor.modelos.length === 0) {
            return [];
        }

        const datosVista = [];
        
        // El primer modelo se usa para obtener la lista de rasgos (columnas)
        const primerModelo = this.gestor.modelos[0];
        const nombresRasgos = primerModelo.rasgos.listaRasgos.map(r => r.nombre);

        // Prepara los datos para cada modelo
        this.gestor.modelos.forEach(modelo => {
            const modeloData = {
                nombre: modelo.nombre, // Nombre del modelo
            };
            
            // Añade cada rasgo como una propiedad del objeto
            nombresRasgos.forEach(rasgoNombre => {
                const valor = modelo.rasgos.obtenerValor(rasgoNombre);
                modeloData[rasgoNombre] = valor !== null ? valor.toFixed(1) : 'N/A';
            });
            
            datosVista.push(modeloData);
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
        // Asumiendo que todos los modelos tienen el mismo conjunto de rasgos
        return this.gestor.modelos[0].rasgos.listaRasgos.map(r => r.nombre);
    }
}

