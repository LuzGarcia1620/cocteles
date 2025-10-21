if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg))
      .catch(err => console.error('❌ Error al registrar el SW:', err));
  });
}
