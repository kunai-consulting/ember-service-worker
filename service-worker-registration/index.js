'use strict';

const ismobile = require('ismobilejs');

export const PROJECT_REVISION = '{{PROJECT_REVISION}}';

let SUCCESS_HANDLERS = [];
let ERROR_HANDLERS = [];

if ('serviceWorker' in navigator ) {
  if (!ismobile.isMobile(navigator.userAgent).any || '{{SHOULD_REGISTER_ON_MOBILE}}'.toLowerCase() === 'true') {
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
