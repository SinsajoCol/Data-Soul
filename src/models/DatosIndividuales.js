import { Rasgos } from './Rasgos.js';

export class DatosIndividuales {
    constructor(usuarioId, rasgos = new Rasgos()) {
        this.usuarioId = usuarioId; // String
        this.rasgos = rasgos;       // Rasgos
    }

    obtenerPuntaje(nombrerasgo) {
        return this.rasgos.obtenerValor(nombrerasgo);
    }

    toJSON() {
        return {
            usuarioId: this.usuarioId,
            rasgos: this.rasgos.toJSON()
        };
    }

    static fromJSON(data) {
        const rasgosInstancia = Rasgos.fromJSON(data.rasgos);
        return new DatosIndividuales(data.usuarioId, rasgosInstancia);
    }
}