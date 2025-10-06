/**
 * 🔧 Advanced Service Worker
 * Comprehensive PWA functionality with intelligent caching and offline support
 */

const CACHE_NAME = 'thang-portfolio-v2.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const OFFLINE_CACHE = `${CACHE_NAME}-offline`;

// Cache strategies configuration
const CACHE_STRATEGIES = {
  // Static assets - Cache first with long expiration
  STATIC: {
    name: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 50
  },
  
  // Dynamic content - Network first with fallback
  DYNAMIC: {
    name: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 30
  },
  
  // Offline fallbacks
  OFFLINE: {
    name: OFFLINE_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 10
  }
};

// Files to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/src/app.js',
  '/src/theme.js',
  '/src/translations.js',
  '/offline.html'
];

// Routes that need special handling
const OFFLINE_FALLBACK_PAGE = '/offline.html';
const CACHE_FIRST_PATTERNS = [
  /\.(?:js|css|woff2?|ttf|eot)$/,
  /\/src\//,
  /\/assets\//
];

const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\.(?:json)$/
];

// Background sync configurations
const BACKGROUND_SYNC = {
  CONTACT_FORM: 'contact-form-sync',
  ANALYTICS: 'analytics-sync',
  ERROR_REPORTS: 'error-reports-sync'
};

/**
 * Service Worker Installation
 */
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Pre-cache critical assets
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(PRECACHE_ASSETS);
        
        // Create offline page
        await createOfflinePage();
        
        console.log('✅ Service Worker installed successfully');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
        
      } catch (error) {
        console.error('❌ Service Worker installation failed:', error);
      }
    })()
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        await cleanupOldCaches();
        
        // Take control of all clients immediately
        await self.clients.claim();
        
        // Initialize background sync
        await initializeBackgroundSync();
        
        console.log('✅ Service Worker activated successfully');
        
      } catch (error) {
        console.error('❌ Service Worker activation failed:', error);
      }
    })()
  );
});

/**
 * Fetch Event Handler - Advanced Caching Strategies
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Determine cache strategy based on URL pattern
        if (shouldUseCacheFirst(url)) {
          return await cacheFirstStrategy(request);
        } else if (shouldUseNetworkFirst(url)) {
          return await networkFirstStrategy(request);
        } else {
          return await staleWhileRevalidateStrategy(request);
        }
        
      } catch (error) {
        console.error('Fetch error:', error);
        return await handleFetchError(request, error);
      }
    })()
  );
});

/**
 * Background Sync Handler
 */
self.addEventListener('sync', event => {
  console.log('🔄 Background sync event:', event.tag);
  
  switch (event.tag) {
    case BACKGROUND_SYNC.CONTACT_FORM:
      event.waitUntil(syncContactForms());
      break;
      
    case BACKGROUND_SYNC.ANALYTICS:
      event.waitUntil(syncAnalytics());
      break;
      
    case BACKGROUND_SYNC.ERROR_REPORTS:
      event.waitUntil(syncErrorReports());
      break;
      
    default:
      console.log('Unknown sync event:', event.tag);
  }
});

/**
 * Push Notification Handler
 */
self.addEventListener('push', event => {
  const options = {
    body: 'Check out the latest updates to my portfolio!',
    icon: 'https://ui-avatars.com/api/?name=Thang+Hoang+Duc&background=9333ea&color=fff&size=192',
    badge: 'https://ui-avatars.com/api/?name=TH&background=9333ea&color=fff&size=72',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: 'https://ui-avatars.com/api/?name=P&background=7c3aed&color=fff&size=32'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'https://ui-avatars.com/api/?name=X&background=ef4444&color=fff&size=32'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Portfolio Updated!', options)
  );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open portfolio
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

/**
 * Message Handler for Client Communication
 */
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      event.ports[0].postMessage({
        type: 'CACHE_STATUS',
        payload: getCacheStatus()
      });
      break;
      
    case 'CLEAR_CACHE':
      clearSpecificCache(payload.cacheName)
        .then(() => event.ports[0].postMessage({ type: 'CACHE_CLEARED' }));
      break;
      
    case 'PREFETCH_RESOURCES':
      prefetchResources(payload.urls);
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// =================== CACHE STRATEGIES ===================

/**
 * Cache First Strategy - For static assets
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Optionally update cache in background
    updateCacheInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match(OFFLINE_FALLBACK_PAGE);
    }
    throw error;
  }
}

/**
 * Network First Strategy - For API calls and dynamic content
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match(OFFLINE_FALLBACK_PAGE);
    }
    
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy - For general content
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch fresh content
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // Final fallback
  if (request.mode === 'navigate') {
    return await caches.match(OFFLINE_FALLBACK_PAGE);
  }
  
  throw new Error('No cached response and network failed');
}

// =================== UTILITY FUNCTIONS ===================

function shouldUseCacheFirst(url) {
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function shouldUseNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname));
}

async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = Object.values(CACHE_STRATEGIES).map(strategy => strategy.name);
  
  await Promise.all(
    cacheNames
      .filter(cacheName => !currentCaches.includes(cacheName))
      .map(cacheName => caches.delete(cacheName))
  );
}

async function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Thang Portfolio</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 2rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .offline-container {
                max-width: 500px;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            h1 { margin: 0 0 1rem; }
            p { opacity: 0.9; line-height: 1.6; }
            .retry-btn {
                margin-top: 2rem;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 25px;
                color: white;
                text-decoration: none;
                transition: all 0.3s ease;
                display: inline-block;
            }
            .retry-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">📡</div>
            <h1>You're Offline</h1>
            <p>It looks like you're not connected to the internet. Don't worry, some content is available offline!</p>
            <a href="/" class="retry-btn" onclick="window.location.reload()">Try Again</a>
        </div>
        <script>
            // Auto-retry when online
            window.addEventListener('online', () => {
                window.location.reload();
            });
        </script>
    </body>
    </html>
  `;
  
  const cache = await caches.open(OFFLINE_CACHE);
  await cache.put('/offline.html', new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  }));
}

async function handleFetchError(request, error) {
  if (request.mode === 'navigate') {
    return await caches.match(OFFLINE_FALLBACK_PAGE);
  }
  
  // Try to return any cached version as last resort
  const anyCache = await caches.match(request);
  if (anyCache) {
    return anyCache;
  }
  
  throw error;
}

async function initializeBackgroundSync() {
  // Register background sync for offline form submissions
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    console.log('Background sync supported');
  }
}

// =================== BACKGROUND SYNC HANDLERS ===================

async function syncContactForms() {
  console.log('🔄 Syncing contact forms...');
  
  try {
    // Retrieve stored form submissions
    const formData = await getStoredData('contact-forms');
    
    for (const submission of formData) {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
    }
    
    // Clear stored submissions after successful sync
    await clearStoredData('contact-forms');
    
    console.log('✅ Contact forms synced successfully');
    
  } catch (error) {
    console.error('❌ Contact form sync failed:', error);
    throw error; // Retry later
  }
}

async function syncAnalytics() {
  console.log('🔄 Syncing analytics...');
  
  try {
    const analyticsData = await getStoredData('analytics-events');
    
    // Send analytics events that were stored offline
    for (const event of analyticsData) {
      // Send to analytics service
      await sendAnalyticsEvent(event);
    }
    
    await clearStoredData('analytics-events');
    console.log('✅ Analytics synced successfully');
    
  } catch (error) {
    console.error('❌ Analytics sync failed:', error);
  }
}

async function syncErrorReports() {
  console.log('🔄 Syncing error reports...');
  
  try {
    const errorReports = await getStoredData('error-reports');
    
    for (const report of errorReports) {
      await sendErrorReport(report);
    }
    
    await clearStoredData('error-reports');
    console.log('✅ Error reports synced successfully');
    
  } catch (error) {
    console.error('❌ Error report sync failed:', error);
  }
}

// =================== STORAGE UTILITIES ===================

async function getStoredData(key) {
  // This would use IndexedDB in a real implementation
  return JSON.parse(localStorage.getItem(key) || '[]');
}

async function clearStoredData(key) {
  localStorage.removeItem(key);
}

async function sendAnalyticsEvent(event) {
  // Send to Google Analytics or other analytics service
  console.log('Sending analytics event:', event);
}

async function sendErrorReport(report) {
  console.log('Sending error report:', report);
}

// =================== CACHE MANAGEMENT ===================

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = {
      size: keys.length,
      keys: keys.map(request => request.url)
    };
  }
  
  return status;
}

async function clearSpecificCache(cacheName) {
  return await caches.delete(cacheName);
}

async function prefetchResources(urls) {
  const cache = await caches.open(STATIC_CACHE);
  
  await Promise.all(
    urls.map(async url => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.warn('Prefetch failed for:', url);
      }
    })
  );
}