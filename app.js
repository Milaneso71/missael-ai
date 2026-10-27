
const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typing = document.getElementById("typing");
const status = document.getElementById("status");

userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height =
    Math.min(userInput.scrollHeight, 120) + "px";
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || sendBtn.disabled) return;

  addMessage(text, "user");
  userInput.value = "";
  userInput.style.height = "auto";
  setLoading(true);
  showTyping(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No pude obtener una respuesta.");
    }

    addMessage(
      data.reply || "No recibí una respuesta del modelo.",
      "assistant"
    );
  } catch (error) {
    addMessage(
      "No pude conectar con mi cerebro de IA. " +
      "Comprueba tu conexión e inténtalo de nuevo. " +
      "Si el problema continúa, revisaremos el servidor.",
      "assistant"
    );
    console.error("Error de MISSAEL AI:", error);
  } finally {
    showTyping(false);
    setLoading(false);
    userInput.focus();
  }
}

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  div.appendChild(bubble);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping(show) {
  typing.hidden = !show;

  if (show) {
    chat.scrollTop = chat.scrollHeight;
  }
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  userInput.disabled = isLoading;
  status.textContent = isLoading ? "Pensando..." : "Listo";
}

userInput.focus();
