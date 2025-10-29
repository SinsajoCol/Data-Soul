// ============================================================================
// Modelo: ComparacionResultado
// Descripción: Representa la comparación individual entre un usuario y un modelo LLM.
// Patrón aplicado: Clase de datos simple.
// ============================================================================

export default class ComparacionResultado {
  /**
   * @param {string[]} labels - Nombres de los rasgos comparados.
   * @param {number[]} valoresUsuario - Valores del usuario por rasgo.
   * @param {number[]} valoresModelo - Valores del modelo por rasgo.
   * @param {number} similarityScore - Puntaje de similitud (0 a 1).
   */
  constructor(labels = [], valoresUsuario = [], valoresModelo = [], similarityScore = 0) {
    this.labels = labels;
    this.valoresUsuario = valoresUsuario;
    this.valoresModelo = valoresModelo;
    this.similarityScore = similarityScore;
  }

  /**
   * Retorna el objeto en formato JSON para persistencia o visualización.
   */
  toJSON() {
    return {
      labels: this.labels,
      valoresUsuario: this.valoresUsuario,
      valoresModelo: this.valoresModelo,
      similarityScore: this.similarityScore,
    };
  }
}
