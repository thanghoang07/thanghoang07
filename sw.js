/**
 * 🔧 Advanced Service Worker
 * Optimized caching strategies and offline functionality
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAMES = {
  critical: `critical-${CACHE_VERSION}`,
  static: `static-${CACHE_VERSION}`,
  dynamic: `dynamic-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`
};

// Cache strategies configuration
let cacheStrategies = {
  critical: 'cacheFirst',
  static: 'staleWhileRevalidate',
  api: 'networkFirst',
  images: 'cacheFirst'
};

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/src/core/config.js',
  '/src/core/app-manager.js',
  '/manifest.json'
];

// Static resources patterns
const STATIC_RESOURCES = [
  /\.(?:css|js|woff2?|ttf|eot)$/,
  /\/fonts\//,
  /\/js\//,
  /\/css\//
];

// Image resources patterns
const IMAGE_RESOURCES = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/,
  /\/images\//,
  /\/assets\//
];

// API endpoints patterns
const API_RESOURCES = [
  /\/api\//,
  /\.json$/
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache critical resources
        const criticalCache = await caches.open(CACHE_NAMES.critical);
        await criticalCache.addAll(CRITICAL_RESOURCES);
        
        console.log('[SW] Critical resources cached');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Install failed:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => {
          return !Object.values(CACHE_NAMES).includes(name);
        });
        
        await Promise.all(
          oldCaches.map(cacheName => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        
        // Take control of all pages
        await self.clients.claim();
        
        console.log('[SW] Activated successfully');
      } catch (error) {
        console.error('[SW] Activation failed:', error);
      }
    })()
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;
  
  // Only handle GET requests
  if (method !== 'GET') return;
  
  // Determine cache strategy based on resource type
  const strategy = determineStrategy(url);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'UPDATE_CACHE_STRATEGY':
      cacheStrategies = { ...cacheStrategies, ...data.strategies };
      console.log('[SW] Cache strategies updated:', cacheStrategies);
      break;
      
    case 'CACHE_CRITICAL_RESOURCES':
      cacheCriticalResources();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'offline-actions') {
    event.waitUntil(processOfflineActions());
  }
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Portfolio Update', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Determine caching strategy based on URL
function determineStrategy(url) {
  // Critical resources
  if (CRITICAL_RESOURCES.some(resource => url.includes(resource))) {
    return cacheStrategies.critical;
  }
  
  // Static resources
  if (STATIC_RESOURCES.some(pattern => pattern.test(url))) {
    return cacheStrategies.static;
  }
  
  // Images
  if (IMAGE_RESOURCES.some(pattern => pattern.test(url))) {
    return cacheStrategies.images;
  }
  
  // API resources
  if (API_RESOURCES.some(pattern => pattern.test(url))) {
    return cacheStrategies.api;
  }
  
  // Default strategy
  return 'networkFirst';
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  const cacheName = getCacheName(request.url);
  
  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(request, cacheName);
    case 'networkFirst':
      return networkFirst(request, cacheName);
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request, cacheName);
    case 'cacheOnly':
      return cacheOnly(request, cacheName);
    case 'networkOnly':
      return networkOnly(request);
    default:
      return networkFirst(request, cacheName);
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 3000)
      )
    ]);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error.message);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable' 
    });
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.log('[SW] Background fetch failed:', error);
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If no cache, wait for network
  try {
    return await networkResponsePromise;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Cache Only strategy
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return new Response('Not in cache', { status: 404 });
}

// Network Only strategy
async function networkOnly(request) {
  return fetch(request);
}

// Get appropriate cache name for URL
function getCacheName(url) {
  if (CRITICAL_RESOURCES.some(resource => url.includes(resource))) {
    return CACHE_NAMES.critical;
  }
  
  if (STATIC_RESOURCES.some(pattern => pattern.test(url))) {
    return CACHE_NAMES.static;
  }
  
  if (IMAGE_RESOURCES.some(pattern => pattern.test(url))) {
    return CACHE_NAMES.images;
  }
  
  if (API_RESOURCES.some(pattern => pattern.test(url))) {
    return CACHE_NAMES.api;
  }
  
  return CACHE_NAMES.dynamic;
}

// Cache critical resources manually
async function cacheCriticalResources() {
  try {
    const cache = await caches.open(CACHE_NAMES.critical);
    await cache.addAll(CRITICAL_RESOURCES);
    console.log('[SW] Critical resources cached manually');
  } catch (error) {
    console.error('[SW] Failed to cache critical resources:', error);
  }
}

// Get cache status
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = {
      count: keys.length,
      resources: keys.map(key => key.url)
    };
  }
  
  return status;
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[SW] All caches cleared');
}

// Process offline actions
async function processOfflineActions() {
  console.log('[SW] Processing offline actions...');
  
  // Get offline actions from IndexedDB or localStorage
  // This would typically sync with server when online
  
  try {
    // Simulate processing offline actions
    const actions = await getOfflineActions();
    
    for (const action of actions) {
      await syncAction(action);
    }
    
    console.log('[SW] Offline actions processed');
  } catch (error) {
    console.error('[SW] Failed to process offline actions:', error);
  }
}

// Get offline actions (placeholder)
async function getOfflineActions() {
  // This would read from IndexedDB
  return [];
}

// Sync individual action (placeholder)
async function syncAction(action) {
  try {
    const response = await fetch(action.endpoint, {
      method: action.method,
      headers: action.headers,
      body: action.body
    });
    
    if (response.ok) {
      console.log('[SW] Action synced:', action.id);
      // Remove from offline queue
    }
  } catch (error) {
    console.error('[SW] Action sync failed:', action.id, error);
  }
}

// Performance optimization - preload critical resources
self.addEventListener('install', (event) => {
  // Preload resources that are likely to be needed
  const preloadResources = [
    '/fonts/inter-var.woff2',
    '/images/hero-bg.webp'
  ];
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAMES.static);
      
      // Don't fail installation if preload fails
      try {
        await cache.addAll(preloadResources);
        console.log('[SW] Preload resources cached');
      } catch (error) {
        console.warn('[SW] Preload failed (non-critical):', error);
      }
    })()
  );
});

// Clean up resources periodically
setInterval(() => {
  cleanupOldCaches();
}, 60000 * 60); // Every hour

async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const cacheName of cacheNames) {
      if (cacheName.includes('dynamic') || cacheName.includes('api')) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          const cacheTime = response.headers.get('sw-cache-time');
          
          if (cacheTime && (now - parseInt(cacheTime)) > maxAge) {
            await cache.delete(request);
            console.log('[SW] Cleaned up old cache entry:', request.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}

console.log('[SW] Service Worker loaded');