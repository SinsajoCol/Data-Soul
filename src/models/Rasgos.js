// Rasgos.js
import { Rasgo } from './Rasgo.js';

export class Rasgos {
    constructor() {
        this.listaRasgos = [];
    }

    agregarRasgo(nombre, valor) {
        this.listaRasgos.push(new Rasgo(nombre, valor));
    }

    obtenerValor(nombre) {
        const rasgo = this.listaRasgos.find(elem => elem.nombre === nombre);
        return rasgo ? rasgo.valor : null;
    }

    toJSON() {
        // Devuelve el arreglo de objetos Rasgo, que JSON.stringify() manejará bien
        return this.listaRasgos;
    }

    static fromJSON(listaRasgosArray) {
        const rasgosObj = new Rasgos();
        for (const elem of listaRasgosArray) {
            rasgosObj.agregarRasgo(elem.nombre, elem.valor);
        }
        return rasgosObj; // Añadido el return faltante
    }
}