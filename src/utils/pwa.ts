// PWA utility functions
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Vite PWA handles registration automatically
      const registration = await navigator.serviceWorker.ready;
      console.log('SW registered: ', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update prompt
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
  // Can implement a custom update prompt here
  // For now, we'll just reload the page
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
  // This will be called when the user clicks the install button
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Trigger the install prompt
      const installEvent = new Event('beforeinstallprompt');
      window.dispatchEvent(installEvent);
    });
  }
}; 