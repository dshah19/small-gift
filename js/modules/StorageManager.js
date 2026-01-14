/**
 * Storage Manager
 * 
 * Handles persistence of game progress using localStorage.
 * Provides methods to save, load, and clear game state.
 */

export class StorageManager {
    constructor() {
        this.storageKey = 'f1-apology-game-progress';
        this.isAvailable = this.checkStorageAvailability();
    }
    
    /**
     * Check if localStorage is available
     */
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('localStorage is not available:', error);
            return false;
        }
    }
    
    /**
     * Save game progress to localStorage
     */
    saveGameProgress(gameState) {
        if (!this.isAvailable) {
            console.warn('Cannot save progress: localStorage is not available');
            return false;
        }
        
        try {
            const data = JSON.stringify(gameState);
            localStorage.setItem(this.storageKey, data);
            return true;
        } catch (error) {
            console.error('Failed to save game progress:', error);
            return false;
        }
    }
    
    /**
     * Load game progress from localStorage
     */
    loadGameProgress() {
        if (!this.isAvailable) {
            console.warn('Cannot load progress: localStorage is not available');
            return null;
        }
        
        try {
            // Temporarily disabled - always start fresh for testing
            // Remove this comment and uncomment below after testing
            return null;
            
            // const data = localStorage.getItem(this.storageKey);
            // if (data) {
            //     return JSON.parse(data);
            // }
            // return null;
        } catch (error) {
            console.error('Failed to load game progress:', error);
            return null;
        }
    }
    
    /**
     * Clear all game progress
     */
    clearGameProgress() {
        if (!this.isAvailable) {
            console.warn('Cannot clear progress: localStorage is not available');
            return false;
        }
        
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to clear game progress:', error);
            return false;
        }
    }
    
    /**
     * Save player name
     */
    savePlayerName(name) {
        if (!this.isAvailable) {
            return false;
        }
        
        try {
            localStorage.setItem('f1-apology-player-name', name);
            return true;
        } catch (error) {
            console.error('Failed to save player name:', error);
            return false;
        }
    }
    
    /**
     * Load player name
     */
    loadPlayerName() {
        if (!this.isAvailable) {
            return '';
        }
        
        try {
            return localStorage.getItem('f1-apology-player-name') || '';
        } catch (error) {
            console.error('Failed to load player name:', error);
            return '';
        }
    }
}
