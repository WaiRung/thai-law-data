// Service Worker to add CORS headers for GitHub Pages
self.addEventListener('fetch', (event) => {
  // Only handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response and add CORS headers
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Access-Control-Allow-Origin', '*');
          newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
          newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          return new Response('Error fetching resource', { status: 500 });
        })
    );
  }
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
