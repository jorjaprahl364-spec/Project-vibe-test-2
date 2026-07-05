// js/bridge.js
// Все вызовы Notibot Bridge — только отсюда.

let _state = { user: null, app: null, colors: null };
const _listeners = [];

/**
 * Инициализация Bridge. Вызывается один раз из app.js.
 * @param {Function} onReady — коллбэк { user, app, colors }
 */
export function initBridge(onReady) {
  if (!window.notibot) {
    console.error("Notibot Bridge SDK не найден на странице!");
    const mockState = {
      user: { id: 123, displayName: "Гость", balance: 500 },
      app: { colors: null }
    };
    if (onReady) {
      setTimeout(() => onReady(mockState), 500);
    }
    return;
  }

  let initialized = false;

  const handleReady = (user, app) => {
    if (initialized) return;
    initialized = true;
    _state = { user, app, colors: app?.colors };
    _applyTheme(_state.colors);

    if (onReady) {
      onReady(_state);
      onReady = null;
    }
    _listeners.forEach(fn => fn(_state));
  };

  window.notibot.onUpdate(function(user, app) {
    handleReady(user, app);
  });

  // Если Notibot не прислал событие за 1.5 секунды (открыто просто в браузере),
  // переключаемся на мок-данные для локального тестирования.
  setTimeout(() => {
    if (!initialized) {
      console.warn("Notibot Bridge не ответил. Включение локального демо-режима.");
      const mockUser = { id: 999, displayName: "Гость", balance: 350 };
      const mockApp = { colors: null };
      handleReady(mockUser, mockApp);
    }
  }, 1500);
}

/** Подписаться на обновления (баланс, тема) */
export function onStateUpdate(fn) { _listeners.push(fn); }

/** Текущее состояние */
export function getState() { return _state; }

// Навигация
export function goToProduct(id)   { id ? window.notibot.openProduct(id)  : window.notibot.openStorefront(); }
export function goToArticle(id)   { id ? window.notibot.openArticle(id)  : window.notibot.openStorefront(); }
export function goToStorefront()  { window.notibot.openStorefront(); }
export function goToUserCard()    { window.notibot.openUserCard(); }

// Тактильная отдача
export function hapticImpact(style = 'light') {
  if (window.notibot && typeof window.notibot.hapticImpact === 'function') {
    window.notibot.hapticImpact(style);
  }
}

export function hapticNotification(type = 'success') {
  if (window.notibot && typeof window.notibot.hapticNotification === 'function') {
    window.notibot.hapticNotification(type);
  }
}

export function hapticSelection() {
  if (window.notibot && typeof window.notibot.hapticSelection === 'function') {
    window.notibot.hapticSelection();
  }
}

/**
 * Отправить форму с поддержкой таймаута
 * @param {string} formId — ID формы из схемы
 * @param {Array} answers — массив ответов
 */
export async function submitForm(formId, answers) {
  if (window.notibot && typeof window.notibot.submitForm === 'function') {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new window.NotibotBridgeError({
          origin: 'client',
          code: 'ERR_RATE_LIMIT',
          message: 'Превышено время ожидания ответа от Notibot (10 сек)'
        }));
      }, 10000);

      window.notibot.submitForm(formId, answers)
        .then((res) => {
          clearTimeout(timeout);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timeout);
          reject(err);
        });
    });
  }
  console.log("Mock submitForm call (вне Notibot):", formId, answers);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
}

// Тема
function _applyTheme(colors) {
  if (!colors) return;
  const r = document.documentElement;
  r.style.setProperty('--color-bg',     colors.background);
  r.style.setProperty('--color-text',   colors.textPrimary);
  r.style.setProperty('--color-muted',  colors.textSecondary);
  r.style.setProperty('--color-accent', colors.primaryMain);
  document.body.style.backgroundColor = colors.background;
  document.body.style.color           = colors.textPrimary;
}
