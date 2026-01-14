/**
 * Integration Tests for Puzzle Progression Flow
 * 
 * Tests the complete puzzle progression flow including:
 * - Complete puzzle flow from question to car movement
 * - Multiple puzzles in sequence
 * - Progress persistence across puzzles
 * - Game completion detection
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateManager } from './GameStateManager.js';
import { PuzzleEngine } from './PuzzleEngine.js';
import { StorageManager } from './StorageManager.js';

describe('Puzzle Progression Integration', () => {
    let gameState;
    let puzzleEngine;
    let storageManager;
    
    beforeEach(() => {
        gameState = new GameStateManager();
        puzzleEngine = new PuzzleEngine();
        storageManager = new StorageManager();
        
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
    
    describe('Complete Puzzle Flow', () => {
        it('should complete a single puzzle and advance game state', async () => {
            // Initialize game
            gameState.initializeGame();
            gameState.advancePuzzle();
            
            const initialPosition = gameState.carPosition;
            const initialCompleted = gameState.completedPuzzles;
            
            // Simulate puzzle completion
            gameState.advancePuzzle();
            
            // Verify state advanced
            expect(gameState.completedPuzzles).toBe(initialCompleted + 1);
            expect(gameState.carPosition).toBeGreaterThan(initialPosition);
        });
        
        it('should save progress after puzzle completion', () => {
            gameState.initializeGame();
            gameState.advancePuzzle();
            gameState.advancePuzzle();
            
            const state = gameState.getState();
            const saved = storageManager.saveGameProgress(state);
            
            expect(saved).toBe(true);
            
            const loaded = storageManager.loadGameProgress();
            expect(loaded.completedPuzzles).toBe(2);
            expect(loaded.carPosition).toBe(25);
        });
    });
    
    describe('Multiple Puzzles in Sequence', () => {
        it('should progress through multiple puzzles correctly', () => {
            gameState.initializeGame();
            
            const positions = [];
            
            for (let i = 0; i < 5; i++) {
                gameState.advancePuzzle();
                positions.push(gameState.carPosition);
            }
            
            // Verify positions increase monotonically
            for (let i = 1; i < positions.length; i++) {
                expect(positions[i]).toBeGreaterThan(positions[i - 1]);
            }
            
            // Verify final position
            expect(gameState.completedPuzzles).toBe(5);
            expect(gameState.carPosition).toBe((5 / 8) * 100);
        });
        
        it('should maintain correct car position throughout progression', () => {
            gameState.initializeGame();
            
            const expectedPositions = [12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
            
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
                expect(gameState.carPosition).toBe(expectedPositions[i]);
            }
        });
    });
    
    describe('Progress Persistence', () => {
        it('should persist progress across save and load cycles', () => {
            gameState.initializeGame();
            
            // Complete some puzzles
            for (let i = 0; i < 3; i++) {
                gameState.advancePuzzle();
            }
            
            const originalState = gameState.getState();
            
            // Save progress
            storageManager.saveGameProgress(originalState);
            
            // Create new game state and restore
            const newGameState = new GameStateManager();
            const loadedState = storageManager.loadGameProgress();
            newGameState.restoreState(loadedState);
            
            // Verify state matches
            expect(newGameState.completedPuzzles).toBe(originalState.completedPuzzles);
            expect(newGameState.carPosition).toBe(originalState.carPosition);
            expect(newGameState.currentPuzzleIndex).toBe(originalState.currentPuzzleIndex);
        });
        
        it('should handle multiple save/load cycles', () => {
            gameState.initializeGame();
            
            for (let cycle = 0; cycle < 3; cycle++) {
                gameState.advancePuzzle();
                
                const state = gameState.getState();
                storageManager.saveGameProgress(state);
                
                const loaded = storageManager.loadGameProgress();
                expect(loaded.completedPuzzles).toBe(cycle + 1);
            }
        });
    });
    
    describe('Game Completion Detection', () => {
        it('should detect game completion when all puzzles solved', () => {
            gameState.initializeGame();
            
            // Complete all puzzles
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
            }
            
            expect(gameState.completedPuzzles).toBe(8);
            expect(gameState.currentPuzzleIndex).toBe(7);
            expect(gameState.carPosition).toBe(100);
        });
        
        it('should mark game complete and set end time', () => {
            gameState.initializeGame();
            gameState.advancePuzzle();
            
            expect(gameState.isGameComplete).toBe(false);
            expect(gameState.endTime).toBeNull();
            
            gameState.completeGame();
            
            expect(gameState.isGameComplete).toBe(true);
            expect(gameState.endTime).not.toBeNull();
            expect(gameState.endTime instanceof Date).toBe(true);
        });
        
        it('should calculate game stats correctly on completion', () => {
            gameState.initializeGame();
            
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
            }
            
            gameState.completeGame();
            
            const stats = gameState.getGameStats();
            
            expect(stats.puzzlesSolved).toBe(8);
            expect(stats.totalPuzzles).toBe(8);
            expect(typeof stats.timeTaken).toBe('number');
            expect(stats.timeTaken).toBeGreaterThanOrEqual(0);
        });
    });
    
    describe('Answer Validation in Progression', () => {
        it('should validate correct answers through puzzle engine', async () => {
            // Load puzzles
            await puzzleEngine.loadPuzzles();
            
            const puzzle = puzzleEngine.getCurrentPuzzle();
            
            if (puzzle && puzzle.type === 'trivia') {
                // Test correct answer
                const isCorrect = puzzleEngine.validateAnswer(
                    puzzle,
                    puzzle.correctAnswerIndex
                );
                expect(isCorrect).toBe(true);
                
                // Test incorrect answer
                const wrongIndex = (puzzle.correctAnswerIndex + 1) % puzzle.options.length;
                const isWrong = puzzleEngine.validateAnswer(puzzle, wrongIndex);
                expect(isWrong).toBe(false);
            }
        });
    });
    
    describe('State Consistency', () => {
        it('should maintain consistent state throughout progression', () => {
            gameState.initializeGame();
            
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
                
                // Verify invariant: carPosition = (completed / total) * 100
                const expectedPosition = (gameState.completedPuzzles / gameState.totalPuzzles) * 100;
                expect(gameState.carPosition).toBe(expectedPosition);
                
                // Verify invariant: currentPuzzleIndex = completedPuzzles - 1
                expect(gameState.currentPuzzleIndex).toBe(gameState.completedPuzzles - 1);
            }
        });
        
        it('should not exceed total puzzles', () => {
            gameState.initializeGame();
            
            // Try to advance beyond total puzzles
            for (let i = 0; i < 15; i++) {
                gameState.advancePuzzle();
            }
            
            expect(gameState.completedPuzzles).toBe(8);
            expect(gameState.currentPuzzleIndex).toBe(7);
            expect(gameState.carPosition).toBe(100);
        });
    });
});
