// js/components/matrix-form.js
// Финальный экран с выводом заблокированного Аркана и формой сбора лидов.
// Размер файла строго контролируется (до 150 строк).

import { ARCANA_DATA } from './matrix-calculator.js';
import { submitForm, hapticNotification, hapticImpact } from '../bridge.js';
import { initIcons } from '../utils.js';

export function renderForm(parentEl, energies, status) {
  let blockIndex = status.indexOf(false);
  let isFullyOpen = blockIndex === -1;
  
  let targetArc = isFullyOpen ? energies.main : [energies.entry, energies.main, energies.debt][blockIndex];
  let arcInfo = ARCANA_DATA[targetArc];
  let channelName = isFullyOpen ? "Потенциал роста" : ["Входного канала", "Главного канала силы", "Кармического долга"][blockIndex];
  let capacity = [15, 35, 65, 90][status.filter(Boolean).length];

  parentEl.innerHTML = `
    <div class="fade-in card bg-stone-900/95 border border-amber-500/20 p-5 flex flex-col gap-5 max-w-md mx-auto shadow-2xl backdrop-blur-md">
      <div class="text-center relative">
        ${isFullyOpen ? `
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            Диагностика чиста
          </div>
        ` : `
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 animate-pulse">
            <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Обнаружена блокировка
          </div>
        `}
        <h3 class="text-lg font-bold text-gold-gradient tracking-widest font-['Cinzel']">Итоговый анализ</h3>
        <p class="text-[11px] text-stone-400 mt-1">Аркан ${channelName}: <span class="text-amber-500 font-bold">${arcInfo.name} (${targetArc} аркан)</span></p>
      </div>

      <div class="bg-stone-950/70 p-4 rounded-2xl border border-amber-500/10 flex flex-col gap-2">
        <span class="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Проявление блока:</span>
        <p class="text-xs text-stone-300 leading-relaxed">${isFullyOpen ? 'Энергия протекает гармонично. Возможен рост через расширение мышления.' : arcInfo.block}</p>
        <div class="h-px bg-stone-850 my-1"></div>
        <span class="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Рекомендация по взлому:</span>
        <p class="text-xs text-stone-300 leading-relaxed">${arcInfo.advice}</p>
      </div>

      <form id="lead-form" class="flex flex-col gap-4">
        <h4 class="text-[9px] font-bold text-stone-400 tracking-widest uppercase">ПОЛУЧИТЬ ПОЛНУЮ ИНСТРУКЦИЮ ВЗЛОМА:</h4>
        
        <div class="flex flex-col gap-1.5">
          <label for="user-name" class="text-[10px] font-bold text-stone-400">ВАШЕ ИМЯ</label>
          <input type="text" id="user-name" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500 transition-colors" placeholder="Иван" required />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="user-contact" class="text-[10px] font-bold text-stone-400">TELEGRAM / ТЕЛЕФОН</label>
          <input type="text" id="user-contact" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500 transition-colors" placeholder="@username" required />
        </div>

        <div id="error-box" class="hidden text-rose-500 text-xs bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl"></div>

        <button type="submit" id="submit-btn" class="btn-primary py-3.5 bg-gold-gradient font-bold rounded-xl btn-press tracking-wider">
          СКАЧАТЬ ИНСТРУКЦИЮ (PDF)
        </button>
      </form>
    </div>
  `;
  initIcons();

  const form = parentEl.querySelector('#lead-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hapticImpact('light');

    const submitBtn = form.querySelector('#submit-btn');
    const errorBox = form.querySelector('#error-box');
    const nameVal = form.querySelector('#user-name').value.trim();
    const contactVal = form.querySelector('#user-contact').value.trim();

    errorBox.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'ОТПРАВКА ДАННЫХ...';

    const answers = [
      { title: 'Имя', answers: nameVal ? [nameVal] : [] },
      { title: 'Контакты', answers: contactVal ? [contactVal] : [] },
      { title: 'Блокирующий канал', answers: [channelName] },
      { title: 'Целевой аркан', answers: [`${targetArc} - ${arcInfo.name}`] },
      { title: 'Финансовая емкость', answers: [`${capacity}%`] }
    ];

    try {
      await submitForm('matrix_lead_magnet', answers);
      hapticNotification('success');
      
      parentEl.innerHTML = `
        <div class="fade-in card bg-stone-900/95 border border-amber-500/20 p-6 flex flex-col gap-5 text-center max-w-md mx-auto shadow-2xl backdrop-blur-md">
          <div class="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <i data-lucide="check-circle" class="w-8 h-8"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gold-gradient tracking-widest font-['Cinzel']">ВЗЛОМ ПРОИЗВЕДЕН!</h3>
            <p class="text-xs text-stone-400 mt-2">Инструкция по активации Аркана ${targetArc} отправлена в чатбот.</p>
          </div>
          <button id="restart-btn" class="btn-primary py-3 bg-stone-850 hover:bg-stone-800 text-stone-300 border border-amber-500/10 rounded-xl font-semibold btn-press tracking-wider">
            ПОВТОРИТЬ ТЕСТ
          </button>
        </div>
      `;
      initIcons();
      parentEl.querySelector('#restart-btn').addEventListener('click', () => {
        hapticImpact('light');
        location.reload();
      });

    } catch (err) {
      hapticNotification('error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'СКАЧАТЬ ИНСТРУКЦИЮ (PDF)';
      errorBox.classList.remove('hidden');
      errorBox.textContent = `Ошибка: ${err.message || 'Не удалось отправить форму'}`;
    }
  });
}
