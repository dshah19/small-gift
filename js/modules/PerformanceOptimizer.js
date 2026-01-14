/**
 * Performance Optimizer Module
 * Handles lazy loading, preloading, and performance monitoring
 */

export class PerformanceOptimizer {
    constructor() {
        this.preloadedImages = new Map();
        this.lazyLoadObserver = null;
        this.performanceMetrics = {
            pageLoadTime: 0,
            puzzleLoadTime: 0,
            renderTime: 0,
            animationFrameTime: 0
        };
    }
    
    /**
     * Initialize performance monitoring
     */
    initializeMonitoring() {
        // Record page load time
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const pageLoadTime = window.performance.timing.loadEventEnd - 
                                    window.performance.timing.navigationStart;
                this.performanceMetrics.pageLoadTime = pageLoadTime;
                console.log(`Page load time: ${pageLoadTime}ms`);
                
                // Log warning if page load exceeds 2 seconds
                if (pageLoadTime > 2000) {
                    console.warn(`⚠️ Page load time exceeds 2 seconds: ${pageLoadTime}ms`);
                }
            });
        }
    }
    
    /**
     * Preload images for puzzles
     * @param {Array<string>} imageUrls - URLs of images to preload
     */
    preloadImages(imageUrls) {
        return Promise.all(imageUrls.map(url => this.preloadImage(url)));
    }
    
    /**
     * Preload a single image
     * @param {string} url - URL of image to preload
     */
    preloadImage(url) {
        return new Promise((resolve, reject) => {
            // Check if already preloaded
            if (this.preloadedImages.has(url)) {
                resolve(this.preloadedImages.get(url));
                return;
            }
            
            const img = new Image();
            img.onload = () => {
                this.preloadedImages.set(url, img);
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to preload image: ${url}`);
                reject(new Error(`Failed to preload image: ${url}`));
            };
            img.src = url;
        });
    }
    
    /**
     * Setup lazy loading for images
     * @param {HTMLElement} container - Container element to observe
     */
    setupLazyLoading(container) {
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages(container);
            return;
        }
        
        const images = container.querySelectorAll('img[data-src]');
        
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        this.lazyLoadObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => this.lazyLoadObserver.observe(img));
    }
    
    /**
     * Fallback: Load all images immediately
     * @param {HTMLElement} container - Container element
     */
    loadAllImages(container) {
        const images = container.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
    
    /**
     * Preload puzzle content before gameplay
     * @param {Array<Object>} puzzles - Array of puzzle objects
     */
    async preloadPuzzleContent(puzzles) {
        const imageUrls = puzzles
            .filter(puzzle => puzzle.imageUrl)
            .map(puzzle => puzzle.imageUrl);
        
        if (imageUrls.length > 0) {
            try {
                await this.preloadImages(imageUrls);
                console.log(`✓ Preloaded ${imageUrls.length} puzzle images`);
            } catch (error) {
                console.warn('Some puzzle images failed to preload:', error);
            }
        }
    }
    
    /**
     * Measure render performance
     * @param {Function} renderFn - Function to measure
     * @returns {number} Time taken in milliseconds
     */
    measureRenderTime(renderFn) {
        const startTime = performance.now();
        renderFn();
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        this.performanceMetrics.renderTime = renderTime;
        
        if (renderTime > 16.67) { // 60fps threshold
            console.warn(`⚠️ Render time exceeds 60fps threshold: ${renderTime.toFixed(2)}ms`);
        }
        
        return renderTime;
    }
    
    /**
     * Measure animation frame performance
     * @param {Function} animationFn - Animation function to measure
     */
    measureAnimationFrame(animationFn) {
        const startTime = performance.now();
        
        requestAnimationFrame(() => {
            animationFn();
            const endTime = performance.now();
            const frameTime = endTime - startTime;
            
            this.performanceMetrics.animationFrameTime = frameTime;
            
            if (frameTime > 16.67) { // 60fps threshold
                console.warn(`⚠️ Animation frame time exceeds 60fps threshold: ${frameTime.toFixed(2)}ms`);
            }
        });
    }
    
    /**
     * Get performance metrics
     * @returns {Object} Performance metrics object
     */
    getMetrics() {
        return { ...this.performanceMetrics };
    }
    
    /**
     * Log performance report
     */
    logPerformanceReport() {
        console.log('📊 Performance Report:');
        console.log(`Page Load Time: ${this.performanceMetrics.pageLoadTime}ms`);
        console.log(`Puzzle Load Time: ${this.performanceMetrics.puzzleLoadTime}ms`);
        console.log(`Average Render Time: ${this.performanceMetrics.renderTime.toFixed(2)}ms`);
        console.log(`Animation Frame Time: ${this.performanceMetrics.animationFrameTime.toFixed(2)}ms`);
    }
    
    /**
     * Cleanup lazy load observer
     */
    cleanup() {
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.disconnect();
        }
    }
}
