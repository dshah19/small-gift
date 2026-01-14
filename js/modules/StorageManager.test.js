/**
 * Unit Tests for Storage Manager
 * 
 * Tests for save, load, and clear functionality with error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

describe('StorageManager', () => {
    let storageManager;
    
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        storageManager = new StorageManager();
    });
    
    afterEach(() => {
        localStorage.clear();
    });
    
    describe('Save and Load Round Trip', () => {
        it('should preserve game state when saving and loading', () => {
            const gameState = {
                currentPuzzleIndex: 2,
                completedPuzzles: 2,
                carPosition: 25,
                startTime: '2024-01-14T10:00:00Z',
                endTime: null,
                isGameComplete: false,
                playerName: 'Test Player'
            };
            
            // Save the state
            const saveResult = storageManager.saveGameProgress(gameState);
            expect(saveResult).toBe(true);
            
            // Load the state
            const loadedState = storageManager.loadGameProgress();
            expect(loadedState).toEqual(gameState);
        });
        
        it('should handle complex game states with all fields', () => {
            const gameState = {
                currentPuzzleIndex: 7,
                completedPuzzles: 8,
                carPosition: 100,
                startTime: '2024-01-14T10:00:00Z',
                endTime: '2024-01-14T10:15:30Z',
                isGameComplete: true,
                playerName: 'John Doe'
            };
            
            storageManager.saveGameProgress(gameState);
            const loadedState = storageManager.loadGameProgress();
            
            expect(loadedState.currentPuzzleIndex).toBe(7);
            expect(loadedState.completedPuzzles).toBe(8);
            expect(loadedState.carPosition).toBe(100);
            expect(loadedState.isGameComplete).toBe(true);
            expect(loadedState.playerName).toBe('John Doe');
        });
    });
    
    describe('Clear Game Progress', () => {
        it('should remove all stored data when cleared', () => {
            const gameState = {
                currentPuzzleIndex: 3,
                completedPuzzles: 3,
                carPosition: 37.5,
                startTime: '2024-01-14T10:00:00Z',
                endTime: null,
                isGameComplete: false,
                playerName: 'Test'
            };
            
            // Save state
            storageManager.saveGameProgress(gameState);
            expect(storageManager.loadGameProgress()).not.toBeNull();
            
            // Clear state
            const clearResult = storageManager.clearGameProgress();
            expect(clearResult).toBe(true);
            
            // Verify it's cleared
            expect(storageManager.loadGameProgress()).toBeNull();
        });
    });
    
    describe('Handle Missing Data', () => {
        it('should return null when no data is stored', () => {
            const loadedState = storageManager.loadGameProgress();
            expect(loadedState).toBeNull();
        });
        
        it('should handle loading after clearing', () => {
            const gameState = {
                currentPuzzleIndex: 1,
                completedPuzzles: 1,
                carPosition: 12.5,
                startTime: '2024-01-14T10:00:00Z',
                endTime: null,
                isGameComplete: false,
                playerName: 'Test'
            };
            
            storageManager.saveGameProgress(gameState);
            storageManager.clearGameProgress();
            
            const loadedState = storageManager.loadGameProgress();
            expect(loadedState).toBeNull();
        });
    });
    
    describe('Handle localStorage Errors', () => {
        it('should handle corrupted JSON data gracefully', () => {
            // Manually set corrupted data
            localStorage.setItem('f1-apology-game-progress', '{invalid json}');
            
            // Should return null instead of throwing
            const loadedState = storageManager.loadGameProgress();
            expect(loadedState).toBeNull();
        });
        
        it('should handle localStorage unavailability by returning false on save', () => {
            // Create a mock localStorage that throws on setItem
            const mockStorage = {
                data: {},
                setItem() {
                    throw new Error('QuotaExceededError');
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
            
            // Temporarily replace global localStorage
            const originalStorage = global.localStorage;
            global.localStorage = mockStorage;
            
            const gameState = {
                currentPuzzleIndex: 1,
                completedPuzzles: 1,
                carPosition: 12.5,
                startTime: '2024-01-14T10:00:00Z',
                endTime: null,
                isGameComplete: false,
                playerName: 'Test'
            };
            
            // Create new instance to check availability
            const newStorageManager = new StorageManager();
            const result = newStorageManager.saveGameProgress(gameState);
            
            // Should return false when save fails
            expect(result).toBe(false);
            
            // Restore original
            global.localStorage = originalStorage;
        });
    });
    
    describe('Player Name Storage', () => {
        it('should save and load player name', () => {
            const playerName = 'Alice';
            
            const saveResult = storageManager.savePlayerName(playerName);
            expect(saveResult).toBe(true);
            
            const loadedName = storageManager.loadPlayerName();
            expect(loadedName).toBe(playerName);
        });
        
        it('should return empty string when no player name is stored', () => {
            const loadedName = storageManager.loadPlayerName();
            expect(loadedName).toBe('');
        });
    });
});
