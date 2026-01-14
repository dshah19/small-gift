/**
 * Unit Tests for AnimationEngine
 * 
 * Tests the animation functionality including:
 * - Car movement animation with requestAnimationFrame
 * - Checkered flag animation for completion
 * - Confetti animation for celebration
 * - Puzzle transition animations
 * - Progress bar animations
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { AnimationEngine } from './AnimationEngine.js';

// Setup jsdom environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Mock requestAnimationFrame for testing
let rafCallbacks = [];
global.requestAnimationFrame = (callback) => {
    rafCallbacks.push(callback);
    // Execute immediately with current timestamp
    setTimeout(() => {
        callback(performance.now());
    }, 0);
    return rafCallbacks.length;
};

global.cancelAnimationFrame = (id) => {
    rafCallbacks[id - 1] = null;
};

describe('AnimationEngine', () => {
    let animationEngine;
    let container;
    
    beforeEach(() => {
        animationEngine = new AnimationEngine();
        
        // Setup DOM for testing
        container = document.createElement('div');
        container.id = 'app';
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        // Cleanup
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        vi.clearAllTimers();
    });
    
    describe('Car Movement Animation', () => {
        it('should animate car movement from start to end position', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const animationPromise = animationEngine.animateCarMovement(0, 50, 100);
            await animationPromise;
            
            expect(parseFloat(car.style.left)).toBe(50);
        });
        
        it('should complete animation promise when finished', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const animationPromise = animationEngine.animateCarMovement(0, 100, 100);
            
            await expect(animationPromise).resolves.toBeUndefined();
        });
        
        it('should handle missing car element gracefully', async () => {
            const animationPromise = animationEngine.animateCarMovement(0, 50, 100);
            
            await expect(animationPromise).resolves.toBeUndefined();
        });
        
        it('should animate from any position to any position', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '25%';
            container.appendChild(car);
            
            const animationPromise = animationEngine.animateCarMovement(25, 75, 100);
            await animationPromise;
            
            expect(parseFloat(car.style.left)).toBe(75);
        });
        
        it('should handle zero duration animation', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const animationPromise = animationEngine.animateCarMovement(0, 50, 0);
            await animationPromise;
            
            expect(parseFloat(car.style.left)).toBe(50);
        });
        
        it('should use default duration of 500ms for car movement', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const animationPromise = animationEngine.animateCarMovement(0, 100);
            await animationPromise;
            
            expect(parseFloat(car.style.left)).toBe(100);
        }, { timeout: 10000 });
    });
    
    describe('Checkered Flag Animation', () => {
        it('should create and animate checkered flag', async () => {
            const animationPromise = animationEngine.animateCheckeredFlag();
            
            let flag = document.querySelector('.checkered-flag-animation');
            expect(flag).not.toBeNull();
            expect(flag.textContent).toBe('🏁');
            
            await animationPromise;
            
            flag = document.querySelector('.checkered-flag-animation');
            expect(flag).toBeNull();
        }, { timeout: 5000 });
        
        it('should resolve promise after animation completes', async () => {
            const animationPromise = animationEngine.animateCheckeredFlag();
            
            await expect(animationPromise).resolves.toBeUndefined();
        }, { timeout: 5000 });
        
        it('should add flag to document body', async () => {
            const animationPromise = animationEngine.animateCheckeredFlag();
            
            const flag = document.querySelector('.checkered-flag-animation');
            expect(flag.parentNode).toBe(document.body);
            
            await animationPromise;
        }, { timeout: 5000 });
    });
    
    describe('Confetti Animation', () => {
        it('should create multiple confetti pieces', async () => {
            const animationPromise = animationEngine.animateConfetti();
            
            const confettiPieces = document.querySelectorAll('.confetti');
            expect(confettiPieces.length).toBe(50);
            
            await animationPromise;
        }, { timeout: 5000 });
        
        it('should remove all confetti after animation', async () => {
            const animationPromise = animationEngine.animateConfetti();
            
            let confettiPieces = document.querySelectorAll('.confetti');
            expect(confettiPieces.length).toBe(50);
            
            await animationPromise;
            
            confettiPieces = document.querySelectorAll('.confetti');
            expect(confettiPieces.length).toBe(0);
        }, { timeout: 5000 });
        
        it('should set random positions for confetti', async () => {
            const animationPromise = animationEngine.animateConfetti();
            
            const confettiPieces = document.querySelectorAll('.confetti');
            const positions = Array.from(confettiPieces).map(el => el.style.left);
            
            const uniquePositions = new Set(positions);
            expect(uniquePositions.size).toBeGreaterThan(1);
            
            await animationPromise;
        }, { timeout: 5000 });
        
        it('should resolve promise after animation completes', async () => {
            const animationPromise = animationEngine.animateConfetti();
            
            await expect(animationPromise).resolves.toBeUndefined();
        }, { timeout: 5000 });
    });
    
    describe('Puzzle Transition Animation', () => {
        it('should add fade-out class to puzzle section', async () => {
            const puzzleSection = document.createElement('div');
            puzzleSection.className = 'puzzle-section';
            container.appendChild(puzzleSection);
            
            const animationPromise = animationEngine.animatePuzzleTransition();
            
            expect(puzzleSection.classList.contains('fade-out')).toBe(true);
            
            await animationPromise;
            
            expect(puzzleSection.classList.contains('fade-out')).toBe(false);
        }, { timeout: 5000 });
        
        it('should handle missing puzzle section gracefully', async () => {
            const animationPromise = animationEngine.animatePuzzleTransition();
            
            await expect(animationPromise).resolves.toBeUndefined();
        }, { timeout: 5000 });
        
        it('should complete transition and remove fade-out class', async () => {
            const puzzleSection = document.createElement('div');
            puzzleSection.className = 'puzzle-section';
            container.appendChild(puzzleSection);
            
            const animationPromise = animationEngine.animatePuzzleTransition();
            
            expect(puzzleSection.classList.contains('fade-out')).toBe(true);
            
            await animationPromise;
            
            expect(puzzleSection.classList.contains('fade-out')).toBe(false);
        }, { timeout: 5000 });
    });
    
    describe('Progress Bar Animation', () => {
        it('should animate progress bar from start to end value', async () => {
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = '0%';
            container.appendChild(progressFill);
            
            const animationPromise = animationEngine.animateProgressBar(0, 50, 100);
            await animationPromise;
            
            expect(parseFloat(progressFill.style.width)).toBe(50);
        }, { timeout: 10000 });
        
        it('should complete animation promise when finished', async () => {
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = '0%';
            container.appendChild(progressFill);
            
            const animationPromise = animationEngine.animateProgressBar(0, 100, 100);
            
            await expect(animationPromise).resolves.toBeUndefined();
        }, { timeout: 10000 });
        
        it('should handle missing progress fill element gracefully', async () => {
            const animationPromise = animationEngine.animateProgressBar(0, 50, 100);
            
            await expect(animationPromise).resolves.toBeUndefined();
        }, { timeout: 10000 });
        
        it('should animate from any value to any value', async () => {
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = '25%';
            container.appendChild(progressFill);
            
            const animationPromise = animationEngine.animateProgressBar(25, 75, 100);
            await animationPromise;
            
            expect(parseFloat(progressFill.style.width)).toBe(75);
        }, { timeout: 10000 });
        
        it('should use default duration of 500ms for progress bar', async () => {
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = '0%';
            container.appendChild(progressFill);
            
            const animationPromise = animationEngine.animateProgressBar(0, 100);
            await animationPromise;
            
            expect(parseFloat(progressFill.style.width)).toBe(100);
        }, { timeout: 10000 });
    });
    
    describe('Multiple Animations', () => {
        it('should handle multiple animations running simultaneously', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = '0%';
            container.appendChild(progressFill);
            
            const carAnimation = animationEngine.animateCarMovement(0, 50, 100);
            const progressAnimation = animationEngine.animateProgressBar(0, 50, 100);
            
            await Promise.all([carAnimation, progressAnimation]);
            
            expect(parseFloat(car.style.left)).toBe(50);
            expect(parseFloat(progressFill.style.width)).toBe(50);
        }, { timeout: 10000 });
        
        it('should handle rapid sequential animations', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const anim1 = animationEngine.animateCarMovement(0, 25, 100);
            await anim1;
            
            expect(parseFloat(car.style.left)).toBe(25);
            
            const anim2 = animationEngine.animateCarMovement(25, 50, 100);
            await anim2;
            
            expect(parseFloat(car.style.left)).toBe(50);
        }, { timeout: 10000 });
    });
    
    describe('Animation Timing', () => {
        it('should respect custom duration parameter', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const animationPromise = animationEngine.animateCarMovement(0, 100, 100);
            await animationPromise;
            
            expect(parseFloat(car.style.left)).toBe(100);
        }, { timeout: 10000 });
        
        it('should use default duration of 500ms for car movement', async () => {
            const car = document.createElement('div');
            car.className = 'car';
            car.style.left = '0%';
            container.appendChild(car);
            
            const animationPromise = animationEngine.animateCarMovement(0, 100);
            await animationPromise;
            
            expect(parseFloat(car.style.left)).toBe(100);
        }, { timeout: 10000 });
        
        it('should use default duration of 500ms for progress bar', async () => {
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = '0%';
            container.appendChild(progressFill);
            
            const animationPromise = animationEngine.animateProgressBar(0, 100);
            await animationPromise;
            
            expect(parseFloat(progressFill.style.width)).toBe(100);
        }, { timeout: 10000 });
    });
});
