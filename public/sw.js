self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    // Broadcast to window clients
    event.waitUntil(
      self.clients.matchAll({type: 'window'}).then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'PUSH_NOTIFICATION',
            payload: data
          });
        });
      })
    );

    const options = {
      body: data.body,
      icon: data.icon || '/next.svg', // Default icon
      badge: data.badge || '/next.svg', // Default badge
      image: data.image || '/https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=843&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Default image
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      },
      actions: [
        {action: 'explore', title: 'View Article'}
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
