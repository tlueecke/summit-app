self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['sw-precache-v1-summit0.0.1', '$$$toolbox-cache$$$'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.indexOf(cacheWhitelist[0]) !== 0 && cacheName.indexOf(cacheWhitelist[1]) !== 0) {
            console.log('Deleting outdated cache: '+cacheName);
            return caches.delete(cacheName).then(function() {
              console.log('Cache entry successfully deleted: '+cacheName);
            });
          }
        })
      );
    })
  );
});
