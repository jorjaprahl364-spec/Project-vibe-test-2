// js/app.js
// Главная точка входа приложения.
// Здесь импортируются и собираются все компоненты.

import { initBridge } from './bridge.js';
import { renderDashboard } from './components/matrix-dashboard.js';
import { initParticleBg } from './components/particle-bg.js';
// import './components/matrix-calculator.js';
// import './components/matrix-form.js';


// Запуск через мост Notibot Bridge
initBridge(function(state) {
  initApp(state);
});

/**
 * Инициализация и рендер приложения после подключения моста.
 */
function initApp(state) {
  // Инициализация золотого падающего фона
  initParticleBg('bg-canvas');

  // Скрываем лоадер
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }

  const appEl = document.getElementById('app');
  appEl.innerHTML = `
    <main class="max-w-xl mx-auto px-4 pt-6 pb-6 safe-top safe-bottom fade-in" id="dashboard-wrapper">
    </main>
  `;

  const wrapper = document.getElementById('dashboard-wrapper');
  renderDashboard(wrapper);
}

