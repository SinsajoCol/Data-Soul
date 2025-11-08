import { GestorModelosLLM } from '../models/GestorModelosLLM.js';
import { ControladorModelos } from '../controllers/ControladorModelos.js';

export class RasgosLLM {
  //Cambiar el nombre de Deepseek y Gemini cuando se agreguen los modelos faltantes
  nombreToId = {
    "Gemma 3.4B": "ChatGPT", //Corregir nombre, este es de prueba
    "Llama3.1": "Llama",
    "Mistral7B": "Mistral",
    "Deepseek": "Deepseek",
    "Gemini": "Gemini",
  };

  constructor() {
    this.gestor = new GestorModelosLLM();
    this.controlador = new ControladorModelos(this.gestor, '/src/data/ResultadosModelos_unificado.json');
  }

  async inicializar() {
    try {
      await this.controlador.inicializar();
      const datos = this.controlador.obtenerDatosParaVista();
      this.actualizarVista(datos);
    } catch (error) {
      console.error('Error inicializando RasgosLLM:', error);
    }
  }

  actualizarVista(datos) {
    datos.forEach(modelo => {
      const { nombre, ...rasgos } = modelo;
      const modeloLimpio = nombre.replace(/\s+/g, '').replace(/[^\w-]/g, ''); // ID limpio

      // Actualiza los valores numéricos visibles
      const contenedor = this.buscarPorNombre(nombre);
      if (!contenedor) {
        console.warn(`No se encontró contenedor para ${nombre}`);
        return;
      }

      const resultados = contenedor.querySelectorAll('.result');
      const nombresRasgos = Object.keys(rasgos);
      const valores = Object.values(rasgos);

      resultados.forEach((res, index) => {
        const valor = valores[index] ?? 'N/A';
        const textoRasgo = nombresRasgos[index] ?? 'Rasgo';
        res.querySelector('._77').textContent = valor;
        res.querySelector('.responsabilidad').textContent = textoRasgo;
      });

      // Renderiza la gráfica
      const canvas = contenedor.querySelector('canvas');
      if (canvas) {
        this.crearGrafica(canvas, nombre, nombresRasgos, valores);
      }
    });
  }

  buscarPorNombre(nombre) {
    const nombreHTML = this.nombreToId?.[nombre] || nombre;
    const cards = document.querySelectorAll('.resultado-card');

    for (const card of cards) {
      // Busca el texto existente en .span o en .text-cont en el HTML de RasgosLLM
      const tituloElemento =
        card.querySelector('.span') ||
        card.querySelector('.text-cont div') ||
        card.querySelector('.llm-info div');

      if (!tituloElemento) continue;

      const titulo = tituloElemento.textContent.trim();
      if (titulo && nombreHTML && titulo.toLowerCase() === nombreHTML.toLowerCase()) {
        return card;
      }
    }

    console.warn(`⚠️ No se encontró tarjeta visual para "${nombre}" (HTML esperado: "${nombreHTML}")`);
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
      "Gemma 3.4B": { borde: 'rgba(255, 99, 132, 1)', fondo: 'rgba(255, 99, 132, 0.2)' },
      "Llama3.1": { borde: 'rgba(54, 162, 235, 1)', fondo: 'rgba(54, 162, 235, 0.2)' },
      "Mistral7B": { borde: 'rgba(255, 206, 86, 1)', fondo: 'rgba(255, 206, 86, 0.2)' },
      "ChatGPT": { borde: 'rgba(75, 192, 192, 1)', fondo: 'rgba(75, 192, 192, 0.2)' },
      "Gemini": { borde: 'rgba(153, 102, 255, 1)', fondo: 'rgba(153, 102, 255, 0.2)' },
      "Deepseek": { borde: 'rgba(255, 159, 64, 1)', fondo: 'rgba(255, 159, 64, 0.2)' },
    };

    const color = colores[nombreModelo] || { borde: 'rgba(75, 192, 192, 1)', fondo: 'rgba(75, 192, 192, 0.2)' };

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
            pointBackgroundColor: color.borde,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: color.borde,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20, showLabelBackdrop: false },
            grid: { color: 'rgba(231, 48, 48, 0.2)' },
            angleLines: { color: 'rgba(181, 64, 64, 0.3)' },
          },
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