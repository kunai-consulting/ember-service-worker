export const PROJECT_REVISION = '{{PROJECT_REVISION}}';

let SUCCESS_HANDLERS = [];
let ERROR_HANDLERS = [];
let REGISTRATION_HANDLERS = [];

if ('serviceWorker' in navigator) {
  resolveHandlers(REGISTRATION_HANDLERS, navigator)
    .then(function() {
    navigator.serviceWorker.register('{{ROOT_URL}}{{SERVICE_WORKER_FILENAME}}', { scope: '{{ROOT_URL}}' })
      .then(function(reg) {
        return resolveHandlers(SUCCESS_HANDLERS, reg)
          .then(function() {
            console.log('Service Worker registration succeeded. Scope is ' + reg.scope);
          });
      })
      .catch(runErrorHandlers);
  }).catch(runErrorHandlers);
}

function runErrorHandlers(error) {
  return resolveHandlers(ERROR_HANDLERS, error)
    .then(function() {
      console.log('Service Worker registration failed with ' + error);
    });
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

export function addRegistrationHandler(func) {
  REGISTRATION_HANDLERS.push(func);
}

export function addSuccessHandler(func) {
  SUCCESS_HANDLERS.push(func);
}

export function addErrorHandler(func) {
  ERROR_HANDLERS.push(func);
}
