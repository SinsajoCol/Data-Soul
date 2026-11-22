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
        // Valor crítico t de Student (IC 95 %, gl = n - 1): con muestras
        // pequeñas no corresponde usar la aproximación normal (1.96).
        const tCritico = DatosPoblacion.valorCriticoT95(n - 1);
        const raizDeN = Math.sqrt(n);

        const primerIndividuo = this.lista[0];
        const nombresDeRasgos = primerIndividuo.rasgos.listaRasgos.map(r => r.nombre);
        const estadisticas = [];
        

        for (const nombre of nombresDeRasgos) {
            const media = this.obtenerPromedio(nombre);
            const stdDev = this.obtenerDesviacionEstandar(nombre);
            const stdErr = raizDeN > 0 ? stdDev / raizDeN : 0; 

            const margenDeError = tCritico * stdErr;
            
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

  /**
   * Cuantil 0.975 de la distribución t de Student para gl grados de libertad
   * (expansión de Cornish-Fisher; error < 1e-3 para gl >= 5).
   * @param {number} gl Grados de libertad (n - 1)
   * @returns {number} Ej.: gl = 30 -> 2.042
   */
  static valorCriticoT95(gl) {
    const z = 1.959963985;
    if (!(gl > 0)) return z;
    const z3 = z ** 3, z5 = z ** 5, z7 = z ** 7, z9 = z ** 9;
    const g1 = (z3 + z) / 4;
    const g2 = (5 * z5 + 16 * z3 + 3 * z) / 96;
    const g3 = (3 * z7 + 19 * z5 + 17 * z3 - 15 * z) / 384;
    const g4 = (79 * z9 + 776 * z7 + 1482 * z5 - 1920 * z3 - 945 * z) / 92160;
    return z + g1 / gl + g2 / gl ** 2 + g3 / gl ** 3 + g4 / gl ** 4;
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