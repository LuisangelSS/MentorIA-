// Gestión de historial de estudio (sesiones de chat)
(function () {
  const sessionsListEl = document.getElementById('chat-sessions-list');
  const newChatBtn = document.getElementById('new-chat-btn');
  const chatBox = document.getElementById('chat-box');
  const chatTitle = document.getElementById('chat-title');
  const chatLogo = document.getElementById('chat-logo');

  // Tooltip reutilizable
  let tooltipEl = null;
  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'pointer-events-none fixed z-50 px-2 py-1 rounded-md text-xs bg-background-light border border-gray-600 text-text shadow-lg opacity-0 transition-opacity duration-150';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }
  function showTooltip(text) {
    const el = ensureTooltip();
    el.textContent = text;
    el.style.opacity = '1';
  }
  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.style.opacity = '0';
  }
  function positionTooltip(evt) {
    if (!tooltipEl) return;
    const offset = 12;
    let x = evt.clientX + offset;
    let y = evt.clientY + offset;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = tooltipEl.getBoundingClientRect();
    if (x + rect.width + 8 > vw) x = vw - rect.width - 8;
    if (y + rect.height + 8 > vh) y = vh - rect.height - 8;
    tooltipEl.style.left = x + 'px';
    tooltipEl.style.top = y + 'px';
  }

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
      const li = document.createElement('li');
      li.className = 'p-2 hover:bg-secondary rounded-lg flex items-center justify-between group';
      
      // Contenedor principal del chat
      const chatContainer = document.createElement('div');
      chatContainer.className = 'flex items-center justify-between w-full';
      
      // Enlace para abrir el chat
      const a = document.createElement('a');
      a.href = '#';
      a.className = 'flex-1 truncate pr-2';
      a.textContent = sess.session_name || 'Nueva conversación';
      // Tooltip estilizado
      const fullName = (sess.session_name || 'Nueva conversación');
      a.addEventListener('mouseenter', (e) => { showTooltip(fullName); positionTooltip(e); });
      a.addEventListener('mousemove', (e) => positionTooltip(e));
      a.addEventListener('mouseleave', hideTooltip);
      
      if (window.currentChatSessionId === sess.id) {
        li.className += ' bg-secondary';
      }
      
      a.addEventListener('click', async (e) => {
        e.preventDefault();
        await openSession(sess.id);
      });
      
      // Botón de eliminar
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300';
      deleteBtn.innerHTML = '<i class="bx bx-trash text-sm"></i>';
      deleteBtn.title = 'Eliminar conversación';
      
      deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await deleteSession(sess.id);
      });
      
      chatContainer.appendChild(a);
      chatContainer.appendChild(deleteBtn);
      li.appendChild(chatContainer);
      sessionsListEl.appendChild(li);
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

  window.openSession = async function openSession(sessionId) {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) return;
    
    // Si no estamos en la página de app, redirigir allí
    if (!chatBox) {
      window.location.href = `/app?session=${sessionId}`;
      return;
    }
    
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

  async function deleteSession(sessionId) {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) return;
    
    // Confirmar eliminación
    if (!confirm('¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      const res = await fetch(`/chats/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert('Error al eliminar la conversación: ' + (error.error || 'Error desconocido'));
        return;
      }
      
      // Si la sesión eliminada era la actual, limpiar la vista
      if (window.currentChatSessionId === sessionId) {
        window.currentChatSessionId = null;
        if (chatBox) chatBox.innerHTML = '';
        if (chatTitle) chatTitle.style.display = '';
        if (chatLogo) chatLogo.style.display = '';
      }
      
      // Recargar la lista de sesiones
      await loadSessions();
      
      // Mostrar mensaje de éxito
      const data = await res.json();
      console.log('Conversación eliminada:', data.message);
      
    } catch (e) {
      console.error('Error eliminando sesión:', e);
      alert('Error al eliminar la conversación. Por favor, intenta de nuevo.');
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
