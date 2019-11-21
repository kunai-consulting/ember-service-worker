export const PROJECT_REVISION = '{{PROJECT_REVISION}}';

let SUCCESS_HANDLERS = [];
let ERROR_HANDLERS = [];

let isMobile = isMobileDevice(navigator);
if ('serviceWorker' in navigator ) {
  if (!isMobile) {
    registerServiceWorker();
  } else if (isMobile && '{{SHOULD_REGISTER_ON_MOBILE}}'.toLowerCase() === 'true') {
    registerServiceWorker();
  }
}

function registerServiceWorker() {
  navigator.serviceWorker.register('{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}', { scope: '{{ROOT_URL}}' })
    .then(function(reg) {
      return resolveHandlers(SUCCESS_HANDLERS, reg)
        .then(function() {
          console.log('Service Worker registration succeeded. Scope is ' + reg.scope);
        });
    })
    .catch(runErrorHandlers);
}

function runErrorHandlers(error) {
  return resolveHandlers(ERROR_HANDLERS, error)
    .then(function() {
      console.log('Service Worker registration failed with ' + error);
    });
}

function isMobileDevice(navigator) {
  let isMobile = false;
  if ('maxTouchPoints' in navigator) {
    isMobile = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    isMobile = navigator.msMaxTouchPoints > 0;
  } else {
    let mQ = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
      isMobile = !!mQ.matches;
    } else if ('orientation' in window) {
      isMobile = true;
    } else {
      let UA = navigator.userAgent;
      isMobile = (
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
      );
    }
  }
  return isMobile;
}

function resolveHandlers(handlers, parameter) {
  let current = Promise.resolve();
  for (let i = 0, len = handlers.length; i < len; i++) {
    current = current.then(function() {
      return handlers[i](parameter);
    });
  }
  return current;
}

export function addSuccessHandler(func) {
  SUCCESS_HANDLERS.push(func);
}

export function addErrorHandler(func) {
  ERROR_HANDLERS.push(func);
}
