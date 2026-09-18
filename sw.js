const CACHE_NAME = 'escapologists-v3';

// Fichiers à mettre en cache pour le fonctionnement 100% hors-ligne
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './papaparse.min.js',

  // Polices hébergées localement
'./Bangers.ttf',
  './Kalam-Bold.ttf',

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

  // --- Fichiers de données CSV généraux ---
  './grille.csv',
  './grille_ac.csv',

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

  // Mission 4
  './grille_eni_M4.csv',
  './indice_M4.csv',
  './solutions_M4.csv',

  // Mission 5
  './grille_eni_M5.csv',
  './indice_M5.csv',
  './solutions_M5.csv'
];

// 1. Installation : Mise en cache tolérante aux erreurs de fichiers manquants
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS.map((url) =>
          fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Erreur ${response.status} sur ${url}`);
              }
              return cache.put(url, response);
            })
            .catch((err) =>
              console.warn(`Impossible de mettre en cache : ${url}`, err)
            )
        )
      );
    })
  );
});

// 2. Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Interception des requêtes : Servir le cache en priorité
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // En cas de panne réseau globale, renvoyer l'index
        return caches.match('./index.html') || caches.match('./');
      });
    })
  );
});
