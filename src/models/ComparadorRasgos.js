// ============================================================================
// Modelo: ComparadorRasgos
// Descripción: Calcula similitudes entre rasgos de usuario/población y modelos LLM.
// Patrón aplicado: Factory Method (produce ComparacionResultado o ComparacionMasiva)
// ============================================================================

import ComparacionResultado from "./ComparacionResultado.js";
import ComparacionMasiva from "./ComparacionMasiva.js";

export default class ComparadorRasgos {
  /**
   * @param {Function|null} strategyFn - Función de similitud personalizada (opcional).
   */
  constructor(strategyFn = null) {
    this.strategyFn = strategyFn || this._defaultSimilarity;
  }

  // --------------------------------------------------------------------------
  // Estrategia por defecto: correlación de Pearson simplificada (normalizada)
  // --------------------------------------------------------------------------
  _defaultSimilarity(valoresA, valoresB) {
    if (valoresA.length !== valoresB.length || valoresA.length === 0) return 0;
    const n = valoresA.length;
    const meanA = valoresA.reduce((a, b) => a + b, 0) / n;
    const meanB = valoresB.reduce((a, b) => a + b, 0) / n;

    let num = 0,
      denA = 0,
      denB = 0;
    for (let i = 0; i < n; i++) {
      const diffA = valoresA[i] - meanA;
      const diffB = valoresB[i] - meanB;
      num += diffA * diffB;
      denA += diffA ** 2;
      denB += diffB ** 2;
    }

    const denom = Math.sqrt(denA * denB);
    return denom === 0 ? 0 : Math.max(0, num / denom);
  }

  // --------------------------------------------------------------------------
  // Comparación individual: usuario ↔ modelo
  // --------------------------------------------------------------------------
  comparar(rasgosUsuario, rasgosModelo) {
    const labels = Object.keys(rasgosUsuario);
    const valoresUsuario = labels.map((k) => rasgosUsuario[k]);
    const valoresModelo = labels.map((k) => rasgosModelo[k]);
    const similarity = this.strategyFn(valoresUsuario, valoresModelo);

    return new ComparacionResultado(labels, valoresUsuario, valoresModelo, similarity);
  }

  // --------------------------------------------------------------------------
  // Comparar un usuario con todos los modelos disponibles
  // --------------------------------------------------------------------------
  compararConTodos(rasgosUsuario, modelos) {
    return modelos.map((modelo) => {
      const resultado = this.comparar(rasgosUsuario, modelo.rasgos);
      resultado.modeloNombre = modelo.nombre;
      return resultado;
    });
  }

  // --------------------------------------------------------------------------
  // Comparación masiva: grupo ↔ modelo
  // --------------------------------------------------------------------------
  compararMasiva(rasgosPoblacion, modelo) {
    const distribucion = [];
    const resumen = {};
    const labels = Object.keys(modelo.rasgos);

    rasgosPoblacion.forEach((rasgosUsuario) => {
      const valoresUsuario = labels.map((k) => rasgosUsuario[k]);
      const valoresModelo = labels.map((k) => modelo.rasgos[k]);
      const sim = this.strategyFn(valoresUsuario, valoresModelo);
      distribucion.push(sim);
    });

    // Promedio de similitud por rasgo
    labels.forEach((r) => {
      const valsGrupo = rasgosPoblacion.map((p) => p[r]);
      const meanGrupo = valsGrupo.reduce((a, b) => a + b, 0) / valsGrupo.length;
      const diff = Math.abs(meanGrupo - modelo.rasgos[r]);
      resumen[r] = Number((1 - diff / 5).toFixed(3)); // normalización básica
    });

    return new ComparacionMasiva({
      modeloNombre: modelo.nombre,
      resumenSimilitud: resumen,
      distribucionSimilitud: distribucion,
      sampleSize: rasgosPoblacion.length,
      timestamp: new Date(),
    });
  }
}
