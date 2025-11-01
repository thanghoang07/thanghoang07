/**
 * 📱 PWA Optimization Manager
 * Advanced Progressive Web App features and caching strategies
 */

import { FeatureManager } from '../core/base-manager.js';
import { PWA_CONFIG } from '../core/config.js';
import { Logger, NetworkUtils, DeviceUtils } from '../utils/index.js';

class PWAOptimizationManager extends FeatureManager {
  constructor() {
    super('PWA Optimization', {
      autoStart: true,
      storage: true,
      storageKey: 'pwa-optimization',
      debug: true
    });
    
    // Service Worker
    this.swRegistration = null;
    this.swController = null;
    
    // Cache strategies
    this.cacheStrategies = {
      critical: 'cacheFirst',
      static: 'staleWhileRevalidate',
      api: 'networkFirst',
      images: 'cacheFirst'
    };
    
    // Background sync
    this.backgroundSyncTasks = new Set();
    
    // Offline functionality
    this.isOffline = !navigator.onLine;
    this.offlineQueue = [];
    
    // Push notifications
    this.notificationPermission = 'default';
    
    // Install prompt
    this.installPromptEvent = null;
    this.canInstall = false;
    
    // Update management
    this.hasUpdate = false;
    this.updateAvailable = false;
  }

  async onInit() {
    this.debug('Initializing PWA Optimization...');
    
    try {
      // Register service worker
      await this.registerServiceWorker();
      
      // Setup offline/online detection
      this.setupOfflineDetection();
      
      // Setup install prompt handling
      this.setupInstallPrompt();
      
      // Setup update checking
      this.setupUpdateChecking();
      
      // Setup background sync
      this.setupBackgroundSync();
      
      // Setup push notifications
      this.setupPushNotifications();
      
      // Setup app shortcuts
      this.setupAppShortcuts();
      
      // Setup file system access
      this.setupFileSystemAccess();
      
      Logger.success('PWA Optimization initialized');
      
    } catch (error) {
      Logger.error('Failed to initialize PWA Optimization:', error);
      throw error;
    }
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      Logger.warning('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      this.swRegistration = registration;
      this.debug('Service Worker registered');

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        this.debug('New service worker installing');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New update available
              this.hasUpdate = true;
              this.updateAvailable = true;
              this.emit('updateAvailable', newWorker);
              this.showUpdateNotification();
            } else {
              // First install
              this.emit('installed');
              this.showInstallNotification();
            }
          }
        });
      });

      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.debug('Service worker controller changed');
        this.swController = navigator.serviceWorker.controller;
        this.emit('controllerChanged');
      });

      // Get current controller
      this.swController = navigator.serviceWorker.controller;

    } catch (error) {
      Logger.error('Service worker registration failed:', error);
    }
  }

  setupOfflineDetection() {
    // Initial state
    this.isOffline = !navigator.onLine;
    
    // Online/offline event listeners
    window.addEventListener('online', () => {
      this.isOffline = false;
      this.debug('App is online');
      this.emit('online');
      this.processOfflineQueue();
      this.hideOfflineMessage();
    });

    window.addEventListener('offline', () => {
      this.isOffline = true;
      this.debug('App is offline');
      this.emit('offline');
      this.showOfflineMessage();
    });

    // Connection quality monitoring
    if ('connection' in navigator) {
      this.monitorConnectionQuality();
    }
  }

  monitorConnectionQuality() {
    const connection = navigator.connection;
    
    const updateConnectionInfo = () => {
      const connectionInfo = {
        type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
      
      this.debug('Connection info:', connectionInfo);
      this.emit('connectionChange', connectionInfo);
      
      // Adapt caching strategy based on connection
      this.adaptCachingStrategy(connectionInfo);
    };
    
    connection.addEventListener('change', updateConnectionInfo);
    updateConnectionInfo(); // Initial check
  }

  adaptCachingStrategy(connectionInfo) {
    const { effectiveType, saveData } = connectionInfo;
    
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Aggressive caching for slow connections
      this.cacheStrategies.static = 'cacheFirst';
      this.cacheStrategies.api = 'cacheFirst';
      this.debug('Switched to aggressive caching for slow connection');
    } else {
      // Standard caching for fast connections
      this.cacheStrategies.static = 'staleWhileRevalidate';
      this.cacheStrategies.api = 'networkFirst';
      this.debug('Using standard caching strategy');
    }
    
    // Send updated strategy to service worker
    this.sendMessageToSW({
      type: 'UPDATE_CACHE_STRATEGY',
      strategies: this.cacheStrategies
    });
  }

  setupInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPromptEvent = e;
      this.canInstall = true;
      this.debug('Install prompt available');
      this.emit('installPromptAvailable');
      this.showInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.debug('App was installed');
      this.installPromptEvent = null;
      this.canInstall = false;
      this.emit('installed');
      this.hideInstallButton();
      this.showInstalledNotification();
    });
  }

  async promptInstall() {
    if (!this.installPromptEvent) {
      Logger.warning('Install prompt not available');
      return false;
    }

    try {
      const result = await this.installPromptEvent.prompt();
      this.debug('Install prompt result:', result.outcome);
      
      if (result.outcome === 'accepted') {
        this.installPromptEvent = null;
        this.canInstall = false;
        return true;
      }
      
      return false;
    } catch (error) {
      Logger.error('Install prompt failed:', error);
      return false;
    }
  }

  setupUpdateChecking() {
    // Check for updates periodically
    setInterval(() => {
      this.checkForUpdates();
    }, PWA_CONFIG.UPDATE_CHECK_INTERVAL);

    // Check on page focus
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  async checkForUpdates() {
    if (!this.swRegistration) return;

    try {
      await this.swRegistration.update();
      this.debug('Checked for service worker updates');
    } catch (error) {
      Logger.error('Update check failed:', error);
    }
  }

  async applyUpdate() {
    if (!this.hasUpdate) {
      Logger.warning('No update available');
      return;
    }

    try {
      // Skip waiting and activate new service worker
      this.sendMessageToSW({ type: 'SKIP_WAITING' });
      
      // Reload page to use new service worker
      window.location.reload();
    } catch (error) {
      Logger.error('Failed to apply update:', error);
    }
  }

  setupBackgroundSync() {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      Logger.warning('Background Sync not supported');
      return;
    }

    // Register background sync for offline actions
    this.registerBackgroundSync('offline-actions');
  }

  async registerBackgroundSync(tag) {
    if (!this.swRegistration) return;

    try {
      await this.swRegistration.sync.register(tag);
      this.backgroundSyncTasks.add(tag);
      this.debug(`Background sync registered: ${tag}`);
    } catch (error) {
      Logger.error(`Background sync registration failed for ${tag}:`, error);
    }
  }

  setupPushNotifications() {
    if (!('Notification' in window) || !('PushManager' in window)) {
      Logger.warning('Push notifications not supported');
      return;
    }

    this.notificationPermission = Notification.permission;
    this.debug('Notification permission:', this.notificationPermission);
  }

  async requestNotificationPermission() {
    if (this.notificationPermission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      this.debug('Notification permission updated:', permission);
      
      if (permission === 'granted') {
        this.emit('notificationPermissionGranted');
        return true;
      }
      
      return false;
    } catch (error) {
      Logger.error('Notification permission request failed:', error);
      return false;
    }
  }

  async subscribeToPush() {
    if (!this.swRegistration || this.notificationPermission !== 'granted') {
      Logger.warning('Cannot subscribe to push: missing requirements');
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: PWA_CONFIG.VAPID_PUBLIC_KEY
      });

      this.debug('Push subscription created');
      this.emit('pushSubscribed', subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      Logger.error('Push subscription failed:', error);
      return null;
    }
  }

  async sendSubscriptionToServer(subscription) {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
      
      this.debug('Push subscription sent to server');
    } catch (error) {
      Logger.error('Failed to send subscription to server:', error);
    }
  }

  setupAppShortcuts() {
    // App shortcuts are defined in manifest.json
    // Here we can handle shortcut activations
    
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer((launchParams) => {
        this.debug('App launched with params:', launchParams);
        this.handleLaunchParams(launchParams);
      });
    }
  }

  handleLaunchParams(launchParams) {
    if (launchParams.targetURL) {
      const url = new URL(launchParams.targetURL);
      const shortcut = url.searchParams.get('shortcut');
      
      if (shortcut) {
        this.debug('App launched via shortcut:', shortcut);
        this.emit('shortcutLaunched', shortcut);
        this.handleShortcut(shortcut);
      }
    }
  }

  handleShortcut(shortcut) {
    switch (shortcut) {
      case 'projects':
        this.navigateToSection('projects');
        break;
      case 'contact':
        this.navigateToSection('contact');
        break;
      case 'resume':
        this.openResume();
        break;
      default:
        Logger.warning('Unknown shortcut:', shortcut);
    }
  }

  setupFileSystemAccess() {
    if (!('showSaveFilePicker' in window)) {
      Logger.warning('File System Access API not supported');
      return;
    }

    // Enable advanced file operations
    this.fileSystemEnabled = true;
    this.debug('File System Access API available');
  }

  // Offline queue management
  addToOfflineQueue(request) {
    this.offlineQueue.push({
      ...request,
      timestamp: Date.now()
    });
    
    this.debug('Added request to offline queue:', request);
    this.emit('offlineRequestQueued', request);
  }

  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    
    this.debug(`Processing ${this.offlineQueue.length} offline requests`);
    
    const results = await Promise.allSettled(
      this.offlineQueue.map(request => this.retryRequest(request))
    );
    
    let successful = 0;
    let failed = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful++;
        this.offlineQueue.splice(index, 1);
      } else {
        failed++;
        Logger.error('Offline request failed:', result.reason);
      }
    });
    
    this.debug(`Offline queue processed: ${successful} successful, ${failed} failed`);
    this.emit('offlineQueueProcessed', { successful, failed });
  }

  async retryRequest(request) {
    try {
      const response = await fetch(request.url, request.options);
      if (response.ok) {
        this.debug('Retry successful:', request.url);
        return response;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      Logger.error('Retry failed:', request.url, error);
      throw error;
    }
  }

  // Service Worker messaging
  sendMessageToSW(message) {
    if (!this.swController) {
      Logger.warning('No service worker controller available');
      return;
    }

    this.swController.postMessage(message);
    this.debug('Message sent to service worker:', message);
  }

  // UI methods
  showInstallButton() {
    const installBtn = document.getElementById('install-button');
    if (installBtn) {
      installBtn.style.display = 'block';
      installBtn.addEventListener('click', () => this.promptInstall());
    }
  }

  hideInstallButton() {
    const installBtn = document.getElementById('install-button');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  showUpdateNotification() {
    const notification = this.createNotification({
      type: 'update',
      title: 'Update Available',
      message: 'A new version of the app is available. Click to update.',
      action: () => this.applyUpdate()
    });
    
    this.showNotification(notification);
  }

  showOfflineMessage() {
    const notification = this.createNotification({
      type: 'offline',
      title: 'Offline Mode',
      message: 'You are currently offline. Some features may be limited.',
      persistent: true
    });
    
    this.showNotification(notification);
  }

  hideOfflineMessage() {
    this.hideNotification('offline');
  }

  showInstallNotification() {
    const notification = this.createNotification({
      type: 'installed',
      title: 'App Installed',
      message: 'Portfolio app has been installed successfully!',
      timeout: 5000
    });
    
    this.showNotification(notification);
  }

  showInstalledNotification() {
    const notification = this.createNotification({
      type: 'app-installed',
      title: 'Installation Complete',
      message: 'You can now use the app offline and from your home screen!',
      timeout: 5000
    });
    
    this.showNotification(notification);
  }

  createNotification({ type, title, message, action, persistent = false, timeout = 3000 }) {
    const notification = document.createElement('div');
    notification.className = `pwa-notification pwa-notification--${type}`;
    notification.innerHTML = `
      <div class="pwa-notification__content">
        <h4 class="pwa-notification__title">${title}</h4>
        <p class="pwa-notification__message">${message}</p>
        ${action ? '<button class="pwa-notification__action">Update</button>' : ''}
        ${!persistent ? '<button class="pwa-notification__close">×</button>' : ''}
      </div>
    `;

    if (action) {
      const actionBtn = notification.querySelector('.pwa-notification__action');
      actionBtn.addEventListener('click', action);
    }

    if (!persistent) {
      const closeBtn = notification.querySelector('.pwa-notification__close');
      closeBtn.addEventListener('click', () => this.hideNotification(type));
      
      if (timeout) {
        setTimeout(() => this.hideNotification(type), timeout);
      }
    }

    return notification;
  }

  showNotification(notification) {
    let container = document.getElementById('pwa-notifications');
    if (!container) {
      container = document.createElement('div');
      container.id = 'pwa-notifications';
      container.className = 'pwa-notifications';
      document.body.appendChild(container);
    }

    container.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('pwa-notification--visible');
    });
  }

  hideNotification(type) {
    const notification = document.querySelector(`.pwa-notification--${type}`);
    if (notification) {
      notification.classList.remove('pwa-notification--visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  // Utility methods
  navigateToSection(section) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openResume() {
    window.open('/resume.pdf', '_blank');
  }

  // Public API methods
  async enableOfflineMode() {
    if (!this.swRegistration) {
      Logger.warning('Service worker not available for offline mode');
      return false;
    }

    try {
      // Cache critical resources
      this.sendMessageToSW({ type: 'CACHE_CRITICAL_RESOURCES' });
      this.debug('Offline mode enabled');
      return true;
    } catch (error) {
      Logger.error('Failed to enable offline mode:', error);
      return false;
    }
  }

  getInstallationStatus() {
    return {
      canInstall: this.canInstall,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches,
      hasUpdate: this.hasUpdate
    };
  }

  getCacheStatus() {
    return this.sendMessageToSW({ type: 'GET_CACHE_STATUS' });
  }

  clearCache() {
    return this.sendMessageToSW({ type: 'CLEAR_CACHE' });
  }

  static checkSupport() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'PushManager' in window,
      backgroundSync: 'sync' in window.ServiceWorkerRegistration.prototype,
      installPrompt: 'BeforeInstallPromptEvent' in window,
      fileSystem: 'showSaveFilePicker' in window
    };
  }
}

// Singleton instance
let pwaOptimizationInstance = null;

export function initPWAOptimization() {
  if (pwaOptimizationInstance) {
    Logger.warning('PWA Optimization already initialized');
    return pwaOptimizationInstance;
  }

  try {
    pwaOptimizationInstance = new PWAOptimizationManager();
    pwaOptimizationInstance.init();
    
    // Make globally accessible
    window.pwaOptimization = pwaOptimizationInstance;
    
    return pwaOptimizationInstance;
    
  } catch (error) {
    Logger.error('Failed to initialize PWA Optimization:', error);
    return null;
  }
}

export { PWAOptimizationManager };
export default { initPWAOptimization, PWAOptimizationManager };