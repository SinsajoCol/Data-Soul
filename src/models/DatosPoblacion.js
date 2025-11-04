import { DatosIndividuales } from './DatosIndividuales.js';

export class DatosPoblacion {
  constructor(nombreGrupo) {
    this.nombreGrupo = nombreGrupo;      // String
    this.lista = [];                     // List<DatosIndividuales>
  }

  agregar(individuo) {
    this.lista.push(individuo); // individuo: DatosIndividuales
  }

  obtenerPromedio(rasgoNombre) {
    if (this.lista.length === 0) return 0;
    let suma = 0;
    for (const ind of this.lista) {
      suma += ind.obtenerPuntaje(rasgoNombre);
    }
    return suma / this.lista.length;
  }

  toJSON() {
    return {
      nombreGrupo: this.nombreGrupo,
      lista: this.lista.map(ind => ind.toJSON())
    };
  }

  static fromJSON(data) {
        
        const grupo = new DatosPoblacion(data.nombreGrupo);
        const listaRehidratada = data.lista.map(
            individualData => DatosIndividuales.fromJSON(individualData)
        );
        grupo.lista = listaRehidratada;
        return grupo;
    }
}