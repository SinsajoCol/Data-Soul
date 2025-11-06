import { DatosIndividuales } from './DatosIndividuales.js';
import { Rasgos } from './Rasgos.js';

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

  obtenerPromediosGrupales() {
      if (this.lista.length === 0) {
          return new Rasgos(); // Devuelve un objeto Rasgos vacío
      }

      // 1. Obtiene la lista de nombres de rasgos del primer individuo
      const primerIndividuo = this.lista[0];
      const nombresDeRasgos = primerIndividuo.rasgos.listaRasgos.map(r => r.nombre);

      // 2. Crea un nuevo objeto Rasgos para almacenar los promedios
      const promedios = new Rasgos();

      // 3. Itera sobre cada nombre de rasgo y calcula su promedio
      for (const nombre of nombresDeRasgos) {
          // 4. Llama a tu método existente para calcular el promedio
          const valorPromedio = this.obtenerPromedio(nombre);
          
          // 5. Agrega el promedio al objeto de resultados
          promedios.agregarRasgo(nombre, valorPromedio);
      }

      return promedios;
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