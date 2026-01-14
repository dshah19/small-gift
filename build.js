/**
 * Build script for F1 Apology Gift Game
 * Handles minification, optimization, and asset processing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Minify CSS by removing comments, extra whitespace, and unnecessary characters
 */
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove newlines and extra spaces
        .replace(/\s+/g, ' ')
        // Remove spaces around special characters
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim();
}

/**
 * Minify JavaScript by removing comments and extra whitespace
 * Note: This is a simple minifier. For production, use a proper tool like terser
 */
function minifyJS(js) {
    return js
        // Remove single-line comments
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around operators and special characters
        .replace(/\s*([{}()[\];:,=+\-*/<>!&|?])\s*/g, '$1')
        // Remove spaces after keywords
        .replace(/\b(if|else|for|while|function|return|const|let|var|import|export|from|as)\s+/g, '$1 ')
        // Remove leading/trailing whitespace
        .trim();
}

/**
 * Generate a performance report
 */
function generatePerformanceReport(originalSize, minifiedSize, filename) {
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
    const savedBytes = (originalSize - minifiedSize).toFixed(0);
    
    console.log(`✓ ${filename}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Minified: ${(minifiedSize / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}% (${(savedBytes / 1024).toFixed(2)} KB saved)`);
}

/**
 * Build and optimize the project
 */
async function build() {
    console.log('🚀 Starting F1 Apology Gift Game build...\n');
    
    try {
        // Create dist directory if it doesn't exist
        const distDir = path.join(__dirname, 'dist');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
        
        // Minify CSS
        console.log('📦 Optimizing CSS...');
        const cssPath = path.join(__dirname, 'css', 'styles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        const minifiedCSS = minifyCSS(cssContent);
        const cssDistPath = path.join(distDir, 'styles.min.css');
        fs.writeFileSync(cssDistPath, minifiedCSS);
        generatePerformanceReport(cssContent.length, minifiedCSS.length, 'styles.css');
        
        // Minify JavaScript files
        console.log('\n📦 Optimizing JavaScript...');
        const jsDir = path.join(__dirname, 'js');
        const jsFiles = getAllJSFiles(jsDir);
        
        let totalOriginalSize = 0;
        let totalMinifiedSize = 0;
        
        for (const file of jsFiles) {
            const jsContent = fs.readFileSync(file, 'utf-8');
            const minifiedJS = minifyJS(jsContent);
            const relativePath = path.relative(__dirname, file);
            const distPath = path.join(distDir, relativePath.replace(/\.js$/, '.min.js'));
            
            // Create directory if needed
            fs.mkdirSync(path.dirname(distPath), { recursive: true });
            fs.writeFileSync(distPath, minifiedJS);
            
            totalOriginalSize += jsContent.length;
            totalMinifiedSize += minifiedJS.length;
            
            generatePerformanceReport(jsContent.length, minifiedJS.length, relativePath);
        }
        
        // Copy HTML with optimization
        console.log('\n📦 Optimizing HTML...');
        const htmlPath = path.join(__dirname, 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        
        // Add lazy loading attributes and preload hints
        htmlContent = htmlContent
            .replace(/<link rel="stylesheet" href="css\/styles.css">/,
                '<link rel="stylesheet" href="css/styles.min.css">')
            .replace(/<script src="js\/main.js" type="module"><\/script>/,
                '<script src="js/main.min.js" type="module" defer></script>');
        
        // Add preload for critical resources
        const preloadHints = `
    <link rel="preload" as="style" href="css/styles.min.css">
    <link rel="preload" as="script" href="js/main.min.js">
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">`;
        
        htmlContent = htmlContent.replace('</head>', preloadHints + '\n</head>');
        
        const htmlDistPath = path.join(distDir, 'index.html');
        fs.writeFileSync(htmlDistPath, htmlContent);
        generatePerformanceReport(fs.readFileSync(htmlPath, 'utf-8').length, htmlContent.length, 'index.html');
        
        // Copy assets
        console.log('\n📦 Copying assets...');
        const assetsDir = path.join(__dirname, 'assets');
        const assetsDistDir = path.join(distDir, 'assets');
        if (fs.existsSync(assetsDir)) {
            copyDirectory(assetsDir, assetsDistDir);
            console.log('✓ Assets copied');
        }
        
        // Generate performance metrics
        console.log('\n📊 Build Summary:');
        console.log(`Total JavaScript Original: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
        console.log(`Total JavaScript Minified: ${(totalMinifiedSize / 1024).toFixed(2)} KB`);
        console.log(`Total Reduction: ${((1 - totalMinifiedSize / totalOriginalSize) * 100).toFixed(2)}%`);
        
        console.log('\n✅ Build complete! Output in ./dist/');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

/**
 * Get all JavaScript files in a directory
 */
function getAllJSFiles(dir) {
    const files = [];
    
    function walk(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')) {
                files.push(fullPath);
            }
        }
    }
    
    walk(dir);
    return files;
}

/**
 * Copy directory recursively
 */
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Run build
build();
