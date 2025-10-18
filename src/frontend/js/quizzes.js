document.addEventListener('DOMContentLoaded', () => {
  ensureAuth();
  setupForm();
  loadRecentQuizzes();
});

function getToken() {
  return localStorage.getItem('userToken');
}

function ensureAuth() {
  if (!getToken()) {
    window.location.href = '/login';
  }
}

function setupForm() {
  const form = document.getElementById('quiz-form');
  const topicInput = document.getElementById('topic-input');
  const difficultySelect = document.getElementById('difficulty-select');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const topic = topicInput.value.trim();
    const difficulty = difficultySelect.value;
    if (!topic) return;

    clearQuizArea();
    renderInfo("Generando quiz...", 'info');

    try {
      const res = await fetch('/quizzes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await res.json();
      if (!res.ok) {
        renderInfo(data.error || 'Error generando quiz', 'error');
        return;
      }
      renderQuiz(data.quizId, data.quiz);
    } catch (err) {
      console.error(err);
      renderInfo('Error de conexión al generar el quiz', 'error');
    }
  });
}

function clearQuizArea() {
  const area = document.getElementById('quiz-area');
  if (area) area.innerHTML = '';
}

function renderInfo(text, type = 'info') {
  const area = document.getElementById('quiz-area');
  if (!area) return;
  const colors = {
    info: 'bg-background-light',
    success: 'bg-success',
    error: 'bg-error'
  };
  area.innerHTML = `<div class="${colors[type] || colors.info} text-text p-4 rounded-lg font-bold">${text}</div>`;
}

function renderQuiz(quizId, quiz, showBack = false) {
  const area = document.getElementById('quiz-area');
  if (!area) {
    console.error('Elemento quiz-area no encontrado');
    return;
  }
  
  console.log('Renderizando quiz:', quizId, quiz);

  const header = `
    <div class="bg-secondary p-4 rounded-lg mb-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-text font-black text-2xl">${escapeHtml(quiz.topic)}</div>
          <div class="flex items-center gap-3 mt-2">
            <div class="text-text/80">10 preguntas</div>
            <span class="px-3 py-1 bg-accent text-background-light rounded-full text-sm font-bold">${escapeHtml((quiz.difficulty || 'Intermedio').toUpperCase())}</span>
          </div>
        </div>
${showBack ? '<button id=\"back-to-quizzes\" class=\"p-2 rounded-lg bg-background-light text-text font-bold\">Ocultar Quizz</button>' : ''}
      </div>
    </div>
  `;

  const questionsHtml = quiz.questions.map((q, idx) => {
    const options = q.options.map((opt, i) => `
      <label class="flex items-center gap-2 bg-background-light p-3 rounded-lg cursor-pointer">
        <input type="radio" name="q${idx}" value="${i}" class="accent-secondary" />
        <span class="text-text">${escapeHtml(opt)}</span>
      </label>
    `).join('');
    return `
      <div class="bg-secondary p-4 rounded-lg mb-4">
        <div class="text-text font-bold mb-3">${idx + 1}. ${escapeHtml(q.question)}</div>
        <div class="grid gap-2">
          ${options}
        </div>
      </div>
    `;
  }).join('');

  const submit = `
    <button id="submit-quiz" class="mt-2 p-3 rounded-lg bg-secondary text-text font-bold">Enviar respuestas</button>
    <div id="quiz-result" class="mt-3"></div>
  `;

  area.innerHTML = header + questionsHtml + submit;
  console.log('Quiz renderizado en el área:', area.innerHTML.length, 'caracteres');

  document.getElementById('submit-quiz')?.addEventListener('click', async () => {
    const answers = [];
    const totalQuestions = quiz?.questions?.length ?? 10;
    for (let i = 0; i < totalQuestions; i++) {
      const selected = document.querySelector(`input[name=\"q${i}\"]:checked`);
      answers.push(selected ? Number(selected.value) : -1);
    }

    try {
      const res = await fetch(`/quizzes/${quizId}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      const resultBox = document.getElementById('quiz-result');
      if (!res.ok) {
        resultBox.innerHTML = `<div class=\"bg-error text-text p-3 rounded-lg font-bold\">${escapeHtml(data.error || 'Error al enviar intento')}</div>`;
        return;
      }

      // Render puntaje
      const scoreInfo = `<div class=\"bg-success text-text p-3 rounded-lg font-bold\">Puntaje: ${data.score}/${data.total} (${data.percentage}%)</div>`;

      // Intentar obtener respuestas correctas desde la respuesta del servidor
      let correctIndexes = null;
      if (Array.isArray(data.correctAnswers)) {
        // Puede venir como índices o como texto; solo aceptamos índices aquí
        correctIndexes = data.correctAnswers.map((v) => (typeof v === 'number' ? v : -1));
      } else if (Array.isArray(data.results)) {
        // Estructura posible: [{ correct: true/false, correctIndex: n }]
        correctIndexes = data.results.map((r) => (typeof r?.correctIndex === 'number' ? r.correctIndex : -1));
      }

      // Si el servidor no envía detalles, intentar deducir desde el quiz en el cliente
      const incorrectDetails = buildIncorrectDetails(quiz, answers, correctIndexes);

      if (incorrectDetails.length === 0) {
        resultBox.innerHTML = `${scoreInfo}\n<div class=\"mt-3 bg-background-light text-text p-3 rounded-lg\">¡Perfecto! No fallaste ninguna pregunta.</div>`;
      } else {
        const listHtml = incorrectDetails.map((item, idx) => {
          const qNum = item.index + 1;
          const question = escapeHtml(item.question || 'Pregunta');
          const correct = escapeHtml(item.correctAnswerText || '');
          return `
            <div class=\"bg-background-light p-3 rounded-lg\">
              <div class=\"font-bold text-text\">${qNum}. ${question}</div>
              <div class=\"text-text/80\">Respuesta correcta: <span class=\"font-bold\">${correct}</span></div>
            </div>
          `;
        }).join('');

        resultBox.innerHTML = `${scoreInfo}\n<div class=\"mt-3 grid gap-2\">${listHtml}</div>`;
      }

      // refrescar recientes
      loadRecentQuizzes();
    } catch (err) {
      console.error(err);
    }
  });

  // Manejador del botón Volver (si existe)
  const backBtn = document.getElementById('back-to-quizzes');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      clearQuizArea();
      // Enfocar el formulario para generar otro
      const topicInput = document.getElementById('topic-input');
      if (topicInput) topicInput.focus();
      // Desplazar al inicio para ver el formulario
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

async function loadRecentQuizzes() {
  const grid = document.getElementById('recent-quizzes-grid');
  if (!grid) return;
  grid.innerHTML = '';
  try {
    const res = await fetch('/quizzes/recent', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) return;

    if (!data.items || data.items.length === 0) {
      grid.innerHTML = '<div class="text-text/70">Aún no tienes quizzes recientes.</div>';
      return;
    }

    grid.innerHTML = data.items.map(item => `
      <div class="bg-secondary p-4 rounded-lg cursor-pointer hover:opacity-90" data-id="${item.id}">
        <h3 class="font-black text-text text-2xl md:text-3xl xl:text-4xl mb-4">${escapeHtml(item.topic)}</h3>
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="bg-background-light p-2 rounded-lg font-bold text-text text-center flex-1">10 PREGUNTAS</div>
          <span class="px-3 py-1 bg-accent text-background-light rounded-full text-sm font-bold">${escapeHtml((item.difficulty || 'Intermedio').toUpperCase())}</span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-id]')?.forEach(card => {
      card.addEventListener('click', async (e) => {
        const id = card.getAttribute('data-id');
        try {
          const res = await fetch(`/quizzes/${id}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
          });
          const quiz = await res.json();
          if (!res.ok) return;
          renderQuiz(quiz.id, quiz, true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) { console.error(err); }
      });
    });
  } catch (err) {
    console.error(err);
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Intenta construir el detalle de preguntas incorrectas usando
// (a) índices correctos provistos por el servidor o
// (b) los datos del quiz en el cliente si incluyen la respuesta correcta.
function buildIncorrectDetails(quiz, userAnswers, correctIndexesFromServer) {
  const details = [];
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  const n = Math.min(questions.length, userAnswers.length);

  for (let i = 0; i < n; i++) {
    const q = questions[i] || {};
    const options = Array.isArray(q.options) ? q.options : [];
    const userIdx = typeof userAnswers[i] === 'number' ? userAnswers[i] : -1;

    let correctIdx = null;
    if (Array.isArray(correctIndexesFromServer) && typeof correctIndexesFromServer[i] === 'number') {
      correctIdx = correctIndexesFromServer[i];
    } else {
      correctIdx = getCorrectIndexFromQuestion(q);
    }

    if (typeof correctIdx === 'number' && correctIdx >= 0 && correctIdx < options.length) {
      if (userIdx !== correctIdx) {
        details.push({
          index: i,
          question: q.question,
          correctIndex: correctIdx,
          correctAnswerText: options[correctIdx]
        });
      }
    }
  }

  return details;
}

// Heurística para obtener el índice correcto desde la estructura de la pregunta
function getCorrectIndexFromQuestion(q) {
  if (!q) return null;
  // casos comunes por índice numérico
  if (typeof q.correctIndex === 'number') return q.correctIndex;
  if (typeof q.answerIndex === 'number') return q.answerIndex;
  if (typeof q.correct_option_index === 'number') return q.correct_option_index;

  // casos por texto correcto
  const options = Array.isArray(q.options) ? q.options : [];
  const candidates = [q.correct, q.correctAnswer, q.correct_option, q.answer];
  for (const cand of candidates) {
    if (typeof cand === 'string') {
      const idx = options.findIndex(opt => normalizeStr(opt) === normalizeStr(cand));
      if (idx !== -1) return idx;
    }
  }
  return null;
}

function normalizeStr(s) {
  if (typeof s !== 'string') return '';
  return s.trim().toLowerCase();
}
