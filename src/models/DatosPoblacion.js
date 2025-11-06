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

    /**
     * Calcula la Desviación Estándar MUESTRAL para un rasgo específico.
     * @param {string} rasgoNombre El nombre del rasgo
     * @returns {number} La desviación estándar
     */

    obtenerDesviacionEstandar(rasgoNombre) {
        const n = this.lista.length;
        // La desviación estándar no se puede calcular con menos de 2 personas
        if (n < 2) return 0; 

        // 1. Calcula la media (promedio)
        const media = this.obtenerPromedio(rasgoNombre);

        // 2. Suma las diferencias al cuadrado
        let sumaDiferenciasCuadradas = 0;
        for (const ind of this.lista) {
            const puntaje = ind.obtenerPuntaje(rasgoNombre);
            if (puntaje !== null) {
                sumaDiferenciasCuadradas += Math.pow(puntaje - media, 2);
            }
        }
        
        // 3. Divide por n-1 (varianza muestral) y saca la raíz cuadrada
        const varianza = sumaDiferenciasCuadradas / (n - 1);
        return Math.sqrt(varianza);
    }

    // --- ¡Y AÑADE ESTE MÉTODO TAMBIÉN! ---
    /**
     * Obtiene una lista de TODAS las estadísticas (media y desv. estándar)
     * @returns {Array<Object>} Ej: [{nombre: 'Extraversión', media: 3.5, stdDev: 0.8}, ...]
     */
  obtenerEstadisticasGrupales() {
        const n = this.lista.length; // <-- Obtenemos 'n' (tamaño del grupo)
        if (n === 0) {
            return [];
        }
        const zCritico = 1.96; 
        const raizDeN = Math.sqrt(n);

        const primerIndividuo = this.lista[0];
        const nombresDeRasgos = primerIndividuo.rasgos.listaRasgos.map(r => r.nombre);
        const estadisticas = [];
        

        for (const nombre of nombresDeRasgos) {
            const media = this.obtenerPromedio(nombre);
            const stdDev = this.obtenerDesviacionEstandar(nombre);
            const stdErr = raizDeN > 0 ? stdDev / raizDeN : 0; 

            const margenDeError = zCritico * stdErr;
            
            const limInf = media - margenDeError;
            const limSup = media + margenDeError;

            // --- AÑADE 'stdErr' AL OBJETO ---
            estadisticas.push({ 
                nombre: nombre, 
                media: media, 
                stdDev: stdDev,
                stdErr: stdErr,
                limInf_95: limInf, 
                limSup_95: limSup
            });
        }

        return estadisticas;
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