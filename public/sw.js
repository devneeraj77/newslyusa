self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  if (event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'New Article', body: event.data.text() };
    }

    // Broadcast to window clients
    const broadcastPromise = self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'PUSH_NOTIFICATION',
          payload: data,
        });
      });
    });

    const options = {
      body: data.body,
      icon: data.icon || '/next.svg', // Fallback to next.svg if empty
      badge: data.badge || '/next.svg',
      image: data.image || data.featuredImage || undefined, // Ensure empty strings don't break it
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        url: data.url || '/',
      },
      actions: data.url ? [{ action: 'explore', title: 'View Article' }] : [],
    };

    event.waitUntil(Promise.all([broadcastPromise, self.registration.showNotification(data.title || 'New Update', options)]));
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  const fullUrlToOpen = new URL(urlToOpen, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (windowClients) {
        // Check if there is already a window/tab open with the target URL
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          if (client.url === fullUrlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(fullUrlToOpen);
        }
      }),
  );
});
