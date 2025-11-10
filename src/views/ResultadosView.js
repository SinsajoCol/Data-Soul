export class ResultadosView {
  constructor() {
    this.conectarDOM();
    this.rasgos = [
      "Apertura", "Responsabilidad", "Extraversión", "Amabilidad",
      "Neuroticismo", "Maquiavelismo", "Narcisismo", "Psicopatía"
    ];

    this.descripciones = {
    "Apertura": "La apertura a la experiencia (Openness) es el grado en que una persona es imaginativa, curiosa, creativa y abierta a nuevas ideas, experiencias y perspectivas no convencionales.",
    "Responsabilidad": "La responsabilidad (Conscientiousness) se refiere a la autodisciplina, la planificación, la fiabilidad y la orientación a objetivos. Las personas responsables son organizadas y diligentes.",
    "Extraversión": "La extraversión (Extraversion) se caracteriza por la sociabilidad, la asertividad, la energía y la tendencia a buscar estimulación y compañía de otros.",
    "Amabilidad": "La amabilidad (Agreeableness) se relaciona con ser cooperativo, compasivo, empático y considerado. Las personas amables tienden a evitar conflictos.",
    "Neuroticismo": "El neuroticismo (Neuroticism) describe la tendencia a experimentar emociones negativas como ansiedad, tristeza, irritabilidad y a tener inestabilidad emocional",
    "Maquiavelismo": "El Maquiavelismo es un rasgo de personalidad que se enfoca en la manipulación y la explotación interpersonal, el cinismo y la falta de moralidad para lograr objetivos personales.",
    "Narcisismo": "El Narcisismo se caracteriza por la grandiosidad, el derecho a un trato especial, la necesidad de admiración y una baja empatía hacia los demás.",
    "Psicopatía": "La Psicopatía se define por la impulsividad, la búsqueda de emociones fuertes, la falta de remordimiento y una marcada incapacidad para sentir miedo o empatía."
    };

    // --- 2. INICIALIZA LOS DATOS COMO VACÍOS ---
    this.usuario = []; // (BORRA LOS DATOS DE PRUEBA)
    this.llms = {};    // (BORRA LOS DATOS DE PRUEBA)


    // Rutas de imágenes de cada LLM (ajústalas según tu estructura)
    this.llmImages = {
      "ChatGPT": "src/assets/img/images.png",
      "Mistral-7b": "src/assets/img/Logo_mistral.png",
      "Llama-3.1": "src/assets/img/Logo_llama.png",
      "DeepSeek": "src/assets/img/Logo_deepseek.png",
      "Gemma-3": "src/assets/img/Logo_gemini.png"
    };
  }

  conectarDOM() {
    this.llmCardsContainer = document.querySelector(".llm-cards");
    this.cardsContainer = document.querySelector(".summary-cards");
    this.tableBody = document.querySelector("#comparison tbody");
    this.mostSimilarEl = document.querySelector(".most-similar-llm");
    this.radarCanvas = document.getElementById("radarChart");
    this.barCanvas = document.getElementById("barChart");
    this.barCanvasBigFive = document.getElementById("barChartBigFive");
    this.barCanvasDark = document.getElementById("barChartDark");
  }

  render(usuarioData, llmsData, nombreModeloMasSimilar) {
    // 4. Guarda los datos reales en la instancia
    this.usuario = usuarioData;
    this.llms = llmsData;
    console.log("data llms cargada",llmsData)
    this.nombreModeloMasSimilar = nombreModeloMasSimilar;

    // 5. Llama a todos los métodos que antes estaban en init()
    this.generarLLMCards();
    this.generarCardsResumen();
    this.generarTabla("usuario"); 
    this.inicializarGraficos();
    this.configurarEventos();
  }

//  init() {
  //  this.conectarDOM();
  //  
  //  this.generarCardsResumen();
  //  Cuestionario: Si se quiere ver la tabla para el individuo: this.generarTabla("usuario")
  //  Archivo: Si se quiere ver la tabla para del grupo y los LLM: this.generarTabla("llm")
  //  this.generarTabla("llm"); 
  //  this.inicializarGraficos();
  //  this.configurarEventos();
  //}

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
        <img src="${this.llmImages[llm] || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}" alt="${llm} logo">
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

  //Aquí se define el tipo de tabla a mostrar
  generarTabla(tipo) {
    const tabla = document.getElementById("comparison");
    tabla.innerHTML = ""; // limpiar contenido previo

    if (tipo === "usuario") {
      // Tabla individual (la que ya tienes)
      this.generarTablaIndividual(tabla);
    } else if (tipo === "llm") {
      // Tabla por LLM y rasgos (lo que me pediste)
      this.generarTablaLLM(tabla);
    }
  }

  //Tabla para el usuario no técnico
  generarTablaIndividual() {
    const masSimilar = this.calcularLLMMasSimilar();
    const valores = this.llms[masSimilar];

    const tabla = document.getElementById("comparison");
    if(!tabla) return;
    tabla.innerHTML = ""; // limpiar contenido anterior

    // 🔹 Crear encabezados dinámicos
    const headers = ["Rasgo", "Usuario", masSimilar, "Diferencia"];
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    tabla.appendChild(thead);

    // 🔹 Crear cuerpo de tabla
    const tbody = document.createElement("tbody");

    this.rasgos.forEach((r, i) => {
      const fila = document.createElement("tr");
      const dif = (this.usuario[i] - valores[i]).toFixed(1);
      const signo = dif > 0 ? "+" : "";

      fila.innerHTML = `
        <td>${r}</td>
        <td>${this.usuario[i]}</td>
        <td>${valores[i]}</td>
        <td>${signo}${dif}</td>
      `;

      tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
  }

  //Tabla para el grupo y los LLM con los %
  generarTablaLLM(tabla) {
    if(!tabla) return;

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const emptyTh = document.createElement("th");
    emptyTh.textContent = "LLM";
    headRow.appendChild(emptyTh);
    
    this.rasgos.forEach(r => {
      const th = document.createElement("th");
      th.textContent = r;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    Object.entries(this.llms).forEach(([llmName, valores]) => {
      const fila = document.createElement("tr");
      const nombreTd = document.createElement("td");
      nombreTd.textContent = llmName;
      fila.appendChild(nombreTd);
      valores.forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        fila.appendChild(td);
      });
      tbody.appendChild(fila);
    });
    tabla.appendChild(tbody);
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

  // 🔹 Radar general (sigue igual)
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
    options: { 
      responsive: true,
      plugins: {
        legend:{
          display: true,
          onClick: null
        }
      } 
    }
  });

  // --- División de rasgos ---
  const bigFiveIndices = [0, 1, 2, 3, 4]; // primeros cinco
  const darkIndices = [5, 6, 7]; // últimos tres

  // --- Gráfica de barras Big Five ---
  this.barChartBigFive = new Chart(this.barCanvasBigFive, {
    type: 'bar',
    data: {
      labels: bigFiveIndices.map(i => this.rasgos[i]),
      datasets: [
        {
          label: 'Usuario',
          data: bigFiveIndices.map(i => this.usuario[i]),
          backgroundColor: hexToRgba(USER_COLOR, 0.8)
        },
        ...Object.keys(this.llms).map(llm => ({
          label: llm,
          data: bigFiveIndices.map(i => this.llms[llm][i]),
          backgroundColor: this.llmColors[llm].bar
        }))
      ]
    },
    options: { 
      responsive: true,
      plugins: {
        legend: {
          display: true,
          onClick: null
        }
      }
    }
  });

  // --- Gráfica de barras Dark Traits ---
  this.barChartDark = new Chart(this.barCanvasDark, {
    type: 'bar',
    data: {
      labels: darkIndices.map(i => this.rasgos[i]),
      datasets: [
        {
          label: 'Usuario',
          data: darkIndices.map(i => this.usuario[i]),
          backgroundColor: hexToRgba(USER_COLOR, 0.8)
        },
        ...Object.keys(this.llms).map(llm => ({
          label: llm,
          data: darkIndices.map(i => this.llms[llm][i]),
          backgroundColor: this.llmColors[llm].bar
        }))
      ]
    },
    options: { 
      responsive: true,
      plugins: {
        legend: {
          display: true,
          onClick: null
        }
      }
    }
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
    const bigFiveIndices = [0, 1, 2, 3, 4];
    const darkIndices = [5, 6, 7];

    // Radar
    this.radarChart.data.datasets = [
      {
        label: 'Usuario',
        data: this.usuario,
        backgroundColor: hexToRgba(USER_COLOR, 0.2),
        borderColor: USER_COLOR,
        borderWidth: 2
      },
      ...checkedLLMs.map(llm => ({
        label: llm,
        data: this.llms[llm],
        backgroundColor: this.llmColors[llm].fill,
        borderColor: this.llmColors[llm].border,
        borderWidth: 2
      }))
    ];

    // Big Five
    this.barChartBigFive.data.datasets = [
      {
        label: 'Usuario',
        data: bigFiveIndices.map(i => this.usuario[i]),
        backgroundColor: hexToRgba(USER_COLOR, 0.8)
      },
      ...checkedLLMs.map(llm => ({
        label: llm,
        data: bigFiveIndices.map(i => this.llms[llm][i]),
        backgroundColor: this.llmColors[llm].bar
      }))
    ];

    // Dark Traits
    this.barChartDark.data.datasets = [
      {
        label: 'Usuario',
        data: darkIndices.map(i => this.usuario[i]),
        backgroundColor: hexToRgba(USER_COLOR, 0.8)
      },
      ...checkedLLMs.map(llm => ({
        label: llm,
        data: darkIndices.map(i => this.llms[llm][i]),
        backgroundColor: this.llmColors[llm].bar
      }))
    ];

    this.radarChart.update();
    this.barChartBigFive.update();
    this.barChartDark.update();
  }

}
