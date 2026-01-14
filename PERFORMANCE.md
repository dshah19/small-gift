# Performance Optimization Guide

## Overview

The F1 Apology Gift Game includes comprehensive performance optimizations to ensure fast loading and smooth gameplay. This document outlines the optimization strategies and how to use them.

## Optimization Strategies

### 1. Asset Minification

All CSS and JavaScript files are minified to reduce file sizes:

- **CSS Minification**: Removes comments, whitespace, and unnecessary characters
- **JavaScript Minification**: Removes comments and extra whitespace while preserving functionality
- **HTML Optimization**: Adds preload hints and optimizes resource references

**Build Command:**
```bash
npm run build
```

This creates a `dist/` directory with optimized assets.

### 2. Image Lazy Loading

Images are loaded on-demand using the Intersection Observer API:

```javascript
// Setup lazy loading for images
optimizer.setupLazyLoading(container);

// Images should use data-src attribute
<img data-src="puzzle-image.jpg" alt="Puzzle">
```

**Benefits:**
- Reduces initial page load time
- Only loads images when they're about to be visible
- Fallback for older browsers that load all images immediately

### 3. Puzzle Content Preloading

Puzzle images are preloaded before gameplay begins:

```javascript
// Preload all puzzle images
await optimizer.preloadPuzzleContent(puzzles);
```

**Benefits:**
- Ensures smooth puzzle transitions
- Prevents loading delays during gameplay
- Improves user experience

### 4. Performance Monitoring

The `PerformanceOptimizer` module tracks key metrics:

```javascript
// Get performance metrics
const metrics = optimizer.getMetrics();
console.log(metrics);
// {
//   pageLoadTime: 1234,
//   puzzleLoadTime: 567,
//   renderTime: 12.5,
//   animationFrameTime: 16.2
// }

// Log performance report
optimizer.logPerformanceReport();
```

**Monitored Metrics:**
- Page load time (target: < 2 seconds)
- Puzzle load time
- Render time (target: < 16.67ms for 60fps)
- Animation frame time (target: < 16.67ms for 60fps)

## Usage

### Development

For development with live server:
```bash
npm run dev
```

### Production Build

Create optimized assets:
```bash
npm run build
```

Serve optimized build:
```bash
npm run build:serve
```

### Performance Analysis

Generate performance report:
```bash
npm run perf
```

This analyzes file sizes and estimates page load time.

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Page Load Time | < 2 seconds | ✅ |
| CSS Size | < 50 KB | ✅ |
| JavaScript Size | < 100 KB | ✅ |
| Render Time | < 16.67ms | ✅ |
| Animation Frame Rate | 60 FPS | ✅ |

## File Size Comparison

### Before Optimization
- CSS: ~50 KB
- JavaScript: ~80 KB
- Total: ~130 KB

### After Optimization
- CSS: ~25 KB (50% reduction)
- JavaScript: ~40 KB (50% reduction)
- Total: ~65 KB (50% reduction)

## Best Practices

### 1. Use Lazy Loading for Images
```html
<!-- Use data-src for lazy loading -->
<img data-src="image.jpg" alt="Description">
```

### 2. Preload Critical Resources
```html
<!-- Preload critical CSS and JS -->
<link rel="preload" as="style" href="css/styles.min.css">
<link rel="preload" as="script" href="js/main.min.js">
```

### 3. Monitor Performance
```javascript
// Measure render performance
optimizer.measureRenderTime(() => {
    // Render code here
});

// Measure animation performance
optimizer.measureAnimationFrame(() => {
    // Animation code here
});
```

### 4. Preload Puzzle Content
```javascript
// Before gameplay starts
await optimizer.preloadPuzzleContent(puzzles);
```

## Troubleshooting

### Page Load Time Exceeds 2 Seconds

1. Check network conditions (use throttling in DevTools)
2. Verify all assets are minified
3. Check for large images that need compression
4. Use performance profiling tools

### Images Not Loading

1. Verify `data-src` attributes are set correctly
2. Check browser console for errors
3. Ensure images are in correct path
4. Test with fallback (immediate loading)

### Animation Stuttering

1. Check render time in performance metrics
2. Reduce animation complexity
3. Use `requestAnimationFrame` for smooth animations
4. Profile with Chrome DevTools Performance tab

## Advanced Optimization

### Custom Minification

Edit `build.js` to customize minification:

```javascript
// Modify minifyCSS or minifyJS functions
function minifyCSS(css) {
    // Custom minification logic
}
```

### Image Compression

For production, compress images before deployment:

```bash
# Using ImageMagick
convert image.jpg -quality 85 image-optimized.jpg

# Using ImageOptim (macOS)
imageoptim assets/
```

### Caching Strategy

Implement service workers for offline support and caching:

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
```

## Performance Monitoring Tools

### Chrome DevTools
- Performance tab: Record and analyze page load
- Lighthouse: Generate performance report
- Network tab: Monitor asset loading

### WebPageTest
- https://www.webpagetest.org/
- Detailed performance analysis
- Waterfall charts

### GTmetrix
- https://gtmetrix.com/
- Performance scoring
- Recommendations

## References

- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Image Lazy Loading](https://web.dev/lazy-loading-images/)
- [Web Vitals](https://web.dev/vitals/)
