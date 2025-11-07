export class ResultadosView {
  constructor() {
    this.rasgos = [
      "Apertura", "Responsabilidad", "Extraversión", "Amabilidad",
      "Neuroticismo", "Machiavellismo", "Narcisismo", "Psicopatía"
    ];

    this.descripciones = {
    "Apertura": "Describe la curiosidad, imaginación e interés por nuevas experiencias.",
    "Responsabilidad": "Refleja el nivel de organización, autodisciplina y cumplimiento de compromisos.",
    "Extraversión": "Mide la sociabilidad, entusiasmo y tendencia a buscar estímulos externos.",
    "Amabilidad": "Evalúa la empatía, cooperación y consideración hacia los demás.",
    "Neuroticismo": "Indica la estabilidad emocional y la propensión a experimentar emociones negativas.",
    "Machiavellismo": "Evalúa la manipulación, cinismo y enfoque estratégico en las relaciones.",
    "Narcisismo": "Mide el ego, la necesidad de admiración y la autoimportancia percibida.",
    "Psicopatía": "Se relaciona con la impulsividad, falta de empatía y tendencia al riesgo."
    };

    this.usuario = [75, 60, 55, 80, 40, 30, 45, 20];

    // Datos de prueba
    this.llms = {
      "ChatGPT": [65, 70, 50, 75, 35, 40, 50, 25],
      "Mistral": [70, 65, 55, 70, 40, 35, 45, 30],
      "LLama": [60, 75, 45, 80, 30, 45, 55, 20],
      "DeepSeek": [12, 24, 35, 100, 50, 20, 55, 55],
      "Gemini": [68, 72, 52, 78, 38, 42, 48, 28]
    };

    // Rutas de imágenes de cada LLM (ajústalas según tu estructura)
    this.llmImages = {
      "ChatGPT": "/src/assets/img/images.png",
      "Mistral": "/src/assets/img/Logo_mistral.png",
      "LLama": "/src/assets/img/Logo_llama.png",
      "DeepSeek": "/src/assets/img/Logo_deepseek.png",
      "Gemini": "/src/assets/img/Logo_gemini.png"
    };
  }

  conectarDOM() {
    this.llmCardsContainer = document.querySelector(".llm-cards");
    this.cardsContainer = document.querySelector(".summary-cards");
    this.tableBody = document.querySelector("#comparison tbody");
    this.mostSimilarEl = document.querySelector(".most-similar-llm");
    this.radarCanvas = document.getElementById("radarChart");
    this.barCanvas = document.getElementById("barChart");
  }

  init() {
    this.conectarDOM();
    this.generarLLMCards();
    this.generarCardsResumen();
    this.generarTabla();
    this.inicializarGraficos();
    this.configurarEventos();
  }

   calcularLLMMasSimilar() {
    let menorDistancia = Infinity;
    let masSimilar = null;

    for (const [nombre, valores] of Object.entries(this.llms)) {
      const distancia = Math.sqrt(
        valores.reduce((acc, val, i) => acc + Math.pow(val - this.usuario[i], 2), 0)
      );
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        masSimilar = nombre;
      }
    }
    return masSimilar;
  }

  generarLLMCards() {
    // Crear dinámicamente las cards según los llms disponibles
    this.llmCardsContainer.innerHTML = Object.keys(this.llms).map(llm => `
      <div class="llm-card">
        <img src="${this.llmImages[llm] || ''}" alt="${llm} logo" onerror="this.src='../assets/img/placeholder.png'">
        <div class="llm-info">
          <span>${llm}</span>
          <label class="checkbox-container">
            <input type="checkbox" value="${llm}" checked>
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    `).join('');
  }

  generarCardsResumen() {
     const masSimilar = this.calcularLLMMasSimilar();
    const valoresLLM = this.llms[masSimilar];

    // Actualiza el nombre en el encabezado
    if (this.mostSimilarEl) {
      this.mostSimilarEl.textContent = masSimilar;
    }

    // Crea las cards solo con ese LLM
    this.cardsContainer.innerHTML = this.rasgos.map((r, i) => `
      <div class="card" data-rasgo="${r}">
        <h3>${r}</h3>
        <p>Usuario: ${this.usuario[i]}</p>
        <p>${masSimilar}: ${valoresLLM[i]}</p>
      </div>
    `).join('');
  }

  generarTabla() {
    const masSimilar = this.calcularLLMMasSimilar();
    const valores = this.llms[masSimilar];

    this.tableBody.innerHTML = this.rasgos.map((r, i) => {
      const dif = (this.usuario[i] - valores[i]).toFixed(1);
      const signo = dif > 0 ? "+" : "";
      return `
        <tr>
          <td>${r}</td>
          <td>${this.usuario[i]}</td>
          <td>${valores[i]}</td>
          <td>${signo}${dif}</td>
        </tr>
      `;
    }).join('');
  }


  inicializarGraficos() {
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const USER_COLOR = '#16348C';
    const LLM_PALETTE = ['#6586E7', '#884FFD', '#B18BFD', '#FFA64D', '#FF8000'];

    this.llmColors = {};
    Object.keys(this.llms).forEach((name, index) => {
      const color = LLM_PALETTE[index % LLM_PALETTE.length];
      this.llmColors[name] = {
        fill: hexToRgba(color, 0.2),
        border: color,
        bar: hexToRgba(color, 0.8)
      };
    });

    this.radarChart = new Chart(this.radarCanvas, {
      type: 'radar',
      data: {
        labels: this.rasgos,
        datasets: [
          {
            label: 'Usuario',
            data: this.usuario,
            backgroundColor: hexToRgba(USER_COLOR, 0.2),
            borderColor: USER_COLOR,
            borderWidth: 2
          },
          ...Object.keys(this.llms).map(llm => ({
            label: llm,
            data: this.llms[llm],
            backgroundColor: this.llmColors[llm].fill,
            borderColor: this.llmColors[llm].border,
            borderWidth: 2
          }))
        ]
      },
      options: { responsive: true }
    });

    this.barChart = new Chart(this.barCanvas, {
      type: 'bar',
      data: {
        labels: this.rasgos,
        datasets: [
          {
            label: 'Usuario',
            data: this.usuario,
            backgroundColor: hexToRgba(USER_COLOR, 0.8)
          },
          ...Object.keys(this.llms).map(llm => ({
            label: llm,
            data: this.llms[llm],
            backgroundColor: this.llmColors[llm].bar
          }))
        ]
      },
      options: { responsive: true }
    });
  }

  configurarEventos() {
  // --- Eventos de selección de LLM ---
  const checkboxes = document.querySelectorAll(".llm-card input[type='checkbox']");
  checkboxes.forEach(chk => {
    chk.addEventListener("change", () => this.actualizarGraficos());
  });

  // --- Eventos para abrir el modal al hacer clic en una summary card ---
    const cards = document.querySelectorAll(".summary-cards .card");
    const modal = document.getElementById("rasgoModal");
    const closeBtn = modal.querySelector(".close-btn");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const rasgo = card.getAttribute("data-rasgo");
        const index = this.rasgos.indexOf(rasgo);
        const masSimilar = this.calcularLLMMasSimilar();
        const descripcion = this.descripciones[rasgo] || "Sin descripción disponible.";

        // Actualiza el modal
        document.getElementById("modalRasgoTitulo").textContent = rasgo;
        document.getElementById("modalUsuarioScore").textContent = this.usuario[index];
        document.getElementById("modalLLMScore").textContent = this.llms[masSimilar][index];
        document.getElementById("modalDescripcion").textContent = descripcion;

        modal.classList.add("show");
      });
    });

    // --- Cerrar el modal ---
    closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("show");
    });
  }



  actualizarGraficos() {
    const checkedLLMs = Array.from(document.querySelectorAll(".llm-card input:checked"))
      .map(input => input.value);

    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const USER_COLOR = '#16348C';

    this.radarChart.data.datasets = [
      {
        label: 'Usuario',
        data: this.usuario,
        backgroundColor: hexToRgba(USER_COLOR, 0.2),
        borderColor: USER_COLOR,
        borderWidth: 2
      }
    ];

    this.barChart.data.datasets = [
      {
        label: 'Usuario',
        data: this.usuario,
        backgroundColor: hexToRgba(USER_COLOR, 0.8)
      }
    ];

    checkedLLMs.forEach(llm => {
      const c = this.llmColors[llm];
      this.radarChart.data.datasets.push({
        label: llm,
        data: this.llms[llm],
        backgroundColor: c.fill,
        borderColor: c.border,
        borderWidth: 2
      });
      this.barChart.data.datasets.push({
        label: llm,
        data: this.llms[llm],
        backgroundColor: c.bar
      });
    });

    this.radarChart.update();
    this.barChart.update();
  }
}

// 🔹 Inicializa solo cuando se cargue el HTML
document.addEventListener("DOMContentLoaded", () => {
  const view = new ResultadosView();
  view.init();
});
