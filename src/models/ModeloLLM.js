import { Rasgos } from './Rasgos.js';

export class ModeloLLM {
    constructor(nombre, estadisticas = []) {
        this.nombre = nombre;
        // Esta propiedad reemplaza a 'this.rasgos'
        this.estadisticas = estadisticas; // Un array de objetos
    }

    // Verifica si el modelo tiene rasgos válidos (no vacío)
    validar() {
        return this.estadisticas.length > 0;
    }
    // Serializa el modelo a un formato JSON
    toJSON() {
        return {
            nombre: this.nombre, // Incluye el nombre del modelo
            rasgos: this.rasgos.toJSON() // Usa el método toJSON de Rasgos
        };
    }

    // Crea una instancia de ModeloLLM desde un objeto JSON
    static fromJSON(data) {
        // Reconstruye los rasgos usando el método fromJSON de Rasgos
        const rasgos = Rasgos.fromJSON(data.rasgos);
        return new ModeloLLM(data.nombre, rasgos);
    }
}