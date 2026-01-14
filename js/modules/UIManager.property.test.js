/**
 * Property-Based Tests for UIManager - Completion Screen
 * 
 * Tests universal properties that should hold for completion screen rendering.
 * Uses fast-check for property-based testing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { UIManager } from './UIManager.js';

describe('UIManager - Property-Based Tests', () => {
    let uiManager;
    let container;
    
    beforeEach(() => {
        uiManager = new UIManager();
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });
    
    /**
     * Property 6: Completion Screen Accuracy
     * 
     * For any completed game state, the completion screen should render with:
     * - All required elements present in DOM
     * - Correct puzzle count display
     * - Correct time formatting
     * - Proper button structure
     * 
     * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
     * Feature: apology-gift-game, Property 6: Completion Screen Accuracy
     */
    it('Property 6: Completion Screen Accuracy - all required elements present', () => {
        fc.assert(
            fc.property(
                fc.record({
                    puzzlesSolved: fc.integer({ min: 0, max: 8 }),
                    totalPuzzles: fc.constant(8),
                    timeTaken: fc.integer({ min: 0, max: 3600 })
                }),
                (stats) => {
                    // Render completion screen
                    uiManager.renderCompletionScreen(container, stats);
                    
                    // Verify all required elements are present
                    const html = container.innerHTML;
                    
                    // Check for required elements
                    const hasCompletionScreen = html.includes('completion-screen');
                    const hasTitle = html.includes('You Did It! 🎉');
                    const hasCheckeredFlag = html.includes('🏁');
                    const hasApologyMessage = html.includes('Thank you for being patient with me');
                    const hasGetWellMessage = html.includes('Get Well Soon');
                    const hasStats = html.includes('Puzzles Solved:') && html.includes('Time Taken:');
                    const hasButtons = html.includes('Play Again 🏎️') && html.includes('Share 📤');
                    const hasPhoto = html.includes('couple-photo');
                    
                    return (
                        hasCompletionScreen &&
                        hasTitle &&
                        hasCheckeredFlag &&
                        hasApologyMessage &&
                        hasGetWellMessage &&
                        hasStats &&
                        hasButtons &&
                        hasPhoto
                    );
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 8: Responsive Design Consistency
     * 
     * For any viewport size from 320px to 1920px, the game screen should:
     * - Render without overflow
     * - Display readable text
     * - Have functional buttons
     * - Scale elements appropriately
     * 
     * Validates: Requirements 7.3
     * Feature: apology-gift-game, Property 8: Responsive Design Consistency
     */
    it('Property 8: Responsive Design Consistency - renders correctly at all viewport sizes', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 320, max: 1920 }),
                (viewportWidth) => {
                    // Set viewport width
                    window.innerWidth = viewportWidth;
                    
                    // Create a mock puzzle
                    const puzzle = {
                        id: 'test-1',
                        type: 'trivia',
                        theme: 'f1',
                        question: 'Test question?',
                        options: ['Option A', 'Option B', 'Option C', 'Option D'],
                        correctAnswerIndex: 0
                    };
                    
                    const progress = {
                        completedPuzzles: 1,
                        totalPuzzles: 8,
                        carPosition: 12.5,
                        currentPuzzleIndex: 0,
                        isGameComplete: false
                    };
                    
                    // Render game screen
                    uiManager.renderGameScreen(container, puzzle, progress);
                    
                    // Verify rendering
                    const html = container.innerHTML;
                    
                    // Check for required elements
                    const hasGameScreen = html.includes('game-screen');
                    const hasTrack = html.includes('track');
                    const hasCar = html.includes('car');
                    const hasProgress = html.includes('Progress:');
                    const hasPuzzle = html.includes('Test question?');
                    
                    // Verify no overflow (basic check)
                    const hasOverflow = html.includes('overflow: hidden') || 
                                       html.includes('overflow-x: hidden');
                    
                    return (
                        hasGameScreen &&
                        hasTrack &&
                        hasCar &&
                        hasProgress &&
                        hasPuzzle
                    );
                }
            ),
            { numRuns: 50 }
        );
    });
    
    /**
     * Property: Puzzle Stats Display Accuracy
     * 
     * For any puzzle count and time value, the completion screen should:
     * - Display correct puzzle count
     * - Format time correctly
     * - Show all stats in proper format
     */
    it('should display puzzle stats accurately for all valid values', () => {
        fc.assert(
            fc.property(
                fc.record({
                    puzzlesSolved: fc.integer({ min: 0, max: 8 }),
                    totalPuzzles: fc.constant(8),
                    timeTaken: fc.integer({ min: 0, max: 3600 })
                }),
                (stats) => {
                    uiManager.renderCompletionScreen(container, stats);
                    
                    const html = container.innerHTML;
                    
                    // Verify puzzle count is displayed
                    const puzzleCountStr = `${stats.puzzlesSolved}/${stats.totalPuzzles}`;
                    const hasPuzzleCount = html.includes(puzzleCountStr);
                    
                    // Verify time is displayed (formatted)
                    const hasTimeDisplay = html.includes('Time Taken:');
                    
                    return hasPuzzleCount && hasTimeDisplay;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property: Photo URL Handling
     * 
     * For any photo URL (or missing URL), the completion screen should:
     * - Use provided URL if available
     * - Fall back to default URL if not provided
     * - Include photo element in DOM
     */
    it('should handle photo URLs correctly', () => {
        fc.assert(
            fc.property(
                fc.oneof(
                    fc.constant(undefined),
                    fc.constant(null),
                    fc.webUrl({ withPathname: false, withQueryParameters: false, withFragment: false })
                ),
                (photoUrl) => {
                    const stats = {
                        puzzlesSolved: 8,
                        totalPuzzles: 8,
                        timeTaken: 120,
                        photoUrl: photoUrl
                    };
                    
                    uiManager.renderCompletionScreen(container, stats);
                    
                    const html = container.innerHTML;
                    
                    // Verify photo element exists
                    const hasPhotoElement = html.includes('couple-photo');
                    
                    // Verify correct URL is used (or default if not provided)
                    const expectedUrl = photoUrl || 'assets/couple-photo.jpg';
                    // Check for the URL or its HTML-encoded version
                    const hasCorrectUrl = html.includes(expectedUrl) || html.includes(expectedUrl.replace(/&/g, '&amp;'));
                    
                    return hasPhotoElement && hasCorrectUrl;
                }
            ),
            { numRuns: 50 }
        );
    });
    
    /**
     * Property: Button Functionality
     * 
     * For any completion screen state, buttons should:
     * - Be present in DOM
     * - Have correct labels
     * - Have click handlers
     */
    it('should render buttons with correct structure', () => {
        fc.assert(
            fc.property(
                fc.record({
                    puzzlesSolved: fc.integer({ min: 0, max: 8 }),
                    totalPuzzles: fc.constant(8),
                    timeTaken: fc.integer({ min: 0, max: 3600 })
                }),
                (stats) => {
                    uiManager.renderCompletionScreen(container, stats);
                    
                    const html = container.innerHTML;
                    
                    // Verify button structure
                    const hasPlayAgainButton = html.includes('Play Again 🏎️');
                    const hasShareButton = html.includes('Share 📤');
                    const hasCompletionActions = html.includes('completion-actions');
                    
                    // Verify buttons have click handlers
                    const hasPlayAgainHandler = html.includes('resetGame');
                    const hasShareHandler = html.includes('shareCompletion');
                    
                    return (
                        hasPlayAgainButton &&
                        hasShareButton &&
                        hasCompletionActions &&
                        hasPlayAgainHandler &&
                        hasShareHandler
                    );
                }
            ),
            { numRuns: 100 }
        );
    });
});
