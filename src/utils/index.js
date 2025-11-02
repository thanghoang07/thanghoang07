/**
 * 🛠️ Utils Index
 * Re-export all utilities from the main utilities.js file
 */

// Import all utilities from the main utilities file
export * from '../utilities.js';

// For backward compatibility, also export specific commonly used utilities
import { 
  DOMUtils, 
  PerformanceUtils, 
  DeviceUtils, 
  NetworkUtils, 
  AnimationUtils,
  StorageUtils,
  Logger,
  EventUtils
} from '../utilities.js';

// Named exports for convenience
export {
  DOMUtils,
  PerformanceUtils, 
  DeviceUtils,
  NetworkUtils,
  AnimationUtils,
  StorageUtils,
  Logger,
  EventUtils
};

// Default export
export default {
  DOMUtils,
  PerformanceUtils,
  DeviceUtils, 
  NetworkUtils,
  AnimationUtils,
  StorageUtils,
  Logger,
  EventUtils
};