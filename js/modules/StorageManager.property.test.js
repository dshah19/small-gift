/**
 * Property-Based Tests for Storage Manager
 * 
 * Tests for Progress Persistence Round Trip property
 * Feature: apology-gift-game, Property 4: Progress Persistence Round Trip
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { StorageManager } from './StorageManager.js';

// Ensure localStorage is available in test environment
if (typeof localStorage === 'undefined') {
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
}

describe('StorageManager - Property-Based Tests', () => {
    let storageManager;
    
    beforeEach(() => {
        localStorage.clear();
        storageManager = new StorageManager();
    });
    
    afterEach(() => {
        localStorage.clear();
    });
    
    /**
     * Property 4: Progress Persistence Round Trip
     * 
     * For any game state, saving progress to local storage and then loading it 
     * should produce an equivalent game state (same puzzle index, car position, completed count).
     * 
     * Validates: Requirements 2.5
     */
    it('should preserve game state through save and load cycle (round trip)', () => {
        fc.assert(
            fc.property(
                fc.record({
                    currentPuzzleIndex: fc.integer({ min: -1, max: 7 }),
                    completedPuzzles: fc.integer({ min: 0, max: 8 }),
                    carPosition: fc.float({ min: 0, max: 100, noNaN: true }),
                    startTime: fc.option(fc.string()),
                    endTime: fc.option(fc.string()),
                    isGameComplete: fc.boolean(),
                    playerName: fc.string({ maxLength: 50 })
                }),
                (gameState) => {
                    // Save the game state
                    const saveSuccess = storageManager.saveGameProgress(gameState);
                    expect(saveSuccess).toBe(true);
                    
                    // Load the game state back
                    const loadedState = storageManager.loadGameProgress();
                    
                    // Verify the loaded state equals the original state
                    expect(loadedState).toEqual(gameState);
                    expect(loadedState.currentPuzzleIndex).toBe(gameState.currentPuzzleIndex);
                    expect(loadedState.completedPuzzles).toBe(gameState.completedPuzzles);
                    expect(loadedState.carPosition).toBe(gameState.carPosition);
                    expect(loadedState.isGameComplete).toBe(gameState.isGameComplete);
                    expect(loadedState.playerName).toBe(gameState.playerName);
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property: Multiple save-load cycles preserve state
     * 
     * For any game state, performing multiple save-load cycles should 
     * always result in the same state.
     */
    it('should preserve state across multiple save-load cycles', () => {
        fc.assert(
            fc.property(
                fc.record({
                    currentPuzzleIndex: fc.integer({ min: -1, max: 7 }),
                    completedPuzzles: fc.integer({ min: 0, max: 8 }),
                    carPosition: fc.float({ min: 0, max: 100, noNaN: true }),
                    startTime: fc.option(fc.string()),
                    endTime: fc.option(fc.string()),
                    isGameComplete: fc.boolean(),
                    playerName: fc.string({ maxLength: 50 })
                }),
                (gameState) => {
                    // First save-load cycle
                    storageManager.saveGameProgress(gameState);
                    let loadedState = storageManager.loadGameProgress();
                    expect(loadedState).toEqual(gameState);
                    
                    // Second save-load cycle (save the loaded state again)
                    storageManager.saveGameProgress(loadedState);
                    loadedState = storageManager.loadGameProgress();
                    expect(loadedState).toEqual(gameState);
                    
                    // Third save-load cycle
                    storageManager.saveGameProgress(loadedState);
                    loadedState = storageManager.loadGameProgress();
                    expect(loadedState).toEqual(gameState);
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property: Clear operation removes all data
     * 
     * For any saved game state, after clearing, loading should return null.
     */
    it('should return null after clearing any saved state', () => {
        fc.assert(
            fc.property(
                fc.record({
                    currentPuzzleIndex: fc.integer({ min: -1, max: 7 }),
                    completedPuzzles: fc.integer({ min: 0, max: 8 }),
                    carPosition: fc.float({ min: 0, max: 100, noNaN: true }),
                    startTime: fc.option(fc.string()),
                    endTime: fc.option(fc.string()),
                    isGameComplete: fc.boolean(),
                    playerName: fc.string({ maxLength: 50 })
                }),
                (gameState) => {
                    // Save state
                    storageManager.saveGameProgress(gameState);
                    expect(storageManager.loadGameProgress()).not.toBeNull();
                    
                    // Clear state
                    storageManager.clearGameProgress();
                    
                    // Verify cleared
                    expect(storageManager.loadGameProgress()).toBeNull();
                }
            ),
            { numRuns: 100 }
        );
    });
});
