export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('SW registered: ', registration);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdatePrompt(registration);
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  }
};

const showUpdatePrompt = (registration: ServiceWorkerRegistration) => {
  if (confirm('Une nouvelle version est disponible. Voulez-vous mettre à jour ?')) {
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
};

export const checkForUpdates = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.update();
      }
    });
  }
};

export const installPWA = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      const installEvent = new Event('beforeinstallprompt');
      window.dispatchEvent(installEvent);
    });
  }
}; 