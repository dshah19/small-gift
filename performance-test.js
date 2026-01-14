/**
 * Performance Testing Script
 * Tests page load time, asset sizes, and rendering performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
}

/**
 * Analyze CSS file
 */
function analyzeCSS() {
    console.log('\n📊 CSS Analysis:');
    const cssPath = path.join(__dirname, 'css', 'styles.css');
    const size = getFileSizeKB(cssPath);
    console.log(`  Original size: ${size} KB`);
    
    // Check for minified version
    const minPath = path.join(__dirname, 'dist', 'css', 'styles.min.css');
    if (fs.existsSync(minPath)) {
        const minSize = getFileSizeKB(minPath);
        const reduction = ((1 - minSize / size) * 100).toFixed(2);
        console.log(`  Minified size: ${minSize} KB`);
        console.log(`  Reduction: ${reduction}%`);
    }
}

/**
 * Analyze JavaScript files
 */
function analyzeJavaScript() {
    console.log('\n📊 JavaScript Analysis:');
    const jsDir = path.join(__dirname, 'js');
    let totalSize = 0;
    let totalMinSize = 0;
    
    function walkDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                walkDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')) {
                const size = getFileSizeKB(fullPath);
                totalSize += parseFloat(size);
                console.log(`  ${entry.name}: ${size} KB`);
            }
        }
    }
    
    walkDir(jsDir);
    console.log(`  Total: ${totalSize.toFixed(2)} KB`);
    
    // Check minified versions
    const distJsDir = path.join(__dirname, 'dist', 'js');
    if (fs.existsSync(distJsDir)) {
        function walkMinDir(dir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    walkMinDir(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.min.js')) {
                    const size = getFileSizeKB(fullPath);
                    totalMinSize += parseFloat(size);
                }
            }
        }
        
        walkMinDir(distJsDir);
        const reduction = ((1 - totalMinSize / totalSize) * 100).toFixed(2);
        console.log(`  Minified total: ${totalMinSize.toFixed(2)} KB`);
        console.log(`  Reduction: ${reduction}%`);
    }
}

/**
 * Analyze HTML file
 */
function analyzeHTML() {
    console.log('\n📊 HTML Analysis:');
    const htmlPath = path.join(__dirname, 'index.html');
    const size = getFileSizeKB(htmlPath);
    console.log(`  Original size: ${size} KB`);
    
    // Check for optimized version
    const distPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(distPath)) {
        const distSize = getFileSizeKB(distPath);
        console.log(`  Optimized size: ${distSize} KB`);
    }
}

/**
 * Estimate page load time
 */
function estimatePageLoadTime() {
    console.log('\n⏱️  Estimated Page Load Time:');
    
    const cssPath = path.join(__dirname, 'dist', 'css', 'styles.min.css');
    const jsPath = path.join(__dirname, 'dist', 'js', 'main.min.js');
    
    let cssSize = 0;
    let jsSize = 0;
    
    if (fs.existsSync(cssPath)) {
        cssSize = parseFloat(getFileSizeKB(cssPath));
    }
    if (fs.existsSync(jsPath)) {
        jsSize = parseFloat(getFileSizeKB(jsPath));
    }
    
    // Estimate based on typical network speeds
    // 4G: ~10 Mbps = 1.25 MB/s
    const networkSpeed = 1.25; // MB/s
    const totalSize = (cssSize + jsSize) / 1024; // Convert to MB
    const estimatedTime = (totalSize / networkSpeed) * 1000; // Convert to ms
    
    console.log(`  CSS: ${cssSize} KB`);
    console.log(`  JS: ${jsSize} KB`);
    console.log(`  Total: ${(totalSize * 1024).toFixed(2)} KB`);
    console.log(`  Estimated load time (4G): ${estimatedTime.toFixed(0)}ms`);
    
    if (estimatedTime < 2000) {
        console.log(`  ✅ Meets 2-second target`);
    } else {
        console.log(`  ⚠️  Exceeds 2-second target`);
    }
}

/**
 * Generate performance report
 */
function generateReport() {
    console.log('🚀 F1 Apology Gift Game - Performance Report\n');
    console.log('=' .repeat(50));
    
    analyzeCSS();
    analyzeJavaScript();
    analyzeHTML();
    estimatePageLoadTime();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Performance analysis complete!\n');
}

// Run report
generateReport();
