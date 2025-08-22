// React Polyfill for production
window.global = window;
window.process = { env: { NODE_ENV: 'production' } };

// Ensure React is available globally
if (typeof window !== 'undefined') {
  window.React = window.React || {};
  window.ReactDOM = window.ReactDOM || {};
}
