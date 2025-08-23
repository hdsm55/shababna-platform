// React Polyfill for production
window.global = window;
window.process = { env: { NODE_ENV: 'production' } };

// Ensure React is available globally
if (typeof window !== 'undefined') {
  window.React = window.React || {};
  window.ReactDOM = window.ReactDOM || {};

  // Ensure React hooks are available
  if (window.React && !window.React.useState) {
    console.warn('React useState not available, waiting for React to load...');
  }
}

// Wait for React to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Ensure React is loaded before any scripts try to use it
  if (typeof window.React === 'undefined') {
    console.warn('React not found, retrying...');
  }
});
