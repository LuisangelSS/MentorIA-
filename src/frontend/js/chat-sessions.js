// Gestión de historial de estudio (sesiones de chat)
(function () {
  const sessionsListEl = document.getElementById('chat-sessions-list');
  const newChatBtn = document.getElementById('new-chat-btn');
  const chatBox = document.getElementById('chat-box');
  const chatTitle = document.getElementById('chat-title');
  const chatLogo = document.getElementById('chat-logo');

  // Estado global compartido con script.js
  window.currentChatSessionId = window.currentChatSessionId || null;

  function renderMarkdownToHtml(markdownText) {
    if (!markdownText) return "";
    const rawHtml = window.marked ? window.marked.parse(markdownText) : markdownText;
    const sanitizedHtml = window.DOMPurify ? window.DOMPurify.sanitize(rawHtml) : rawHtml;
    return sanitizedHtml;
  }

  function renderMessages(messages) {
    if (!Array.isArray(messages)) return;
    // Limpiar
    if (chatBox) chatBox.innerHTML = '';
    // Ocultar título/logo al abrir una sesión
    if (chatTitle) chatTitle.style.display = 'none';
    if (chatLogo) chatLogo.style.display = 'none';

    messages.forEach(msg => {
      const el = document.createElement('div');
      if (msg.role === 'user') {
        el.className = 'markdown-content animate-fadeIn w-[800px] ml-10 text-end font-bold text-text  p-5 bg-background rounded-lg mb-8 px-4 sm:px-6';
        el.innerHTML = renderMarkdownToHtml(msg.content);
      } else {
        el.className = 'markdown-content animate-fadeIn w-[900px] mr-10 text-start text-text mb-8 px-4 p-5 rounded-lg sm:px-6';
        el.innerHTML = renderMarkdownToHtml(msg.content);
      }
      chatBox.appendChild(el);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function renderSessionsList(sessions) {
    if (!sessionsListEl) return;
    sessionsListEl.innerHTML = '';

    if (!Array.isArray(sessions) || sessions.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'p-2 text-text-muted';
      empty.textContent = 'Sin conversaciones aún';
      sessionsListEl.appendChild(empty);
      return;
    }

    sessions.forEach(sess => {
      const a = document.createElement('a');
      a.href = '#';
      const li = document.createElement('li');
      li.className = 'p-2 hover:bg-secondary truncate rounded-lg';
      li.textContent = sess.session_name || 'Nueva conversación';
      if (window.currentChatSessionId === sess.id) {
        li.className += ' bg-secondary';
      }
      a.addEventListener('click', async (e) => {
        e.preventDefault();
        await openSession(sess.id);
      });
      a.appendChild(li);
      sessionsListEl.appendChild(a);
    });
  }

  async function loadSessions() {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) return; // user.js se encarga de redirigir si no hay token
    try {
      const res = await fetch('/chats/sessions', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      renderSessionsList(data.sessions || []);
    } catch (e) {
      console.error('Error cargando sesiones:', e);
    }
  }

  async function openSession(sessionId) {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) return;
    try {
      const res = await fetch(`/chats/${sessionId}/messages`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      window.currentChatSessionId = data.session?.id || sessionId;
      renderMessages(data.messages || []);
      // Resaltar la sesión seleccionada
      await loadSessions();
    } catch (e) {
      console.error('Error abriendo sesión:', e);
    }
  }

  async function createNewSession() {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) return;
    try {
      const res = await fetch('/chats/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({})
      });
      if (!res.ok) return;
      const data = await res.json();
      const newId = data.session?.id;
      window.currentChatSessionId = newId || null;
      // Resetear la vista del chat para nueva sesión
      if (chatBox) chatBox.innerHTML = '';
      if (chatTitle) chatTitle.style.display = '';
      if (chatLogo) chatLogo.style.display = '';
      await loadSessions();
    } catch (e) {
      console.error('Error creando nueva sesión:', e);
    }
  }

  // Exponer refresco para que script.js lo use tras enviar mensaje
  window.refreshChatSessionsList = loadSessions;

  // Inicialización
  document.addEventListener('DOMContentLoaded', async () => {
    await loadSessions();
  });

  if (newChatBtn) {
    newChatBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await createNewSession();
    });
  }
})();
