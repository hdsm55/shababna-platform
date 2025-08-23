// React Environment Setup
window.global = window.global || window;
window.process = window.process || { env: { NODE_ENV: 'production' } };

// Remove problematic React polyfill that causes conflicts
// React will be loaded by the main module bundle
