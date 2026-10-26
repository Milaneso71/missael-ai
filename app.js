// ===== Elementos del DOM =====
const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typing = document.getElementById("typing");
const status = document.getElementById("status");

// ===== Auto-ajustar altura del textarea =====
userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";
});

// ===== Enviar con Enter (Shift+Enter = nueva línea) =====
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ===== Botón enviar =====
sendBtn.addEventListener("click", sendMessage);

// ===== Función principal =====
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Desactivar input mientras se procesa
  setLoading(true);

  // Mostrar mensaje del usuario
  addMessage(text, "user");
  userInput.value = "";
  userInput.style.height = "auto";

  // Simular que está pensando (por ahora)
  showTyping(true);

  // Esperar un momento para que se vea el efecto
  await wait(700);

  // Respuesta temporal (todavía no hay IA real)
  const respuestaTemporal = getTemporaryReply(text);
  showTyping(false);
  addMessage(respuestaTemporal, "assistant");

  setLoading(false);
  userInput.focus();
}

// ===== Añadir mensaje a la interfaz =====
function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text; // textContent es más seguro que innerHTML

  div.appendChild(bubble);
  chat.appendChild(div);

  // Scroll automático al final
  chat.scrollTop = chat.scrollHeight;
}

// ===== Indicador de escritura =====
function showTyping(show) {
  typing.hidden = !show;
  if (show) {
    chat.scrollTop = chat.scrollHeight;
  }
}

// ===== Estado de carga =====
function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  userInput.disabled = isLoading;
  status.textContent = isLoading ? "Pensando..." : "Listo";
}

// ===== Respuestas temporales (solo para probar la interfaz) =====
function getTemporaryReply(userText) {
  const lower = userText.toLowerCase();

  if (lower.includes("hola") || lower.includes("hey") || lower.includes("buenas")) {
    return "¡Hey! 👋 Todavía estoy en modo construcción, pero la interfaz ya funciona. Pronto tendré personalidad y cerebro de verdad.";
  }

  if (lower.includes("quién eres") || lower.includes("quien eres") || lower.includes("qué eres")) {
    return "Soy Missael AI, tu asistente personal. Estoy siendo construido paso a paso desde un teléfono Android. Ahora mismo solo tengo la interfaz, pero ya viene lo bueno.";
  }

  if (lower.includes("odyssey") || lower.includes("rover") || lower.includes("arduino") || lower.includes("esp32")) {
    return "Veo que mencionas temas de robótica/electrónica. Cuando conectemos el modelo real, podré ayudarte de verdad con el proyecto ODYSSEY y tus prototipos.";
  }

  // Respuesta genérica
  return `Recibí tu mensaje: "${userText}"\n\nPor ahora solo estoy probando la interfaz. En las siguientes fases conectaremos un modelo de IA real y la búsqueda web.`;
}

// ===== Utilidad =====
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Focus inicial =====
userInput.focus();
