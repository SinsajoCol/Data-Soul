import { ModeloLLM } from './ModeloLLM.js';

export class GestorModelosLLM {
    constructor() {
        this.modelos = []; // Arreglo de instancias de ModeloLLM
        
        // --- Constantes ---
        this.PUNTAJE_ALTO = 4.2;
        this.PUNTAJE_BAJO = 1.8;
        this.Z_CRITICO_95 = 1.96; // Para el IC 95%
    }

    // Carga modelos desde una ruta (e.g., archivo JSON)
    // @param {string} ruta - URL o ruta del archivo JSON con datos de modelos
    // GestorModelosLLM.js → método cargarModelos

    async cargarModelos(ruta) {
        try {
            const response = await fetch(ruta);
            const dataConteos = await response.json(); // { "Gemma 3.4B": { "Extraversion": { "alto": 200, "bajo": 800 } } }

            const modelosCalculados = [];

            // Itera sobre cada modelo (ej. "Gemma 3.4B")
            for (const nombreModelo in dataConteos) {
                const rasgosData = dataConteos[nombreModelo];
                const estadisticasRasgos = []; // Array para guardar los stats de este modelo

                // Itera sobre cada rasgo (ej. "Extraversion")
                for (const nombreRasgo in rasgosData) {
                    const conteoAlto = rasgosData[nombreRasgo].alto || 0;
                    const conteoBajo = rasgosData[nombreRasgo].bajo || 0;
                    
                    const N = conteoAlto + conteoBajo; // Total de preguntas (ej. 1000)
                    if (N === 0) continue; // Saltar si no hay datos

                    // 1. Calcular el Promedio (Media)
                    const sumaTotal = (conteoAlto * this.PUNTAJE_ALTO) + (conteoBajo * this.PUNTAJE_BAJO);
                    const media = sumaTotal / N;

                    // 2. Calcular la Desviación Estándar (StdDev)
                    // Varianza para datos binarios puntuados (p * (1-p)) * (puntaje_alto - puntaje_bajo)^2
                    const p_alta = conteoAlto / N; // Proporción de 'altos'
                    const p_baja = conteoBajo / N; // Proporción de 'bajos'
                    const varianza = (p_alta * p_baja) * Math.pow(this.PUNTAJE_ALTO - this.PUNTAJE_BAJO, 2);
                    const stdDev = Math.sqrt(varianza);

                    // 3. Calcular Error Estándar (StdErr)
                    const raizDeN = Math.sqrt(N);
                    const stdErr = (raizDeN > 0) ? stdDev / raizDeN : 0;

                    // 4. Calcular Límites (IC 95%)
                    const margenDeError = this.Z_CRITICO_95 * stdErr;
                    const limInf_95 = media - margenDeError;
                    const limSup_95 = media + margenDeError;

                    // Guarda el resultado estadístico completo
                    estadisticasRasgos.push({
                        nombre: nombreRasgo,
                        media: media,
                        stdDev: stdDev,
                        stdErr: stdErr,
                        limInf_95: limInf_95,
                        limSup_95: limSup_95
                    });
                }
                
                // Crea la nueva instancia del modelo con sus estadísticas
                modelosCalculados.push(new ModeloLLM(nombreModelo, estadisticasRasgos));
            }
            
            this.modelos = modelosCalculados;

        } catch (error) {
            console.error('Error al cargar y procesar modelos LLM:', error);
            throw error;
        }
    }

    guardarModelo(modelo) {
        // Verifica si ya existe un modelo con el mismo nombre
        if (!this.modelos.some(m => m.nombre === modelo.nombre)) {
            // Agrega el modelo a la lista
            this.modelos.push(modelo);
        }
    }

    eliminarModelo(nombre) {
        // Filtra la lista para excluir el modelo con el nombre especificado
        this.modelos = this.modelos.filter(m => m.nombre !== nombre);
    }

    obtenerModelo(nombre) {
        // Devuelve el modelo encontrado o null
        return this.modelos.find(m => m.nombre === nombre) || null;
    }
    
    listarModelos() {
        // Mapea la lista de modelos a sus nombres
        return this.modelos.map(m => m.nombre);
    }

    // Serializa la lista de modelos a un formato JSON
    toJSON() {
        return this.modelos.map(modelo => modelo.toJSON());
    }

    // Crea una instancia de GestorModelosLLM desde un arreglo JSON
    // @param {Array} data - Arreglo de objetos JSON representando modelos
    // @returns {GestorModelosLLM} - Nueva instancia de GestorModelosLLM
    static fromJSON(data) {
        const gestor = new GestorModelosLLM();
        // Reconstruye cada modelo usando ModeloLLM.fromJSON
        gestor.modelos = data.map(item => ModeloLLM.fromJSON(item));
        // Devuelve la instancia poblada
        return gestor;
    }
}