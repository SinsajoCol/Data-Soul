import { GestorModelosLLM } from '../models/GestorModelosLLM.js';
import { ControladorModelos } from '../controllers/ControladorModelos.js';

export class RasgosLLM {
  // Mapeo de nombres de modelos LLM a IDs HTML
  nombreToId = {
    "Gemma-3": "Gemma",
    "Llama-3.1": "Llama",
    "Mistral-7b": "Mistral",
    "DeepSeek-r1": "DeepSeek",
  };

  // Orden de rasgos esperado
  rasgosOrden = ['Apertura', 'Responsabilidad', 'Extraversión', 'Amabilidad', 'Neuroticismo', 'Maquiavelismo', 'Narcisismo', 'Psicopatía'];

  constructor() {
    this.gestor = new GestorModelosLLM();
    this.controlador = new ControladorModelos(this.gestor, '/src/data/llm_raw.json');
  }

  async inicializar() {
    try {
      await this.controlador.inicializar();
      const datos = this.controlador.obtenerDatosParaVista();
      console.log('✓ Datos llm_raw.json cargados:', datos);
      this.actualizarVista(datos);
    } catch (error) {
      console.error('✗ Error inicializando RasgosLLM:', error);
    }
  }

  actualizarVista(datos) {
    // Ahora datos es un objeto: { "Gemma-3": { "Apertura": {media, alto, bajo}, ... }, ... }
    const aliasRasgos = {
      'Extroversión': 'Extraversión', // HTML usa "Extroversión", JSON tiene "Extraversión"
      'Narcicismo': 'Narcisismo',     // HTML typo con 'c' -> JSON usa 's'
    };

    // Función para eliminar tildes y normalizar
    const strip = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    Object.entries(datos).forEach(([nombreModelo, rasgosData]) => {
      const contenedor = this.buscarPorNombre(nombreModelo);
      if (!contenedor) {
        console.warn(`⚠️ No se encontró contenedor para ${nombreModelo}`);
        return;
      }

      // Actualiza los valores numéricos en las tarjetas
      const resultados = contenedor.querySelectorAll('.result');

      resultados.forEach(res => {
        const rasgoHTML = res.querySelector('.rasgos').textContent.trim();

        // Determina la clave en el objeto rasgosData: alias directo, luego búsqueda por normalización
        let clave = aliasRasgos[rasgoHTML] || rasgoHTML;
        if (!rasgosData.hasOwnProperty(clave)) {
          const target = strip(rasgoHTML);
          const encontrado = Object.keys(rasgosData).find(k => strip(k) === target);
          if (encontrado) clave = encontrado;
        }

        const estadistica = rasgosData[clave];
        const valor = estadistica ? estadistica.media : 'N/A';

        const elemPuntaje = res.querySelector('.puntaje');
        if (elemPuntaje) elemPuntaje.textContent = valor;
      });

      // Renderiza la gráfica
      const canvas = contenedor.querySelector('canvas');
      if (canvas) {
        const labels = this.rasgosOrden;
        const valores = labels.map(rasgo => {
          const est = rasgosData[rasgo];
          return est ? est.media : 0;
        });
        this.crearGrafica(canvas, nombreModelo, labels, valores);
      }
    });
  }

  buscarPorNombre(nombre) {
    const cards = document.querySelectorAll('.resultado-card');

    // Genera variantes a buscar (nombre original, mapeo y versiones simplificadas)
    const candidatos = new Set();
    candidatos.add(nombre);
    const mapped = this.nombreToId?.[nombre];
    if (mapped) candidatos.add(mapped);

    const normalize = s => (s || '').toString().replace(/[^a-z0-9]/gi, '').toLowerCase();
    const candidatosNorm = Array.from(candidatos).map(normalize);

    for (const card of cards) {
      // Intenta varias fuentes dentro de la tarjeta: título visible, alt de la imagen, id del canvas
      const tituloElem = card.querySelector('.text-cont div');
      const img = card.querySelector('img');
      const canvas = card.querySelector('canvas');

      const fuentes = [];
      if (tituloElem) fuentes.push(tituloElem.textContent.trim());
      if (img && img.alt) fuentes.push(img.alt.trim());
      if (img && img.src) {
        // Extrae nombre de archivo
        try {
          const parts = img.src.split('/');
          fuentes.push(parts[parts.length - 1]);
        } catch (e) {}
      }
      if (canvas && canvas.id) fuentes.push(canvas.id);

      // Normaliza y compara
      const fuentesNorm = fuentes.map(normalize);
      const match = candidatosNorm.some(c => fuentesNorm.some(f => f === c || f.includes(c) || c.includes(f)));
      if (match) {
        console.log(`✓ Tarjeta encontrada para: ${nombre} (fuentes: ${fuentes.join('|')})`);
        return card;
      }
    }

    console.warn(`⚠️ No se encontró tarjeta visual para "${nombre}". Intentados: ${Array.from(candidatos).join(', ')}`);
    return null;
  }

  crearGrafica(canvas, nombreModelo, etiquetas, valores) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Destruir gráfica anterior si existe
    if (canvas.chart) {
      canvas.chart.destroy();
    }

    const colores = {
      "Gemma-3": { borde: '#11296E', fondo: 'rgba(17, 41, 110, 0.44)' },
      "Llama-3.1": { borde: '#884FFD', fondo: 'rgba(203, 178, 254, 0.43)' },
      "Mistral-7b": { borde: '#FFA64D', fondo: 'rgba(255, 166, 77, 0.39)' },
      "DeepSeek-r1": { borde: '#5403FA', fondo: 'rgba(101, 134, 231, 0.40)' }
    };

    const color = colores[nombreModelo] || { borde: '#884FFD', fondo: 'rgba(203, 178, 254, 0.43)' };

    // Crea radar chart
    canvas.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: nombreModelo,
            data: valores,
            borderColor: color.borde,
            backgroundColor: color.fondo,
            borderWidth: 2,
            pointBackgroundColor: '#F7F7F7',
            pointBorderColor: color.borde,
            pointHoverBackgroundColor: '#F7F7F7',
            pointHoverBorderColor: color.borde,
          },
        ],
      },
      options: {
        scales: {
          r: {
            padding: 0,
            beginAtZero: false,
            min: 1.5,
            max: 4,
            ticks: { stepSize: 0.5, showLabelBackdrop: false,
              font:{
                size: 13
              },
            },
            pointLabels:{
              font: {
                size: 13
              },
              color: '#333',
            },
            backgroundColor: '#F0F0F0',
            grid: { color: '#A6A6A6' },
            angleLines: { color: '#A6A6A6' },
          },
        },
        layout:{
          padding: 0,
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }
}

// Instanciación automática al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  const vista = new RasgosLLM();
  await vista.inicializar();
});