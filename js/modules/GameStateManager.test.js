/**
 * Unit Tests for GameStateManager
 * 
 * Tests the game state management functionality including:
 * - Initialization with correct default values
 * - Puzzle advancement and car position calculation
 * - Game completion detection
 * - State reset functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateManager } from './GameStateManager.js';

describe('GameStateManager', () => {
    let gameState;
    
    beforeEach(() => {
        gameState = new GameStateManager();
    });
    
    describe('Initialization', () => {
        it('should initialize with correct default values', () => {
            expect(gameState.currentPuzzleIndex).toBe(-1);
            expect(gameState.totalPuzzles).toBe(8);
            expect(gameState.completedPuzzles).toBe(0);
            expect(gameState.carPosition).toBe(0);
            expect(gameState.startTime).toBeNull();
            expect(gameState.endTime).toBeNull();
            expect(gameState.isGameComplete).toBe(false);
            expect(gameState.playerName).toBe('');
        });
        
        it('should initialize game state correctly', () => {
            gameState.currentPuzzleIndex = 5;
            gameState.completedPuzzles = 5;
            gameState.carPosition = 62.5;
            gameState.isGameComplete = true;
            
            gameState.initializeGame();
            
            expect(gameState.currentPuzzleIndex).toBe(-1);
            expect(gameState.completedPuzzles).toBe(0);
            expect(gameState.carPosition).toBe(0);
            expect(gameState.isGameComplete).toBe(false);
        });
    });
    
    describe('Puzzle Advancement', () => {
        it('should increment puzzle index when advancing', () => {
            gameState.advancePuzzle();
            expect(gameState.currentPuzzleIndex).toBe(0);
            
            gameState.advancePuzzle();
            expect(gameState.currentPuzzleIndex).toBe(1);
        });
        
        it('should increment completed puzzles count', () => {
            gameState.advancePuzzle();
            expect(gameState.completedPuzzles).toBe(1);
            
            gameState.advancePuzzle();
            expect(gameState.completedPuzzles).toBe(2);
        });
        
        it('should not advance beyond total puzzles', () => {
            for (let i = 0; i < 10; i++) {
                gameState.advancePuzzle();
            }
            
            expect(gameState.currentPuzzleIndex).toBe(7);
            expect(gameState.completedPuzzles).toBe(8);
        });
        
        it('should set start time on first puzzle advance', () => {
            expect(gameState.startTime).toBeNull();
            
            gameState.advancePuzzle();
            
            expect(gameState.startTime).not.toBeNull();
            expect(gameState.startTime instanceof Date).toBe(true);
        });
        
        it('should not reset start time on subsequent advances', () => {
            gameState.advancePuzzle();
            const firstStartTime = gameState.startTime;
            
            // Small delay to ensure time difference
            const delay = new Promise(resolve => setTimeout(resolve, 10));
            
            gameState.advancePuzzle();
            
            expect(gameState.startTime).toBe(firstStartTime);
        });
    });
    
    describe('Car Position Calculation', () => {
        it('should calculate car position as (completed / total) * 100', () => {
            gameState.advancePuzzle();
            expect(gameState.carPosition).toBe((1 / 8) * 100);
            
            gameState.advancePuzzle();
            expect(gameState.carPosition).toBe((2 / 8) * 100);
            
            gameState.advancePuzzle();
            expect(gameState.carPosition).toBe((3 / 8) * 100);
        });
        
        it('should have car at 0% at start', () => {
            expect(gameState.carPosition).toBe(0);
        });
        
        it('should have car at 100% when all puzzles completed', () => {
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
            }
            
            expect(gameState.carPosition).toBe(100);
        });
        
        it('should calculate correct position for each puzzle', () => {
            const expectedPositions = [12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
            
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
                expect(gameState.carPosition).toBe(expectedPositions[i]);
            }
        });
    });
    
    describe('Game Progress', () => {
        it('should return correct progress object', () => {
            gameState.advancePuzzle();
            gameState.advancePuzzle();
            
            const progress = gameState.getGameProgress();
            
            expect(progress.currentPuzzleIndex).toBe(1);
            expect(progress.completedPuzzles).toBe(2);
            expect(progress.totalPuzzles).toBe(8);
            expect(progress.carPosition).toBe(25);
            expect(progress.isGameComplete).toBe(false);
        });
        
        it('should reflect game completion in progress', () => {
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
            }
            gameState.completeGame();
            
            const progress = gameState.getGameProgress();
            expect(progress.isGameComplete).toBe(true);
        });
    });
    
    describe('Game Completion', () => {
        it('should mark game as complete', () => {
            expect(gameState.isGameComplete).toBe(false);
            
            gameState.completeGame();
            
            expect(gameState.isGameComplete).toBe(true);
        });
        
        it('should set end time when completing game', () => {
            expect(gameState.endTime).toBeNull();
            
            gameState.completeGame();
            
            expect(gameState.endTime).not.toBeNull();
            expect(gameState.endTime instanceof Date).toBe(true);
        });
        
        it('should detect completion when all puzzles solved', () => {
            for (let i = 0; i < 8; i++) {
                gameState.advancePuzzle();
            }
            
            expect(gameState.completedPuzzles).toBe(8);
            expect(gameState.currentPuzzleIndex).toBe(7);
        });
    });
    
    describe('Game Statistics', () => {
        it('should calculate game stats correctly', () => {
            gameState.advancePuzzle();
            gameState.advancePuzzle();
            gameState.playerName = 'Test Player';
            gameState.completeGame();
            
            const stats = gameState.getGameStats();
            
            expect(stats.puzzlesSolved).toBe(2);
            expect(stats.totalPuzzles).toBe(8);
            expect(stats.playerName).toBe('Test Player');
            expect(typeof stats.timeTaken).toBe('number');
            expect(stats.timeTaken).toBeGreaterThanOrEqual(0);
        });
        
        it('should return 0 time if game not completed', () => {
            gameState.advancePuzzle();
            
            const stats = gameState.getGameStats();
            
            expect(stats.timeTaken).toBe(0);
        });
    });
    
    describe('Game Reset', () => {
        it('should reset game to initial state', () => {
            gameState.advancePuzzle();
            gameState.advancePuzzle();
            gameState.playerName = 'Test Player';
            gameState.completeGame();
            
            gameState.resetGame();
            
            expect(gameState.currentPuzzleIndex).toBe(-1);
            expect(gameState.completedPuzzles).toBe(0);
            expect(gameState.carPosition).toBe(0);
            expect(gameState.isGameComplete).toBe(false);
            expect(gameState.playerName).toBe('');
        });
    });
    
    describe('State Persistence', () => {
        it('should get current state for persistence', () => {
            gameState.advancePuzzle();
            gameState.advancePuzzle();
            gameState.playerName = 'Test Player';
            
            const state = gameState.getState();
            
            expect(state.currentPuzzleIndex).toBe(1);
            expect(state.completedPuzzles).toBe(2);
            expect(state.carPosition).toBe(25);
            expect(state.playerName).toBe('Test Player');
            expect(state.startTime).not.toBeNull();
        });
        
        it('should restore state from saved data', () => {
            gameState.advancePuzzle();
            gameState.advancePuzzle();
            gameState.playerName = 'Test Player';
            
            const savedState = gameState.getState();
            
            const newGameState = new GameStateManager();
            newGameState.restoreState(savedState);
            
            expect(newGameState.currentPuzzleIndex).toBe(1);
            expect(newGameState.completedPuzzles).toBe(2);
            expect(newGameState.carPosition).toBe(25);
            expect(newGameState.playerName).toBe('Test Player');
        });
        
        it('should handle null dates when restoring state', () => {
            const state = {
                currentPuzzleIndex: 0,
                completedPuzzles: 1,
                carPosition: 12.5,
                startTime: null,
                endTime: null,
                isGameComplete: false,
                playerName: 'Test'
            };
            
            gameState.restoreState(state);
            
            expect(gameState.startTime).toBeNull();
            expect(gameState.endTime).toBeNull();
        });
    });
    
    describe('Current Puzzle Index', () => {
        it('should return current puzzle index', () => {
            expect(gameState.getCurrentPuzzleIndex()).toBe(-1);
            
            gameState.advancePuzzle();
            expect(gameState.getCurrentPuzzleIndex()).toBe(0);
            
            gameState.advancePuzzle();
            expect(gameState.getCurrentPuzzleIndex()).toBe(1);
        });
    });
});
