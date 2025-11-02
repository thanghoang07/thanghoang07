/**
 * 🧪 Responsive & Animation Test Suite
 * Comprehensive testing for unified features
 */

// Test Configuration
const TEST_CONFIG = {
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        large: 1200
    },
    animations: {
        duration: 300,
        easing: 'ease-in-out'
    },
    performance: {
        maxLoadTime: 3000,
        maxAnimationTime: 1000
    }
};

class ResponsiveAnimationTester {
    constructor() {
        this.results = {
            responsive: {},
            animations: {},
            performance: {},
            interactions: {}
        };
        
        this.init();
    }
    
    init() {
        console.log('🧪 Starting Responsive & Animation Tests...');
        
        // Wait for DOM and unified features to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runTests());
        } else {
            this.runTests();
        }
    }
    
    async runTests() {
        try {
            await this.testResponsiveDesign();
            await this.testAnimations();
            await this.testPerformance();
            await this.testInteractions();
            await this.testUnifiedFeatures();
            
            this.displayResults();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }
    
    // Responsive Design Tests
    async testResponsiveDesign() {
        console.log('📱 Testing Responsive Design...');
        
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
        
        // Determine current breakpoint
        let breakpoint = 'mobile';
        if (viewport.width >= TEST_CONFIG.breakpoints.large) breakpoint = 'large';
        else if (viewport.width >= TEST_CONFIG.breakpoints.desktop) breakpoint = 'desktop';
        else if (viewport.width >= TEST_CONFIG.breakpoints.tablet) breakpoint = 'tablet';
        
        // Test grid layouts
        const gridElements = document.querySelectorAll('.grid, .test-grid, [class*="grid"]');
        const gridResponsive = Array.from(gridElements).every(grid => {
            const computedStyle = window.getComputedStyle(grid);
            return computedStyle.display === 'grid' || computedStyle.display === 'flex';
        });
        
        // Test image responsiveness
        const images = document.querySelectorAll('img');
        const imagesResponsive = Array.from(images).every(img => {
            const style = window.getComputedStyle(img);
            return style.maxWidth === '100%' || img.hasAttribute('srcset');
        });
        
        // Test text scaling
        const textElements = document.querySelectorAll('h1, h2, h3, p');
        const textScales = Array.from(textElements).some(el => {
            const style = window.getComputedStyle(el);
            return style.fontSize.includes('rem') || style.fontSize.includes('em') || style.fontSize.includes('vw');
        });
        
        this.results.responsive = {
            viewport,
            breakpoint,
            gridResponsive,
            imagesResponsive,
            textScales,
            score: this.calculateResponsiveScore(gridResponsive, imagesResponsive, textScales)
        };
        
        console.log('✅ Responsive tests completed:', this.results.responsive);
    }
    
    // Animation Tests
    async testAnimations() {
        console.log('🎭 Testing Animations...');
        
        // Test CSS Animation support
        const supportsAnimations = CSS.supports('animation', 'bounce 1s');
        const supportsTransforms = CSS.supports('transform', 'translateY(0)');
        const supportsTransitions = CSS.supports('transition', 'all 0.3s ease');
        
        // Test scroll animations
        const scrollElements = document.querySelectorAll('[data-scroll-trigger], .scroll-reveal, [class*="fade"], [class*="slide"]');
        const hasScrollAnimations = scrollElements.length > 0;
        
        // Test hover effects
        const hoverElements = document.querySelectorAll('[data-hover-effect], .card, .button, [class*="hover"]');
        const hasHoverEffects = hoverElements.length > 0;
        
        // Test performance of animations
        const animationPerformance = await this.testAnimationPerformance();
        
        // Test reduced motion preference
        const respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.results.animations = {
            support: {
                animations: supportsAnimations,
                transforms: supportsTransforms,
                transitions: supportsTransitions
            },
            elements: {
                scrollAnimations: hasScrollAnimations,
                hoverEffects: hasHoverEffects,
                scrollCount: scrollElements.length,
                hoverCount: hoverElements.length
            },
            performance: animationPerformance,
            accessibility: {
                respectsReducedMotion,
                hasReducedMotionStyles: this.checkReducedMotionStyles()
            },
            score: this.calculateAnimationScore(supportsAnimations, hasScrollAnimations, animationPerformance.smooth)
        };
        
        console.log('✅ Animation tests completed:', this.results.animations);
    }
    
    // Performance Tests
    async testPerformance() {
        console.log('⚡ Testing Performance...');
        
        const startTime = performance.now();
        
        // Test load performance
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTimes = {
            domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
            loadComplete: navigation?.loadEventEnd || 0,
            firstPaint: 0,
            firstContentfulPaint: 0
        };
        
        // Get paint metrics
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            if (entry.name === 'first-paint') {
                loadTimes.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
                loadTimes.firstContentfulPaint = entry.startTime;
            }
        });
        
        // Test JavaScript execution time
        const jsExecutionTime = performance.now() - startTime;
        
        // Test memory usage (if available)
        const memoryInfo = performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        } : null;
        
        // Test frame rate
        const frameRate = await this.testFrameRate();
        
        this.results.performance = {
            loadTimes,
            jsExecutionTime,
            memoryInfo,
            frameRate,
            score: this.calculatePerformanceScore(loadTimes, frameRate, jsExecutionTime)
        };
        
        console.log('✅ Performance tests completed:', this.results.performance);
    }
    
    // Interaction Tests
    async testInteractions() {
        console.log('🎯 Testing Interactions...');
        
        // Test click interactions
        const clickableElements = document.querySelectorAll('button, a, [onclick], [data-click]');
        const clickableCount = clickableElements.length;
        
        // Test keyboard navigation
        const focusableElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]');
        const keyboardAccessible = focusableElements.length > 0;
        
        // Test touch interactions
        const touchElements = document.querySelectorAll('[data-touch], [data-swipe], [data-pinch]');
        const hasTouchSupport = 'ontouchstart' in window;
        
        // Test micro-interactions
        const microInteractionElements = document.querySelectorAll('[data-ripple], [data-magnetic], [data-hover-effect]');
        const hasMicroInteractions = microInteractionElements.length > 0;
        
        this.results.interactions = {
            clickable: {
                count: clickableCount,
                responsive: this.testClickResponsiveness(clickableElements)
            },
            keyboard: {
                accessible: keyboardAccessible,
                focusableCount: focusableElements.length
            },
            touch: {
                supported: hasTouchSupport,
                elements: touchElements.length
            },
            microInteractions: {
                available: hasMicroInteractions,
                count: microInteractionElements.length
            },
            score: this.calculateInteractionScore(clickableCount, keyboardAccessible, hasMicroInteractions)
        };
        
        console.log('✅ Interaction tests completed:', this.results.interactions);
    }
    
    // Test Unified Features
    async testUnifiedFeatures() {
        console.log('🚀 Testing Unified Features...');
        
        // Check for unified managers
        const unifiedFeatures = {
            performance: window.unifiedPerformanceManager || window.UnifiedPerformanceManager,
            system: window.unifiedSystemManager || window.UnifiedSystemManager,
            interactions: window.unifiedInteractions || window.UnifiedInteractionsManager
        };
        
        // Test each unified system
        const systemStatus = {};
        
        if (unifiedFeatures.performance) {
            systemStatus.performance = {
                available: true,
                status: unifiedFeatures.performance.getStatus?.() || 'Active'
            };
        }
        
        if (unifiedFeatures.system) {
            systemStatus.system = {
                available: true,
                status: unifiedFeatures.system.getSystemStatus?.() || 'Active'
            };
        }
        
        if (unifiedFeatures.interactions) {
            systemStatus.interactions = {
                available: true,
                status: unifiedFeatures.interactions.getStatus?.() || 'Active'
            };
        }
        
        this.results.unifiedFeatures = {
            systems: systemStatus,
            loadedCount: Object.keys(systemStatus).length,
            allLoaded: Object.keys(systemStatus).length === 3,
            score: this.calculateUnifiedScore(systemStatus)
        };
        
        console.log('✅ Unified features tests completed:', this.results.unifiedFeatures);
    }
    
    // Helper Methods
    async testAnimationPerformance() {
        return new Promise((resolve) => {
            let frameCount = 0;
            let startTime = performance.now();
            
            function countFrames() {
                frameCount++;
                if (frameCount < 60) {
                    requestAnimationFrame(countFrames);
                } else {
                    const endTime = performance.now();
                    const duration = endTime - startTime;
                    const fps = Math.round((frameCount * 1000) / duration);
                    
                    resolve({
                        fps,
                        smooth: fps >= 55,
                        duration
                    });
                }
            }
            
            requestAnimationFrame(countFrames);
        });
    }
    
    async testFrameRate() {
        return new Promise((resolve) => {
            let frames = 0;
            const startTime = Date.now();
            
            function frame() {
                frames++;
                if (Date.now() - startTime < 1000) {
                    requestAnimationFrame(frame);
                } else {
                    resolve(frames);
                }
            }
            
            requestAnimationFrame(frame);
        });
    }
    
    testClickResponsiveness(elements) {
        return Array.from(elements).every(el => {
            const style = window.getComputedStyle(el);
            return style.cursor === 'pointer' || el.style.cursor === 'pointer';
        });
    }
    
    checkReducedMotionStyles() {
        const stylesheets = Array.from(document.styleSheets);
        return stylesheets.some(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules || []);
                return rules.some(rule => 
                    rule.cssText && rule.cssText.includes('prefers-reduced-motion')
                );
            } catch (e) {
                return false; // Cross-origin stylesheets
            }
        });
    }
    
    // Scoring Methods
    calculateResponsiveScore(grid, images, text) {
        let score = 0;
        if (grid) score += 40;
        if (images) score += 30;
        if (text) score += 30;
        return score;
    }
    
    calculateAnimationScore(animations, scroll, smooth) {
        let score = 0;
        if (animations) score += 30;
        if (scroll) score += 35;
        if (smooth) score += 35;
        return score;
    }
    
    calculatePerformanceScore(loadTimes, frameRate, jsTime) {
        let score = 0;
        if (loadTimes.firstContentfulPaint < 2000) score += 40;
        if (frameRate >= 55) score += 35;
        if (jsTime < 100) score += 25;
        return score;
    }
    
    calculateInteractionScore(clickable, keyboard, micro) {
        let score = 0;
        if (clickable > 0) score += 30;
        if (keyboard) score += 35;
        if (micro) score += 35;
        return score;
    }
    
    calculateUnifiedScore(systems) {
        const availableCount = Object.keys(systems).length;
        return Math.round((availableCount / 3) * 100);
    }
    
    // Results Display
    displayResults() {
        console.log('\n🏆 FINAL TEST RESULTS:');
        console.log('========================');
        
        const overallScore = Math.round(
            (this.results.responsive.score + 
             this.results.animations.score + 
             this.results.performance.score + 
             this.results.interactions.score +
             (this.results.unifiedFeatures?.score || 0)) / 5
        );
        
        console.log(`📊 Overall Score: ${overallScore}/100`);
        console.log(`📱 Responsive: ${this.results.responsive.score}/100`);
        console.log(`🎭 Animations: ${this.results.animations.score}/100`);
        console.log(`⚡ Performance: ${this.results.performance.score}/100`);
        console.log(`🎯 Interactions: ${this.results.interactions.score}/100`);
        console.log(`🚀 Unified Features: ${this.results.unifiedFeatures?.score || 0}/100`);
        
        // Display detailed results
        this.displayDetailedResults();
        
        // Create summary
        this.createResultsSummary(overallScore);
    }
    
    displayDetailedResults() {
        console.log('\n📱 RESPONSIVE DETAILS:');
        console.log(`Current breakpoint: ${this.results.responsive.breakpoint}`);
        console.log(`Viewport: ${this.results.responsive.viewport.width}x${this.results.responsive.viewport.height}`);
        console.log(`Grid responsive: ${this.results.responsive.gridResponsive ? '✅' : '❌'}`);
        console.log(`Images responsive: ${this.results.responsive.imagesResponsive ? '✅' : '❌'}`);
        console.log(`Text scales: ${this.results.responsive.textScales ? '✅' : '❌'}`);
        
        console.log('\n🎭 ANIMATION DETAILS:');
        console.log(`CSS Animations: ${this.results.animations.support.animations ? '✅' : '❌'}`);
        console.log(`Transforms: ${this.results.animations.support.transforms ? '✅' : '❌'}`);
        console.log(`Transitions: ${this.results.animations.support.transitions ? '✅' : '❌'}`);
        console.log(`Scroll animations: ${this.results.animations.elements.scrollCount} elements`);
        console.log(`Hover effects: ${this.results.animations.elements.hoverCount} elements`);
        console.log(`Animation FPS: ${this.results.animations.performance.fps}`);
        
        console.log('\n⚡ PERFORMANCE DETAILS:');
        console.log(`First Contentful Paint: ${Math.round(this.results.performance.loadTimes.firstContentfulPaint)}ms`);
        console.log(`DOM Content Loaded: ${Math.round(this.results.performance.loadTimes.domContentLoaded)}ms`);
        console.log(`Frame Rate: ${this.results.performance.frameRate} FPS`);
        console.log(`JS Execution: ${Math.round(this.results.performance.jsExecutionTime)}ms`);
        
        if (this.results.unifiedFeatures) {
            console.log('\n🚀 UNIFIED FEATURES:');
            console.log(`Systems loaded: ${this.results.unifiedFeatures.loadedCount}/3`);
            console.log(`All systems active: ${this.results.unifiedFeatures.allLoaded ? '✅' : '⚠️'}`);
        }
    }
    
    createResultsSummary(overallScore) {
        const summary = {
            timestamp: new Date().toISOString(),
            overallScore,
            results: this.results,
            recommendations: this.generateRecommendations()
        };
        
        // Store in sessionStorage for access from dev tools
        sessionStorage.setItem('testResults', JSON.stringify(summary, null, 2));
        
        console.log('\n💡 RECOMMENDATIONS:');
        summary.recommendations.forEach(rec => console.log(`• ${rec}`));
        
        console.log('\n🔧 Access full results: sessionStorage.getItem("testResults")');
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.results.responsive.score < 80) {
            recommendations.push('Improve responsive design with better grid systems and image optimization');
        }
        
        if (this.results.animations.score < 80) {
            recommendations.push('Add more scroll animations and hover effects for better UX');
        }
        
        if (this.results.performance.score < 80) {
            recommendations.push('Optimize loading times and JavaScript execution performance');
        }
        
        if (this.results.interactions.score < 80) {
            recommendations.push('Enhance micro-interactions and keyboard accessibility');
        }
        
        if (!this.results.unifiedFeatures?.allLoaded) {
            recommendations.push('Ensure all unified feature systems are properly loaded');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Excellent! All systems are performing optimally 🎉');
        }
        
        return recommendations;
    }
}

// Auto-run tests when loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        new ResponsiveAnimationTester();
    }, 1000);
});

// Make tester available globally
window.ResponsiveAnimationTester = ResponsiveAnimationTester;