// ============================================================================
// Modelo: ComparacionMasiva
// Descripción: Representa los resultados agregados de una comparación masiva
//               (población ↔ modelo LLM).
// Patrón aplicado: Clase de datos agregados.
// ============================================================================

export default class ComparacionMasiva {
  /**
   * @param {Object} params - Parámetros de inicialización.
   */
  constructor({
    batchId = crypto.randomUUID(),
    modeloNombre = "",
    resumenSimilitud = {},
    distribucionSimilitud = [],
    sampleSize = 0,
    timestamp = new Date(),
  } = {}) {
    this.batchId = batchId;
    this.modeloNombre = modeloNombre;
    this.resumenSimilitud = resumenSimilitud;
    this.distribucionSimilitud = distribucionSimilitud;
    this.sampleSize = sampleSize;
    this.timestamp = timestamp;
  }

  /**
   * Calcula estadísticas básicas sobre la distribución de similitudes.
   * @returns {{media: number, desv: number}}
   */
  calcularEstadisticas() {
    if (!this.distribucionSimilitud.length) return { media: 0, desv: 0 };

    const n = this.distribucionSimilitud.length;
    const media = this.distribucionSimilitud.reduce((a, b) => a + b, 0) / n;
    const varianza = this.distribucionSimilitud.reduce((a, b) => a + (b - media) ** 2, 0) / n;

    return { media, desv: Math.sqrt(varianza) };
  }

  /**
   * Devuelve el objeto en formato JSON para almacenamiento o exportación.
   */
  toJSON() {
    return {
      batchId: this.batchId,
      modeloNombre: this.modeloNombre,
      resumenSimilitud: this.resumenSimilitud,
      distribucionSimilitud: this.distribucionSimilitud,
      sampleSize: this.sampleSize,
      timestamp: this.timestamp,
    };
  }
}
