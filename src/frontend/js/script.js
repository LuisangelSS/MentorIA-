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

async function ensureChatSession() {
  if (window.currentChatSessionId) return window.currentChatSessionId;
  const userToken = localStorage.getItem('userToken');
  try {
    const res = await fetch('/chats/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {})
      },
      body: JSON.stringify({})
    });
    if (!res.ok) return null;
    const data = await res.json();
    const newId = data.session?.id || null;
    window.currentChatSessionId = newId;
    if (window.refreshChatSessionsList) {
      try { await window.refreshChatSessionsList(); } catch {}
    }
    return newId;
  } catch {
    return null;
  }
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

    // Asegurar sesión activa antes de enviar si no hay ninguna
    if (!window.currentChatSessionId) {
      await ensureChatSession();
    }

    // Crear elemento para la respuesta del bot
    const botMsg = document.createElement("div");
    botMsg.className = "markdown-content animate-fadeIn w-[900px] mr-10 text-start text-text mb-8 px-4 p-5 rounded-lg sm:px-6";
    botMsg.innerHTML = '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    chatBox.appendChild(botMsg);

    // Mantener el scroll al final
    chatBox.scrollTop = chatBox.scrollHeight;

    // Iniciar streaming
    const response = await fetch("/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(userToken ? { "Authorization": `Bearer ${userToken}` } : {})
      },
      body: JSON.stringify({ 
        prompt, 
        chatSessionId: window.currentChatSessionId || undefined,
        stream: true 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';
    let isFirstChunk = true;

    // Remover indicador de escritura
    botMsg.innerHTML = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Mantener la línea incompleta en el buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'start') {
              // Actualizar información de sesión
              if (data.chatSessionId && !window.currentChatSessionId) {
                window.currentChatSessionId = data.chatSessionId;
              }
            } else if (data.type === 'chunk') {
              fullResponse += data.text;
              
              // Renderizar markdown incrementalmente
              const rawHtml = window.marked ? window.marked.parse(fullResponse) : fullResponse;
              const safeHtml = window.DOMPurify ? window.DOMPurify.sanitize(rawHtml) : rawHtml;
              
              // Guardar el contenido anterior para comparar
              const previousContent = botMsg.innerHTML;
              botMsg.innerHTML = safeHtml;
              
              // Aplicar animación suave solo a las nuevas palabras
              if (previousContent !== safeHtml) {
                // Agregar clase de animación suave
                botMsg.classList.add('typing-effect');
                
                // Remover la clase después de la animación
                setTimeout(() => {
                  botMsg.classList.remove('typing-effect');
                }, 300);
              }
              
              // Mantener el scroll al final
              chatBox.scrollTop = chatBox.scrollHeight;
            } else if (data.type === 'end') {
              // Respuesta completa recibida
              fullResponse = data.fullText;
              const rawHtml = window.marked ? window.marked.parse(fullResponse) : fullResponse;
              const safeHtml = window.DOMPurify ? window.DOMPurify.sanitize(rawHtml) : rawHtml;
              botMsg.innerHTML = safeHtml;
              
              // Intentar actualizar lista de sesiones si existe el manejador
              if (window.refreshChatSessionsList) {
                try { await window.refreshChatSessionsList(); } catch {}
              }
            } else if (data.type === 'error') {
              botMsg.innerHTML = `<div class="text-red-500">Error: ${data.error}</div>`;
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
          }
        }
      }
    }

  } catch (err) {
    console.error(err);
    const errorMsg = document.createElement("div");
    errorMsg.className = "markdown-content animate-fadeIn w-[900px] mr-10 text-start text-red-500 mb-8 px-4 p-5 rounded-lg sm:px-6";
    errorMsg.innerHTML = "Error al comunicarse con el servidor. Por favor, intenta de nuevo.";
    chatBox.appendChild(errorMsg);
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
