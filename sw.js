const CACHE_NAME = 'escapologists-v1';
const ASSETS = [
  'index.html',
  'splash.jpg',
  'fond_comic.jpg',
  'but_mission_1.jpg',
  'but_mission_2.jpg',
  'bouton_action.jpg',
  'bouton_enigma.jpg',
  'Banks.png', 'Julia.png', 'Kim.png', 'Murphy.png', 'Stacy.png',
  'grille.csv', 'grille_ac.csv', 'alarm.wav'
];

// Installation : Mise en cache des fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Intercepter les requêtes pour servir le cache si hors-ligne
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
