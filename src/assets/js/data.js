//Datos estaticos.

// paletas de colores para los graficos y usuario.
const USER_COLOR = '#16348C';
const LLM_PALETTE = ['#6586E7', '#884FFD', '#B18BFD', '#FFA64D', '#FF8000']; 

function hexToRgba(hex, alpha) { //funcion para convertir hex a rgba
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const rasgos = [
    "Apertura","Responsabilidad","Extraversión","Amabilidad","Neuroticismo","Machiavellismo","Narcisismo","Psicopatía"
];

const llms = {
  "ChatGPT": [65, 70, 50, 75, 35, 40, 50, 25],
  "Mistral": [70, 65, 55, 70, 40, 35, 45, 30],
  "LLama": [60, 75, 45, 80, 30, 45, 55, 20],
  "DeepSeek": [12, 24, 35, 100, 50, 20, 55, 55],
  "Gemini": [68, 72, 52, 78, 38, 42, 48, 28]
};

const rasgosData = {
    "Apertura": {
        descripcion: "La apertura a la experiencia (Openness) es el grado en que una persona es imaginativa, curiosa, creativa y abierta a nuevas ideas, experiencias y perspectivas no convencionales.",
        usuario: 75,
        llm: 65
    },
    "Responsabilidad": {
        descripcion: "La responsabilidad (Conscientiousness) se refiere a la autodisciplina, la planificación, la fiabilidad y la orientación a objetivos. Las personas responsables son organizadas y diligentes.",
        usuario: 60,
        llm: 70
    },
    // ... Añadir datos para todos los demás rasgos aquí ...
};

const usuario = [75, 60, 55, 80, 40, 30, 45, 20];

const llmColors = {
    "ChatGPT": { 
        hex: LLM_PALETTE[0], 
        fill: hexToRgba(LLM_PALETTE[0], 0.2), 
        border: hexToRgba(LLM_PALETTE[0], 1), 
        bar: hexToRgba(LLM_PALETTE[0], 0.8) 
    }, 
    "Mistral": { 
        hex: LLM_PALETTE[1], 
        fill: hexToRgba(LLM_PALETTE[1], 0.2), 
        border: hexToRgba(LLM_PALETTE[1], 1), 
        bar: hexToRgba(LLM_PALETTE[1], 0.8) 
    }, 
    "LLama": { 
        hex: LLM_PALETTE[2], 
        fill: hexToRgba(LLM_PALETTE[2], 0.2), 
        border: hexToRgba(LLM_PALETTE[2], 1), 
        bar: hexToRgba(LLM_PALETTE[2], 0.8) 
    }, 
    "DeepSeek": { 
        hex: LLM_PALETTE[3], 
        fill: hexToRgba(LLM_PALETTE[3], 0.2), 
        border: hexToRgba(LLM_PALETTE[3], 1), 
        bar: hexToRgba(LLM_PALETTE[3], 0.8) 
    },
    "Gemini": { 
        hex: LLM_PALETTE[4], 
        fill: hexToRgba(LLM_PALETTE[4], 0.2), 
        border: hexToRgba(LLM_PALETTE[4], 1), 
        bar: hexToRgba(LLM_PALETTE[4], 0.8) 
    }
};