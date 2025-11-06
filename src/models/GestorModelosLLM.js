import { ModeloLLM } from './ModeloLLM.js';

export class GestorModelosLLM {
    constructor() {
        this.modelos = []; // Arreglo para almacenar instancias de ModeloLLM
    }

    // Carga modelos desde una ruta (e.g., archivo JSON)
    // @param {string} ruta - URL o ruta del archivo JSON con datos de modelos
   // GestorModelosLLM.js → método cargarModelos (versión CORREGIDA)
async cargarModelos(ruta) {
    try {
        const response = await fetch(ruta);
        const data = await response.json(); // Data es el objeto { "Gemma 3.4B": {...}, ... }

        // Paso 1: Transforma el objeto JSON a un Array de objetos 
        // con el formato que espera ModeloLLM.fromJSON
        const modelosArray = Object.entries(data).map(([nombre, rasgosObj]) => {
            
            // Paso 2: Transforma el objeto de rasgos (rasgosObj) 
            // a un array de {nombre, valor} para que Rasgos.fromJSON funcione
            const rasgosArray = Object.entries(rasgosObj).map(([nombreRasgo, valor]) => ({
                nombre: nombreRasgo,
                valor: valor
            }));

            // Estructura final esperada por ModeloLLM.fromJSON(item)
            return {
                nombre: nombre,
                rasgos: rasgosArray 
            };
        });

        // Convierte cada elemento del nuevo array en una instancia de ModeloLLM
        this.modelos = modelosArray.map(item => ModeloLLM.fromJSON(item));
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