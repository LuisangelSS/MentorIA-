const form = document.querySelector("form");
const input = form.querySelector("input");
const button = form.querySelector("button");
const chatBox = document.getElementById("chat-box");
const chatTitle = document.getElementById("chat-title");
const chatLogo = document.getElementById("chat-logo");

// Estado global de la sesión de chat actual (gestionado también por chat-sessions.js)
window.currentChatSessionId = window.currentChatSessionId || null;

function renderMarkdownToHtml(markdownText) {
  if (!markdownText) return "";
  const rawHtml = window.marked ? window.marked.parse(markdownText) : markdownText;
  const sanitizedHtml = window.DOMPurify ? window.DOMPurify.sanitize(rawHtml) : rawHtml;
  return sanitizedHtml;
}

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;

  // Ocultar el título la primera vez que se envía un mensaje
  if (chatTitle) {
    chatTitle.style.display = "none";
    chatLogo.style.display = "none";
  }

  // Mostrar prompt en el chat (sanitizado)
  const userMsg = document.createElement("div");
  userMsg.className = "markdown-content animate-fadeIn w-[800px] ml-10 text-end font-bold text-text  p-5 bg-background rounded-lg mb-8 px-4 sm:px-6";
  userMsg.innerHTML = renderMarkdownToHtml(prompt);
  chatBox.appendChild(userMsg);

  input.value = "";

  try {
    const userToken = localStorage.getItem('userToken');

    const res = await fetch("/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(userToken ? { "Authorization": `Bearer ${userToken}` } : {})
      },
      body: JSON.stringify({ prompt, chatSessionId: window.currentChatSessionId || undefined })
    });

    const data = await res.json();

    const botMsg = document.createElement("div");
    botMsg.className = "markdown-content animate-fadeIn w-[900px] mr-10 text-start text-text mb-8 px-4 p-5 rounded-lg sm:px-6 ";
    // La API ya devuelve HTML (marked en el backend), pero re-sanitizamos por seguridad
    const safeBotHtml = window.DOMPurify ? window.DOMPurify.sanitize(data.reply) : data.reply;
    botMsg.innerHTML = safeBotHtml;
    chatBox.appendChild(botMsg);

    // Mantener el scroll al final
    chatBox.scrollTop = chatBox.scrollHeight;

    // Si el servidor devolvió chatSessionId (por ejemplo, al crear una nueva implícitamente), actualizar estado y refrescar sesiones
    if (data.chatSessionId && !window.currentChatSessionId) {
      window.currentChatSessionId = data.chatSessionId;
    }
    // Intentar actualizar lista de sesiones si existe el manejador
    if (window.refreshChatSessionsList) {
      try { await window.refreshChatSessionsList(); } catch {}
    }
  } catch (err) {
    console.error(err);
  }
});
