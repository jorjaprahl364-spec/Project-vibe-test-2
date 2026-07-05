// js/components/matrix-dashboard.js
// Фокусируется на UI ввода даты и дашборде. Размер файла до 130 строк.

import { calculateMoneyMatrix, ARCANA_DATA } from './matrix-calculator.js';
import { renderForm } from './matrix-form.js';
import { hapticImpact, hapticSelection } from '../bridge.js';
import { initIcons } from '../utils.js';

let _parent = null;
let _data = { day: 1, month: 1, year: 1995 };
let _energies = null;
let _status = [false, false, false];

export function renderDashboard(parentEl) {
  _parent = parentEl;
  renderStep1();
}

function renderStep1() {
  _parent.innerHTML = `
    <div class="fade-in card bg-stone-900/95 border border-amber-500/20 p-6 flex flex-col gap-6 text-center max-w-md mx-auto shadow-2xl backdrop-blur-md">
      <div>
        <div class="w-16 h-16 mx-auto mb-4 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <i data-lucide="sparkles" class="w-7 h-7"></i>
        </div>
        <h2 class="text-lg font-bold text-gold-gradient tracking-widest font-['Cinzel']">ФОРМУЛА УСПЕХА</h2>
        <p class="text-[10px] text-stone-400 uppercase tracking-widest mt-1.5">Нумерологический анализ денежных блоков</p>
      </div>
      <div class="flex flex-col gap-3 text-left">
        <label for="birthdate" class="text-[10px] font-bold text-stone-400 tracking-wider">ВВЕДИТЕ ДАТУ РОЖДЕНИЯ</label>
        <input type="date" id="birthdate" class="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:outline-none focus:border-amber-500 transition-colors text-sm" value="1995-01-01" required />
      </div>
      <button id="calc-btn" class="btn-primary py-3.5 bg-gold-gradient font-bold rounded-xl btn-press tracking-wider">
        ЗАПУСТИТЬ ДИАГНОСТИКУ
      </button>
    </div>
  `;
  initIcons();
  _parent.querySelector('#calc-btn').addEventListener('click', () => {
    const val = _parent.querySelector('#birthdate').value;
    if (!val) return;
    const parts = val.split('-');
    _data = { day: parseInt(parts[2], 10), month: parseInt(parts[1], 10), year: parseInt(parts[0], 10) };
    _energies = calculateMoneyMatrix(_data.day, _data.month, _data.year);
    hapticImpact('medium');
    renderStep2();
  });
}

function renderStep2() {
  const getCapacity = () => [15, 35, 65, 90][_status.filter(Boolean).length];
  
  const drawGauge = (index, title, arcValue, label) => {
    const isPlus = _status[index];
    const strokeColor = isPlus ? 'stroke-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'stroke-stone-700';
    return `
      <div class="flex flex-col items-center gap-2 p-3 bg-stone-950/70 border border-amber-500/10 rounded-2xl relative overflow-hidden">
        <div class="relative w-20 h-20">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path class="stroke-stone-900" stroke-width="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="transition-all duration-500 ${strokeColor}" stroke-dasharray="${isPlus ? '100' : '15'}, 100" stroke-width="2.5" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span class="text-xl font-bold text-stone-100 font-['Cinzel']">${arcValue}</span>
            <span class="text-[7px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">аркан</span>
          </div>
        </div>
        <div class="text-center">
          <p class="text-[8px] text-stone-500 font-bold uppercase tracking-widest">${title}</p>
          <p class="text-xs font-bold text-stone-200 mt-0.5 truncate max-w-[110px]" title="${label}">${label}</p>
        </div>
      </div>
    `;
  };

  const updateDashboard = () => {
    const capacity = getCapacity();
    _parent.querySelector('#capacity-val').textContent = `${capacity}%`;
    _parent.querySelector('#capacity-bar').style.width = `${capacity}%`;
    
    const list = [
      { t: "Вход канала", a: _energies.entry },
      { t: "Главная сила", a: _energies.main },
      { t: "Кармический долг", a: _energies.debt }
    ];
    _parent.querySelector('#gauges-container').innerHTML = list.map((item, i) => drawGauge(i, item.t, item.a, ARCANA_DATA[item.a].name)).join('');
  };

  _parent.innerHTML = `
    <div class="fade-in card bg-stone-900/95 border border-amber-500/20 p-5 flex flex-col gap-5 max-w-md mx-auto shadow-2xl backdrop-blur-md">
      <div class="flex justify-between items-center border-b border-stone-800/80 pb-3">
        <span class="text-[9px] font-bold text-stone-400 tracking-widest uppercase">Диагностика матрицы</span>
        <span class="text-xs font-bold text-gold-gradient font-['Cinzel']">${String(_data.day).padStart(2,'0')}.${String(_data.month).padStart(2,'0')}.${_data.year}</span>
      </div>

      <div id="gauges-container" class="grid grid-cols-3 gap-2.5"></div>

      <div class="bg-stone-950/70 p-4 rounded-2xl border border-amber-500/10">
        <div class="flex justify-between text-[10px] font-bold text-stone-300 mb-2 tracking-wider">
          <span>ФИНАНСОВАЯ ЕМКОСТЬ</span>
          <span id="capacity-val" class="text-gold-gradient transition-all duration-300">15%</span>
        </div>
        <div class="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
          <div id="capacity-bar" class="bg-gold-gradient h-full w-[15%] transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <h4 class="text-[9px] font-bold text-stone-400 tracking-widest uppercase">ОТВЕТЬТЕ НА 3 ВОПРОСА О ВАШЕЙ ЖИЗНИ:</h4>
        ${[
          "Деньги приходят к вам легко и без титанических усилий?",
          "Доходы получается сберегать и масштабировать?",
          "Вы полностью свободны от кредитов, долгов и финансовых ям?"
        ].map((q, idx) => `
          <div class="flex items-center justify-between gap-4 p-3 bg-stone-950/40 border border-stone-850 rounded-xl">
            <span class="text-xs text-stone-300 leading-snug">${q}</span>
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" id="toggle-${idx}" class="sr-only peer" />
              <div class="w-9 h-5 bg-stone-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-500 after:border-stone-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600 peer-checked:after:bg-stone-100"></div>
            </label>
          </div>
        `).join('')}
      </div>

      <button id="finish-btn" class="btn-primary py-3.5 bg-gold-gradient font-bold rounded-xl btn-press tracking-wider">
        ПОЛУЧИТЬ АНАЛИЗ БЛОКОВ
      </button>
    </div>
  `;

  updateDashboard();

  _parent.querySelectorAll('input[type="checkbox"]').forEach((el, i) => {
    el.addEventListener('change', (e) => {
      _status[i] = e.target.checked;
      hapticSelection();
      updateDashboard();
    });
  });

  _parent.querySelector('#finish-btn').addEventListener('click', () => {
    hapticImpact('medium');
    renderForm(_parent, _energies, _status);
  });
}
