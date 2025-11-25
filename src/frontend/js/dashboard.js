document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const res = await fetch('/progress/summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return;

    // Actualizar métricas básicas con animaciones
    animateCounter('m-quizzes', data.quizzes_count ?? 0, 1000);
    animateCounter('m-attempts', data.attempts_count ?? 0, 1200);
    animateCounter('m-avg', data.avg_score ?? 0, 1400, '%');

    // Crear gráfico de distribución de dificultad
    createDifficultyChart(data);

    // Actualizar intentos recientes con gráficos
    const list = document.getElementById('recent-attempts');
    list.innerHTML = (data.recentAttempts || []).map(a => {
      const difficulty = a.quizzes?.difficulty?.toLowerCase() || 'intermedio';
      const difficultyBadge = getDifficultyBadge(difficulty);
      const quizTitle = a.quizzes?.topic || 'Quiz';
      
      console.log('Intento de quiz:', a); // Debug
      
      return `
        <div class="bg-secondary p-4 rounded-lg relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-1">
              <div class="text-text font-bold text-xl">${escapeHtml(quizTitle)}</div>
              ${difficultyBadge}
            </div>
            <div class="text-text/80 mb-2">Puntaje: ${a.score}/${a.total} (${Math.round((a.score/a.total)*100)}%)</div>
            <div class="w-full bg-background-light rounded-full h-2 mb-2">
              <div class="bg-gradient-to-r from-accent to-[#7b82d9] h-2 rounded-full transition-all duration-1000 ease-out" 
                   style="width: ${(a.score/a.total)*100}%"></div>
            </div>
            <div class="text-text/60 text-sm">${formatDate(a.completed_at)}</div>
          </div>
        </div>
      `;
    }).join('');
    
    // Si no hay intentos, mostrar mensaje
    if (!data.recentAttempts || data.recentAttempts.length === 0) {
      list.innerHTML = '<div class="col-span-full text-text/70 text-center py-8">Aún no has completado ningún quiz. ¡Comienza realizando tu primer quiz!</div>';
    }
  } catch (err) {
    console.error(err);
  }
});

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

// Función para generar etiquetas de dificultad con colores
function getDifficultyBadge(difficulty) {
  const difficultyMap = {
    'basico': { text: 'Básico', color: 'bg-green-500', textColor: 'text-white' },
    'básico': { text: 'Básico', color: 'bg-green-500', textColor: 'text-white' },
    'basic': { text: 'Básico', color: 'bg-green-500', textColor: 'text-white' },
    'intermedio': { text: 'Intermedio', color: 'bg-yellow-500', textColor: 'text-white' },
    'intermediate': { text: 'Intermedio', color: 'bg-yellow-500', textColor: 'text-white' },
    'avanzado': { text: 'Avanzado', color: 'bg-red-500', textColor: 'text-white' },
    'advanced': { text: 'Avanzado', color: 'bg-red-500', textColor: 'text-white' }
  };
  
  const config = difficultyMap[difficulty] || { text: 'Intermedio', color: 'bg-yellow-500', textColor: 'text-white' };
  
  return `
    <span class="px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor}">
      ${config.text}
    </span>
  `;
}


// Función para crear gráfico de distribución por dificultad
function createDifficultyChart(data) {
  const difficultyDistribution = data.difficultyDistribution || [];
  const totalQuizzes = data.quizzes_count || 0;
  
  if (totalQuizzes === 0) return;

  // Debug: mostrar los datos que recibimos
  console.log('Difficulty distribution from backend:', difficultyDistribution);
  console.log('Total quizzes:', totalQuizzes);

  // Crear mapa de dificultades desde los datos del backend
  const difficultyMap = {};
  difficultyDistribution.forEach(item => {
    if (item.difficulty) {
      const normalizedDiff = item.difficulty.toLowerCase().trim();
      difficultyMap[normalizedDiff] = item.count;
    }
  });

  // Mapear a las claves estándar
  const difficultyCount = {
    basico: difficultyMap.basico || difficultyMap.básico || 0,
    intermedio: difficultyMap.intermedio || 0,
    avanzado: difficultyMap.avanzado || 0
  };

  console.log('Final difficulty count:', difficultyCount);

  const difficulties = [
    { name: 'Básico', key: 'basico', color: 'stroke-green-500', bgColor: 'bg-green-500' },
    { name: 'Intermedio', key: 'intermedio', color: 'stroke-yellow-500', bgColor: 'bg-yellow-500' },
    { name: 'Avanzado', key: 'avanzado', color: 'stroke-red-500', bgColor: 'bg-red-500' }
  ];

  // Crear contenedor para el gráfico de dificultad
  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    const difficultyChart = document.createElement('div');
    difficultyChart.className = 'col-span-full bg-secondary p-6 rounded-lg mt-6';
    difficultyChart.innerHTML = `
      <h3 class="text-text font-bold text-xl mb-6 flex items-center gap-2">
        <i class="bx bx-bar-chart-alt-2 text-accent"></i>
        Distribución por Dificultad (Todos los Quizzes)
      </h3>
      <div class="grid grid-cols-3 gap-8">
        ${difficulties.map((diff, index) => {
          const count = difficultyCount[diff.key] || 0;
          const percentage = totalQuizzes > 0 ? Math.round((count / totalQuizzes) * 100) : 0;
          console.log(`${diff.name}: ${count}/${totalQuizzes} = ${percentage}%`);
          return `
            <div class="text-center">
              <div class="relative w-24 h-24 mx-auto mb-4">
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path class="stroke-background-light stroke-2 fill-none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path class="${diff.color} stroke-3 fill-none" 
                        stroke-dasharray="${percentage}, 100"
                        stroke-linecap="round"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831">
                  </path>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-text font-bold text-lg">${percentage}%</span>
                </div>
              </div>
              <div class="text-text font-bold text-lg mb-2">${diff.name}</div>
              <div class="text-text/60 text-sm mb-2">${count} quizzes</div>
              <div class="w-full bg-background-light rounded-full h-2">
                <div class="${diff.bgColor} h-2 rounded-full" 
                     style="width: ${percentage}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    metricsSection.appendChild(difficultyChart);
  }
}


// Función para animar contadores
function animateCounter(elementId, targetValue, duration = 1000, suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startValue = 0;
  const increment = targetValue / (duration / 16); // 60fps
  let currentValue = startValue;

  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    
    // Formatear el valor según el tipo
    let displayValue;
    if (suffix === '%') {
      displayValue = Math.round(currentValue);
    } else {
      displayValue = Math.round(currentValue);
    }
    
    element.textContent = displayValue + suffix;
  }, 16);

  // Agregar clase de animación
  element.classList.add('counter-animation');
}

