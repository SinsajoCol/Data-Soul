import DatosIndividuales from './DatosIndividuales.js';

export default class DatosPoblacion {
  constructor(nombreGrupo) {
    this.nombreGrupo = nombreGrupo;
    this.lista = [];
  }

  agregar(individuo) {
    this.lista.push(individuo);
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
    grupo.lista = data.lista.map(indData => DatosIndividuales.fromJSON(indData));
    return grupo;
  }
}
