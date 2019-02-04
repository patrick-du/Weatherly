//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache';
var precacheFiles = [
  /* Add an array of files to precache for your app */
  '/index.html',
  '/css/styles.css',
  '/scripts/app.js'
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (evt) {
  console.log('[PWA Builder] The service worker is being installed.');
  evt.waitUntil(precache().then(function () {
    console.log('[PWA Builder] Skip waiting on install');
    return self.skipWaiting();
  }));
});


//allow sw to control of current page
self.addEventListener('activate', function (event) {
  console.log('[PWA Builder] Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
  console.log('[PWA Builder] The service worker is serving the asset.' + evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the 
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request) {
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function (response) { return response });
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('brown');
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  btnAdd.style.display = 'block';
});

btnAdd.addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
      .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
          } else {
              console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
      });
});