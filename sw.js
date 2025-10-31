// Service Worker to add CORS headers for GitHub Pages
self.addEventListener('fetch', (event) => {
  // Only handle API requests - check if pathname contains /api/
  const url = new URL(event.request.url);
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to avoid consuming it
          const clonedResponse = response.clone();
          // Add CORS headers
          const newHeaders = new Headers(clonedResponse.headers);
          newHeaders.set('Access-Control-Allow-Origin', '*');
          newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
          newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

          return new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: newHeaders
          });
        })
        .catch((error) => {
          console.error('Fetch error for', event.request.url, ':', error);
          return new Response(`Error fetching resource: ${event.request.url}`, { 
            status: 500,
            statusText: 'Service Worker Fetch Error'
          });
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
