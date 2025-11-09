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

      const mapaRasgos = {
        "Openness": "Apertura",
        "Conscientiousness": "Responsabilidad",
        "Extraversion": "Extroversión",
        "Agreeableness": "Amabilidad",
        "Neuroticism": "Neuroticismo",
        "Narcissism": "Narcicismo",
        "Psychopathy": "Psicopatía",
        "Machiavellianism": "Maquiavelismo"
      };


      const resultados = contenedor.querySelectorAll('.result');
      const nombresRasgos = Object.keys(rasgos);
      const valores = Object.values(rasgos);

      resultados.forEach(res => {
        const rasgoHTML = res.querySelector('.rasgos').textContent.trim();
        const claveJSON = Object.keys(mapaRasgos).find(k => mapaRasgos[k] === rasgoHTML);

        const valor = claveJSON ? rasgos[claveJSON] : 'N/A';
        res.querySelector('.puntaje').textContent = valor;
      });

      const nombreTraducido = nombresRasgos.map(key => mapaRasgos[key] || key);

      // Renderiza la gráfica
      const canvas = contenedor.querySelector('canvas');
      if (canvas) {
        this.crearGrafica(canvas, nombre, nombreTraducido, valores);
      }
    });
  }

  buscarPorNombre(nombre) {
    const nombreHTML = this.nombreToId?.[nombre] || nombre;
    const cards = document.querySelectorAll('.resultado-card');

    for (const card of cards) {
      // Busca el texto existente en .text-cont div en el HTML de RasgosLLM
      const tituloElemento = card.querySelector('.text-cont div')

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
      "Gemma 3.4B": { borde: '#11296E', fondo: 'rgba(17, 41, 110, 0.44)' },
      "Llama3.1": { borde: '#884FFD', fondo: 'rgba(203, 178, 254, 0.43)' },
      "Mistral7B": { borde: '#FFA64D', fondo: 'rgba(255, 166, 77, 0.39)' },
      "Deepseek": { borde: '#5403FA', fondo: 'rgba(101, 134, 231, 0.40)' },
      "Gemini": { borde: '#C60', fondo: 'rgba(255, 196, 138, 0.54)' }
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
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20, showLabelBackdrop: false },
            backgroundColor: '#F0F0F0',
            grid: { color: '#A6A6A6' },
            angleLines: { color: '#A6A6A6' },
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