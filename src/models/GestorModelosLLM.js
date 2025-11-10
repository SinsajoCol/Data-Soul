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
            // Realiza una solicitud HTTP para obtener el archivo JSON
            const response = await fetch(ruta);
            // Parsea los datos JSON
            const data = await response.json();
            // Convierte cada elemento del JSON en una instancia de ModeloLLM
            this.modelos = data.map(item => ModeloLLM.fromJSON(item));
        } catch (error) {
            console.error('Error al cargar modelos:', error);
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