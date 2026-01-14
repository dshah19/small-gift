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
    console.log('🚀 Starting Small Gift build...\n');
    
    try {
        // Create dist directory if it doesn't exist
        const distDir = path.join(__dirname, 'dist');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
        
        // Copy CSS
        console.log('📦 Copying CSS...');
        const cssPath = path.join(__dirname, 'css', 'styles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        const cssDistPath = path.join(distDir, 'css', 'styles.css');
        fs.mkdirSync(path.dirname(cssDistPath), { recursive: true });
        fs.writeFileSync(cssDistPath, cssContent);
        console.log(`✓ styles.css (${(cssContent.length / 1024).toFixed(2)} KB)`);
        
        // Copy JavaScript files
        console.log('\n📦 Copying JavaScript...');
        const jsDir = path.join(__dirname, 'js');
        const jsFiles = getAllJSFiles(jsDir);
        
        for (const file of jsFiles) {
            const jsContent = fs.readFileSync(file, 'utf-8');
            const relativePath = path.relative(__dirname, file);
            const distPath = path.join(distDir, relativePath);
            
            // Create directory if needed
            fs.mkdirSync(path.dirname(distPath), { recursive: true });
            fs.writeFileSync(distPath, jsContent);
            
            console.log(`✓ ${relativePath} (${(jsContent.length / 1024).toFixed(2)} KB)`);
        }
        
        // Copy HTML
        console.log('\n📦 Copying HTML...');
        const htmlPath = path.join(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        const htmlDistPath = path.join(distDir, 'index.html');
        fs.writeFileSync(htmlDistPath, htmlContent);
        console.log(`✓ index.html (${(htmlContent.length / 1024).toFixed(2)} KB)`);
        
        // Copy assets
        console.log('\n📦 Copying assets...');
        const assetsDir = path.join(__dirname, 'assets');
        const assetsDistDir = path.join(distDir, 'assets');
        if (fs.existsSync(assetsDir)) {
            copyDirectory(assetsDir, assetsDistDir);
            console.log('✓ Assets copied');
        }
        
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
