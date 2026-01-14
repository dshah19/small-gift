/**
 * F1 Apology Gift Game - Main Entry Point
 * 
 * This module initializes the game application and orchestrates
 * the interaction between all game components.
 */

import { GameStateManager } from './modules/GameStateManager.js';
import { PuzzleEngine } from './modules/PuzzleEngine.js';
import { UIManager } from './modules/UIManager.js';
import { AnimationEngine } from './modules/AnimationEngine.js';
import { StorageManager } from './modules/StorageManager.js';
import { PerformanceOptimizer } from './modules/PerformanceOptimizer.js';

/**
 * Game Application Class
 * Coordinates all game systems and manages the main game loop
 */
class GameApplication {
    constructor() {
        this.gameStateManager = new GameStateManager();
        this.puzzleEngine = new PuzzleEngine();
        this.uiManager = new UIManager();
        this.animationEngine = new AnimationEngine();
        this.storageManager = new StorageManager();
        this.performanceOptimizer = new PerformanceOptimizer();
        
        this.isInitialized = false;
    }
    
    /**
     * Initialize the game application
     */
    async initialize() {
        try {
            // Initialize performance monitoring
            this.performanceOptimizer.initializeMonitoring();
            
            // Load puzzles
            await this.puzzleEngine.loadPuzzles();
            
            // Preload puzzle content before gameplay
            await this.performanceOptimizer.preloadPuzzleContent(this.puzzleEngine.puzzles);
            
            // Try to load saved progress
            const savedProgress = this.storageManager.loadGameProgress();
            if (savedProgress) {
                this.gameStateManager.restoreState(savedProgress);
            } else {
                this.gameStateManager.initializeGame();
            }
            
            this.isInitialized = true;
            this.setupKeyboardNavigation();
            this.render();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.uiManager.showError('Failed to initialize game. Please refresh the page.');
        }
    }
    
    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle Tab key for focus management
            if (e.key === 'Tab') {
                // Allow default tab behavior for focus management
                return;
            }
            
            // Handle Enter key for button activation
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.tagName === 'BUTTON') {
                    activeElement.click();
                    e.preventDefault();
                }
            }
            
            // Handle Arrow keys for puzzle options navigation
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const options = document.querySelectorAll('.puzzle-option');
                if (options.length > 0) {
                    const activeElement = document.activeElement;
                    let currentIndex = Array.from(options).indexOf(activeElement);
                    
                    if (currentIndex === -1) {
                        // No option is focused, focus the first one
                        options[0].focus();
                        e.preventDefault();
                        return;
                    }
                    
                    let nextIndex = currentIndex;
                    
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        nextIndex = (currentIndex - 1 + options.length) % options.length;
                    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        nextIndex = (currentIndex + 1) % options.length;
                    }
                    
                    options[nextIndex].focus();
                    e.preventDefault();
                }
            }
        });
    }
    
    /**
     * Render the current game state
     */
    render() {
        if (!this.isInitialized) return;
        
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error('App container not found');
            return;
        }
        
        // Check if all puzzles are completed
        if (this.gameStateManager.currentPuzzleIndex >= this.gameStateManager.totalPuzzles) {
            console.log('🏁 RENDERING COMPLETION SCREEN');
            console.log('Current puzzle index:', this.gameStateManager.currentPuzzleIndex);
            console.log('Total puzzles:', this.gameStateManager.totalPuzzles);
            this.gameStateManager.completeGame();
            const stats = this.gameStateManager.getGameStats();
            console.log('Stats being passed to completion screen:', stats);
            this.uiManager.renderCompletionScreen(appContainer, stats);
            console.log('✅ Completion screen rendered');
        } else if (this.gameStateManager.currentPuzzleIndex === -1) {
            // Show welcome screen
            this.uiManager.renderWelcomeScreen(appContainer, () => {
                this.startGame();
            });
        } else {
            // Show game screen with current puzzle
            const currentPuzzle = this.puzzleEngine.getCurrentPuzzle();
            this.uiManager.renderGameScreen(
                appContainer,
                currentPuzzle,
                this.gameStateManager.getGameProgress(),
                (answer) => this.handlePuzzleAnswer(answer)
            );
        }
    }
    
    /**
     * Start the game
     */
    startGame() {
        this.gameStateManager.advancePuzzle();
        this.puzzleEngine.currentPuzzleIndex = this.gameStateManager.currentPuzzleIndex;
        this.render();
    }
    
    /**
     * Handle puzzle answer submission
     */
    async handlePuzzleAnswer(answer) {
        const currentPuzzle = this.puzzleEngine.getCurrentPuzzle();
        const isCorrect = this.puzzleEngine.validateAnswer(currentPuzzle, answer);
        
        // Disable options while processing
        this.uiManager.disablePuzzleOptions();
        
        if (isCorrect) {
            // Highlight correct answer
            this.uiManager.highlightCorrectAnswer(currentPuzzle.correctAnswerIndex);
            this.uiManager.highlightSelectedAnswer(answer);
            
            // Show success feedback
            this.uiManager.showFeedback('Correct! 🎉', 'success');
            
            // Save progress
            this.storageManager.saveGameProgress(this.gameStateManager.getState());
            
            // Wait for feedback to be visible
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Advance to next puzzle
            await this.animationEngine.animateCarMovement(
                this.gameStateManager.carPosition,
                this.gameStateManager.carPosition + (100 / this.gameStateManager.totalPuzzles),
                500
            );
            
            this.gameStateManager.advancePuzzle();
            this.puzzleEngine.currentPuzzleIndex = this.gameStateManager.currentPuzzleIndex;
            
            // Check if game is complete
            if (this.gameStateManager.currentPuzzleIndex >= this.gameStateManager.totalPuzzles) {
                await this.animationEngine.animateCheckeredFlag();
                this.gameStateManager.completeGame();
            }
            
            this.render();
        } else {
            // Highlight selected answer as incorrect
            this.uiManager.highlightSelectedAnswer(answer);
            this.uiManager.highlightCorrectAnswer(currentPuzzle.correctAnswerIndex);
            
            // Show error feedback
            this.uiManager.showFeedback('Try again! 💪', 'error');
            
            // Wait before re-enabling
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Clear highlights and re-enable options for retry
            this.uiManager.clearAnswerHighlights();
            this.uiManager.enablePuzzleOptions();
        }
    }
    
    /**
     * Reset the game
     */
    resetGame() {
        this.storageManager.clearGameProgress();
        this.gameStateManager.resetGame();
        this.render();
    }
    
    /**
     * Share game completion
     */
    shareCompletion() {
        this.uiManager.shareCompletion();
    }
}

/**
 * Initialize and start the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    const app = new GameApplication();
    await app.initialize();
    
    // Make app available globally for debugging
    window.gameApp = app;
});
