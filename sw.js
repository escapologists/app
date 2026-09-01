const CACHE_NAME = 'escapologists-v2';

// Fichiers à mettre en cache pour le fonctionnement 100% hors-ligne
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './papaparse.min.js',
  
  // Images d'ambiance et boutons
  './splash.jpg',
  './fond_comic.jpg',
  './bouton_action.jpg',
  './bouton_enigma.jpg',
  
  // Visuels des missions
  './but_mission_1.jpg',
  './but_mission_2.jpg',
  './but_mission_3.jpg',
  './but_mission_4.jpg',
  './but_mission_5.jpg',
  
  // Avatars des personnages
  './Banks.png',
  './Julia.png',
  './Kim.png',
  './Murphy.png',
  './Stacy.png',
  
  // Sons
  './alarm.wav',

  // --- Fichiers de données CSV par mission ---
  // Mission 1
  './grille_eni_M1.csv',
  './indice_M1.csv',
  './solutions_M1.csv',

  // Mission 2
  './grille_eni_M2.csv',
  './indice_M2.csv',
  './solutions_M2.csv',

  // Mission 3
  './grille_eni_M3.csv',
  './indice_M3.csv',
  './solutions_M3.csv',

];

// 1. Installation : Mise en cache initiale de l'ensemble des ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Interception des requêtes : Servir le cache en priorité
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
