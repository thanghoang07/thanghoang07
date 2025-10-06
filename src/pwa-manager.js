/**
 * 📱 Progressive Web App Manager
 * Comprehensive PWA functionality integration
 */

class PWAManager {
  constructor() {
    this.isInstalled = false;
    this.installPrompt = null;
    this.swRegistration = null;
    this.isOnline = navigator.onLine;
    
    // Configuration
    this.config = {
      swPath: '/sw.js',
      manifestPath: '/manifest.json',
      updateCheckInterval: 60000, // 1 minute
      offlineDetection: true,
      pushNotifications: true,
      backgroundSync: true
    };
    
    // Event listeners storage
    this.listeners = new Map();
    
    this.init();
  }

  async init() {
    try {
      // Check PWA support
      if (!this.isPWASupported()) {
        console.warn('⚠️ PWA features not fully supported in this browser');
        return;
      }
      
      // Register service worker
      await this.registerServiceWorker();
      
      // Setup install prompt
      this.setupInstallPrompt();
      
      // Setup offline/online detection
      this.setupNetworkDetection();
      
      // Setup background sync
      this.setupBackgroundSync();
      
      // Setup push notifications
      await this.setupPushNotifications();
      
      // Check for updates
      this.setupUpdateCheck();
      
      // Create PWA UI controls
      this.createPWAControls();
      
      console.log('📱 PWA Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ PWA initialization failed:', error);
    }
  }

  isPWASupported() {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Workers not supported');
    }
    
    try {
      this.swRegistration = await navigator.serviceWorker.register(this.config.swPath, {
        scope: '/'
      });
      
      console.log('✅ Service Worker registered:', this.swRegistration);
      
      // Handle updates
      this.swRegistration.addEventListener('updatefound', () => {
        this.handleServiceWorkerUpdate();
      });
      
      // Setup message channel for communication
      this.setupServiceWorkerCommunication();
      
      return this.swRegistration;
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      throw error;
    }
  }

  setupInstallPrompt() {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.showInstallPrompt();
      
      console.log('📱 Install prompt available');
    });
    
    // Detect if already installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.trackInstallEvent();
      
      console.log('🎉 PWA installed successfully');
    });
    
    // Check if launched from home screen
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('📱 Running as installed PWA');
    }
  }

  async showInstallPrompt() {
    if (!this.installPrompt) return;
    
    // Create custom install banner
    const banner = this.createInstallBanner();
    document.body.appendChild(banner);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (banner && banner.parentNode) {
        banner.remove();
      }
    }, 10000);
  }

  createInstallBanner() {
    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      max-width: 400px;
      margin: 0 auto;
      background: var(--bg-primary, #ffffff);
      color: var(--text-primary, #1f2937);
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-color, #e5e7eb);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      animation: slideUp 0.3s ease;
      backdrop-filter: blur(10px);
    `;
    
    banner.innerHTML = `
      <div class="pwa-icon" style="font-size: 24px;">📱</div>
      <div class="pwa-content" style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Install Portfolio App</div>
        <div style="font-size: 14px; opacity: 0.8;">Add to home screen for quick access</div>
      </div>
      <button class="pwa-install-btn" style="
        padding: 8px 16px;
        background: var(--primary-color, #9333ea);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      ">Install</button>
      <button class="pwa-close-btn" style="
        padding: 8px;
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.3s ease;
      ">×</button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .pwa-install-btn:hover {
        background: var(--accent-color, #a855f7);
        transform: translateY(-1px);
      }
      .pwa-close-btn:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    banner.querySelector('.pwa-install-btn').addEventListener('click', () => {
      this.triggerInstall();
      banner.remove();
    });
    
    banner.querySelector('.pwa-close-btn').addEventListener('click', () => {
      banner.remove();
      localStorage.setItem('pwa-install-dismissed', Date.now());
    });
    
    return banner;
  }

  async triggerInstall() {
    if (!this.installPrompt) return false;
    
    try {
      const result = await this.installPrompt.prompt();
      console.log('Install prompt result:', result);
      
      if (result.outcome === 'accepted') {
        console.log('✅ User accepted install');
      } else {
        console.log('❌ User dismissed install');
      }
      
      this.installPrompt = null;
      return result.outcome === 'accepted';
      
    } catch (error) {
      console.error('Install prompt error:', error);
      return false;
    }
  }

  hideInstallPrompt() {
    const banner = document.querySelector('.pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  setupNetworkDetection() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });
    
    // Initial status
    if (!this.isOnline) {
      this.handleOffline();
    }
  }

  handleOnline() {
    console.log('🌐 Back online');
    
    // Remove offline indicator
    const offlineIndicator = document.querySelector('.offline-indicator');
    if (offlineIndicator) {
      offlineIndicator.remove();
    }
    
    // Sync background data
    if (this.swRegistration && 'sync' in this.swRegistration) {
      this.swRegistration.sync.register('background-sync');
    }
    
    // Show online notification
    this.showNetworkNotification('🌐 Back online! Syncing data...', 'success');
  }

  handleOffline() {
    console.log('📡 Gone offline');
    
    // Show offline indicator
    this.showOfflineIndicator();
    
    // Show offline notification
    this.showNetworkNotification('📡 You\'re offline. Some features may be limited.', 'warning');
  }

  showOfflineIndicator() {
    if (document.querySelector('.offline-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'offline-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      padding: 8px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      z-index: 10002;
      animation: slideDown 0.3s ease;
    `;
    
    indicator.innerHTML = `
      📡 You're offline - Some content may not be up to date
      <button onclick="this.parentNode.remove()" style="
        background: none;
        border: none;
        color: white;
        margin-left: 12px;
        cursor: pointer;
        font-size: 16px;
      ">×</button>
    `;
    
    document.body.appendChild(indicator);
  }

  showNetworkNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'network-notification';
    
    const colors = {
      success: '#10b981',
      warning: '#f59e0b', 
      error: '#ef4444',
      info: '#3b82f6'
    };
    
    notification.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10001;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  setupBackgroundSync() {
    if (!this.swRegistration || !('sync' in this.swRegistration)) {
      console.log('Background sync not supported');
      return;
    }
    
    // Register sync events for different types
    this.registerBackgroundSync('contact-form-sync');
    this.registerBackgroundSync('analytics-sync');
    this.registerBackgroundSync('error-reports-sync');
  }

  async registerBackgroundSync(tag) {
    try {
      await this.swRegistration.sync.register(tag);
      console.log(`✅ Background sync registered: ${tag}`);
    } catch (error) {
      console.error(`❌ Background sync registration failed: ${tag}`, error);
    }
  }

  async setupPushNotifications() {
    if (!this.config.pushNotifications || !('PushManager' in window)) {
      console.log('Push notifications not supported or disabled');
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        await this.subscribeToPushNotifications();
      } else {
        console.log('❌ Notification permission denied');
      }
      
    } catch (error) {
      console.error('Push notification setup error:', error);
    }
  }

  async subscribeToPushNotifications() {
    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // Replace with your VAPID public key
          'BMh_XdONHYO1hOKfG5ezTHoLjN5lRyDw7zArz-1Y_MKaQfJbS9F3FfmhLX1ppO_L6-2ry2Y7z-0J7UK0BkL4ZnY'
        )
      });
      
      console.log('✅ Push subscription created:', subscription);
      
      // Send subscription to server (in a real app)
      // await this.sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('Push subscription error:', error);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  setupUpdateCheck() {
    if (!this.swRegistration) return;
    
    // Check for updates periodically
    this.updateCheckInterval = setInterval(() => {
      this.swRegistration.update();
    }, this.config.updateCheckInterval);
  }

  handleServiceWorkerUpdate() {
    const newWorker = this.swRegistration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('🔄 New version available');
        this.showUpdateNotification();
      }
    });
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      max-width: 400px;
      margin: 0 auto;
      background: var(--bg-primary, #ffffff);
      color: var(--text-primary, #1f2937);
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-color, #e5e7eb);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      animation: slideUp 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="font-size: 24px;">🔄</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Update Available</div>
        <div style="font-size: 14px; opacity: 0.8;">A new version is ready to install</div>
      </div>
      <button class="update-btn" style="
        padding: 8px 16px;
        background: var(--primary-color, #9333ea);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
      ">Update</button>
      <button class="dismiss-btn" style="
        padding: 8px;
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.6;
      ">×</button>
    `;
    
    // Event listeners
    notification.querySelector('.update-btn').addEventListener('click', () => {
      this.applyUpdate();
      notification.remove();
    });
    
    notification.querySelector('.dismiss-btn').addEventListener('click', () => {
      notification.remove();
    });
    
    document.body.appendChild(notification);
  }

  applyUpdate() {
    if (!this.swRegistration || !this.swRegistration.waiting) return;
    
    // Tell the waiting service worker to take control
    this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Reload page when new service worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  setupServiceWorkerCommunication() {
    navigator.serviceWorker.addEventListener('message', event => {
      const { type, payload } = event.data;
      
      switch (type) {
        case 'CACHE_STATUS':
          this.handleCacheStatus(payload);
          break;
          
        case 'SYNC_COMPLETE':
          this.handleSyncComplete(payload);
          break;
          
        default:
          console.log('Received SW message:', type, payload);
      }
    });
  }

  handleCacheStatus(status) {
    console.log('Cache status:', status);
  }

  handleSyncComplete(syncType) {
    console.log(`Sync completed: ${syncType}`);
    this.showNetworkNotification(`✅ ${syncType} synced successfully`, 'success');
  }

  createPWAControls() {
    // Add PWA controls to theme controls
    const themeControls = document.querySelector('.theme-controls');
    if (!themeControls) return;
    
    // Install button (if not installed)
    if (!this.isInstalled && this.installPrompt) {
      const installBtn = document.createElement('button');
      installBtn.innerHTML = '📱';
      installBtn.title = 'Install App';
      installBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 12px;
        background: var(--primary-color, #9333ea);
        color: white;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      
      installBtn.addEventListener('click', () => {
        this.triggerInstall();
      });
      
      themeControls.appendChild(installBtn);
    }
    
    // Offline/Online indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'network-status';
    statusIndicator.style.cssText = `
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${this.isOnline ? '#10b981' : '#ef4444'};
      margin: 14px 8px;
      transition: background 0.3s ease;
    `;
    statusIndicator.title = this.isOnline ? 'Online' : 'Offline';
    
    themeControls.appendChild(statusIndicator);
    
    // Update status indicator
    this.listeners.set('networkStatus', () => {
      statusIndicator.style.background = this.isOnline ? '#10b981' : '#ef4444';
      statusIndicator.title = this.isOnline ? 'Online' : 'Offline';
    });
  }

  // Public API methods
  async getCacheStatus() {
    if (!navigator.serviceWorker.controller) return null;
    
    const messageChannel = new MessageChannel();
    
    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.payload);
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      );
    });
  }

  async clearCache(cacheName) {
    if (!navigator.serviceWorker.controller) return false;
    
    const messageChannel = new MessageChannel();
    
    return new Promise((resolve) => {
      messageChannel.port1.onmessage = () => {
        resolve(true);
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE', payload: { cacheName } },
        [messageChannel.port2]
      );
    });
  }

  async prefetchResources(urls) {
    if (!navigator.serviceWorker.controller) return;
    
    navigator.serviceWorker.controller.postMessage({
      type: 'PREFETCH_RESOURCES',
      payload: { urls }
    });
  }

  trackInstallEvent() {
    // Track PWA installation for analytics
    if (window.gtag) {
      gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'PWA Installation'
      });
    }
  }

  getInstallationStatus() {
    return {
      isInstalled: this.isInstalled,
      isInstallable: !!this.installPrompt,
      isOnline: this.isOnline,
      hasServiceWorker: !!this.swRegistration
    };
  }

  // Cleanup
  destroy() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }
    
    this.listeners.clear();
    
    // Unregister service worker (optional, usually not needed)
    if (this.swRegistration) {
      // this.swRegistration.unregister();
    }
  }
}

// 🚀 Initialize PWA Manager
export function initPWA() {
  try {
    window.pwaManager = new PWAManager();
    
    console.log('📱 PWA system initialized successfully!');
    return window.pwaManager;
    
  } catch (error) {
    console.error('❌ Failed to initialize PWA system:', error);
    return null;
  }
}

export { PWAManager };