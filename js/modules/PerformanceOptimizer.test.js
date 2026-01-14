/**
 * Performance Optimizer Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PerformanceOptimizer } from './PerformanceOptimizer.js';

describe('PerformanceOptimizer', () => {
    let optimizer;
    
    beforeEach(() => {
        optimizer = new PerformanceOptimizer();
    });
    
    afterEach(() => {
        optimizer.cleanup();
    });
    
    describe('Image Preloading', () => {
        it('should cache preloaded images', async () => {
            const imageUrl = 'test-image.jpg';
            
            // Mock the Image constructor
            const mockImage = { src: '', onload: null, onerror: null };
            global.Image = vi.fn(() => mockImage);
            
            // Simulate image load
            const promise = optimizer.preloadImage(imageUrl);
            mockImage.onload();
            
            const result1 = await promise;
            const result2 = await optimizer.preloadImage(imageUrl);
            
            expect(result1).toBe(result2);
        });
        
        it('should handle image preload errors', async () => {
            const imageUrl = 'invalid-image.jpg';
            
            // Mock the Image constructor to fail
            const mockImage = { src: '', onload: null, onerror: null };
            global.Image = vi.fn(() => mockImage);
            
            // Simulate image load error
            const promise = optimizer.preloadImage(imageUrl);
            mockImage.onerror();
            
            try {
                await promise;
                expect.fail('Should have thrown error');
            } catch (error) {
                expect(error.message).toContain('Failed to preload image');
            }
        });
    });
    
    describe('Performance Metrics', () => {
        it('should initialize performance metrics', () => {
            const metrics = optimizer.getMetrics();
            
            expect(metrics).toHaveProperty('pageLoadTime');
            expect(metrics).toHaveProperty('puzzleLoadTime');
            expect(metrics).toHaveProperty('renderTime');
            expect(metrics).toHaveProperty('animationFrameTime');
        });
        
        it('should measure render time', () => {
            const renderFn = () => {
                // Simulate render work
                let sum = 0;
                for (let i = 0; i < 1000; i++) {
                    sum += i;
                }
            };
            
            const renderTime = optimizer.measureRenderTime(renderFn);
            
            expect(renderTime).toBeGreaterThanOrEqual(0);
            expect(optimizer.getMetrics().renderTime).toBe(renderTime);
        });
    });
    
    describe('Puzzle Content Preloading', () => {
        it('should handle puzzles without images', async () => {
            const puzzles = [
                { id: '1', type: 'trivia' },
                { id: '2', type: 'trivia' }
            ];
            
            await optimizer.preloadPuzzleContent(puzzles);
            
            expect(optimizer.preloadedImages.size).toBe(0);
        });
    });
});
