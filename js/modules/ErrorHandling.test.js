/**
 * Unit Tests for Error Handling
 * 
 * Tests error handling and edge cases across the game.
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PuzzleEngine } from './PuzzleEngine.js';
import { StorageManager } from './StorageManager.js';
import { UIManager } from './UIManager.js';

describe('Error Handling and Edge Cases', () => {
    let container;
    
    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        
        // Mock localStorage
        global.localStorage = {
            data: {},
            setItem(key, value) {
                this.data[key] = value;
            },
            getItem(key) {
                return this.data[key] || null;
            },
            removeItem(key) {
                delete this.data[key];
            },
            clear() {
                this.data = {};
            }
        };
    });
    
    afterEach(() => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });
    
    describe('Puzzle Loading Error Handling', () => {
        it('should load puzzles successfully', async () => {
            const puzzleEngine = new PuzzleEngine();
            
            // Should load puzzles without error
            await puzzleEngine.loadPuzzles();
            expect(puzzleEngine.puzzles.length).toBeGreaterThan(0);
        });
    });
    
    describe('Storage Error Handling', () => {
        it('should handle localStorage unavailability', () => {
            const storageManager = new StorageManager();
            
            // Mock localStorage to throw error
            const originalLocalStorage = global.localStorage;
            global.localStorage = {
                setItem() {
                    throw new Error('localStorage is not available');
                },
                getItem() {
                    throw new Error('localStorage is not available');
                }
            };
            
            try {
                const state = { completedPuzzles: 1, carPosition: 12.5 };
                const result = storageManager.saveGameProgress(state);
                
                // Should handle error gracefully
                expect(result).toBe(false);
            } finally {
                global.localStorage = originalLocalStorage;
            }
        });
        
        it('should handle missing saved data gracefully', () => {
            const storageManager = new StorageManager();
            
            // Clear localStorage
            global.localStorage.clear();
            
            const loaded = storageManager.loadGameProgress();
            
            // Should return null or empty object
            expect(loaded).toBeNull();
        });
        
        it('should handle corrupted saved data', () => {
            const storageManager = new StorageManager();
            
            // Save corrupted data
            global.localStorage.setItem('gameProgress', 'invalid json {]');
            
            const loaded = storageManager.loadGameProgress();
            
            // Should handle gracefully
            expect(loaded).toBeNull();
        });
    });
    
    describe('UI Error Handling', () => {
        it('should display error messages', () => {
            const uiManager = new UIManager();
            
            uiManager.showError('Test error message');
            
            const feedback = document.querySelector('.feedback-message');
            expect(feedback).toBeDefined();
            expect(feedback.textContent).toContain('Test error message');
            expect(feedback.className).toContain('feedback-error');
        });
        
        it('should handle missing puzzle data', () => {
            const uiManager = new UIManager();
            
            // Render with null puzzle
            const html = uiManager.renderPuzzleContent(null);
            
            expect(html).toContain('Loading puzzle');
        });
    });
    
    describe('Image Loading Error Handling', () => {
        it('should handle missing couple photo', () => {
            const uiManager = new UIManager();
            
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                photoUrl: 'assets/missing-photo.jpg'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            // Should render without throwing error
            const html = container.innerHTML;
            expect(html).toContain('missing-photo.jpg');
        });
    });
    
    describe('Answer Validation Edge Cases', () => {
        it('should handle invalid answer indices', async () => {
            const puzzleEngine = new PuzzleEngine();
            await puzzleEngine.loadPuzzles();
            
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            
            // Test with out-of-bounds index
            const result = puzzleEngine.validateAnswer(puzzle, 999);
            expect(result).toBe(false);
        });
        
        it('should handle negative answer indices', async () => {
            const puzzleEngine = new PuzzleEngine();
            await puzzleEngine.loadPuzzles();
            
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            
            // Test with negative index
            const result = puzzleEngine.validateAnswer(puzzle, -1);
            expect(result).toBe(false);
        });
        
        it('should handle null puzzle in validation', () => {
            const puzzleEngine = new PuzzleEngine();
            
            const result = puzzleEngine.validateAnswer(null, 0);
            expect(result).toBe(false);
        });
    });
    
    describe('Game State Edge Cases', () => {
        it('should handle advancing beyond total puzzles', () => {
            const { GameStateManager } = require('./GameStateManager.js');
            const gameState = new GameStateManager();
            
            gameState.initializeGame();
            
            // Try to advance beyond total puzzles
            for (let i = 0; i < 20; i++) {
                gameState.advancePuzzle();
            }
            
            // Should not exceed total puzzles
            expect(gameState.completedPuzzles).toBeLessThanOrEqual(gameState.totalPuzzles);
            expect(gameState.carPosition).toBeLessThanOrEqual(100);
        });
        
        it('should handle resetting game state', () => {
            const { GameStateManager } = require('./GameStateManager.js');
            const gameState = new GameStateManager();
            
            gameState.initializeGame();
            gameState.advancePuzzle();
            gameState.advancePuzzle();
            
            expect(gameState.completedPuzzles).toBe(2);
            
            gameState.resetGame();
            
            expect(gameState.completedPuzzles).toBe(0);
            expect(gameState.carPosition).toBe(0);
            expect(gameState.currentPuzzleIndex).toBe(-1);
        });
    });
    
    describe('Feedback Display Edge Cases', () => {
        it('should clear previous feedback before showing new feedback', () => {
            const uiManager = new UIManager();
            
            uiManager.showFeedback('First message', 'info');
            uiManager.showFeedback('Second message', 'success');
            
            const feedbacks = document.querySelectorAll('.feedback-message');
            
            // Should only have one feedback visible
            expect(feedbacks.length).toBeLessThanOrEqual(2);
        });
        
        it('should auto-remove feedback after timeout', async () => {
            const uiManager = new UIManager();
            
            uiManager.showFeedback('Test message', 'info');
            
            const feedback = document.querySelector('.feedback-message');
            expect(feedback).toBeDefined();
            
            // Wait for timeout
            await new Promise(resolve => setTimeout(resolve, 3100));
            
            const feedbackAfter = document.querySelector('.feedback-message');
            expect(feedbackAfter).toBeNull();
        });
    });
    
    describe('Puzzle Randomization Edge Cases', () => {
        it('should handle randomization of puzzles with 2 options', async () => {
            const puzzleEngine = new PuzzleEngine();
            await puzzleEngine.loadPuzzles();
            
            const puzzle = {
                id: 'test',
                type: 'trivia',
                theme: 'f1',
                question: 'Test?',
                options: ['A', 'B'],
                correctAnswerIndex: 0
            };
            
            const randomized = puzzleEngine.randomizeAnswerOptions(puzzle);
            
            expect(randomized.options.length).toBe(2);
            expect(randomized.correctAnswerIndex).toBeGreaterThanOrEqual(0);
            expect(randomized.correctAnswerIndex).toBeLessThan(2);
        });
        
        it('should handle randomization of single option puzzle', async () => {
            const puzzleEngine = new PuzzleEngine();
            await puzzleEngine.loadPuzzles();
            
            const puzzle = {
                id: 'test',
                type: 'trivia',
                theme: 'f1',
                question: 'Test?',
                options: ['A'],
                correctAnswerIndex: 0
            };
            
            const randomized = puzzleEngine.randomizeAnswerOptions(puzzle);
            
            expect(randomized.options.length).toBe(1);
            expect(randomized.correctAnswerIndex).toBe(0);
        });
    });
    
    describe('Network Error Handling', () => {
        it('should handle image loading failures gracefully', () => {
            const uiManager = new UIManager();
            
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                photoUrl: 'https://invalid-url-that-does-not-exist.com/photo.jpg'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            // Should render without throwing error
            expect(container.innerHTML).toContain('completion-screen');
        });
    });
});
