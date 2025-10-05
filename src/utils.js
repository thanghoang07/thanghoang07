// Constants for better maintainability
export const ANIMATION_CONFIG = {
  DURATION: 2000,
  TYPING_SPEED: 100,
  TYPING_DELAY: 500,
  CURSOR_DELAY: 1000,
  SCROLL_THRESHOLD: 0.1,
  SCROLL_MARGIN: '0px 0px -50px 0px',
  PARALLAX_SPEED: 0.5
};

export const ANIMATION_CLASSES = {
  FADE_IN_UP: 'fade-in-up',
  FADE_IN_LEFT: 'fade-in-left',
  FADE_IN_RIGHT: 'fade-in-right',
  FADE_IN_SCALE: 'fade-in-scale',
  SLIDE_IN_UP: 'slide-in-up',
  SLIDE_IN_DOWN: 'slide-in-down',
  STAGGER_1: 'stagger-1',
  STAGGER_2: 'stagger-2',
  STAGGER_3: 'stagger-3',
  STAGGER_4: 'stagger-4',
  STAGGER_5: 'stagger-5'
};

// Utility function to reset animation classes
export function resetAnimationClasses(element) {
  const classesToRemove = [
    ANIMATION_CLASSES.FADE_IN_UP,
    ANIMATION_CLASSES.FADE_IN_LEFT,
    ANIMATION_CLASSES.FADE_IN_RIGHT,
    ANIMATION_CLASSES.FADE_IN_SCALE,
    ANIMATION_CLASSES.SLIDE_IN_UP,
    ANIMATION_CLASSES.SLIDE_IN_DOWN,
    ANIMATION_CLASSES.STAGGER_1,
    ANIMATION_CLASSES.STAGGER_2,
    ANIMATION_CLASSES.STAGGER_3,
    ANIMATION_CLASSES.STAGGER_4,
    ANIMATION_CLASSES.STAGGER_5
  ];

  element.classList.remove(...classesToRemove);
}

// Utility for debouncing
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
