/**
 * Unit Tests for UIManager - Trivia Puzzle UI
 * 
 * Tests the trivia puzzle rendering and interaction functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UIManager } from './UIManager.js';

describe('UIManager - Trivia Puzzle UI', () => {
    let uiManager;
    let container;
    
    beforeEach(() => {
        uiManager = new UIManager();
        // Create a mock container
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        // Clean up
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });
    
    describe('Trivia Puzzle Rendering', () => {
        it('should render trivia puzzle with question and options', () => {
            const puzzle = {
                id: 'test-1',
                type: 'trivia',
                theme: 'f1',
                question: 'How many championships?',
                options: ['5', '6', '7', '8'],
                correctAnswerIndex: 2,
                explanation: 'The answer is 7'
            };
            
            const html = uiManager.renderTriviaPuzzle(puzzle);
            
            expect(html).toContain('How many championships?');
            expect(html).toContain('5');
            expect(html).toContain('6');
            expect(html).toContain('7');
            expect(html).toContain('8');
            expect(html).toContain('puzzle-theme-badge');
            expect(html).toContain('data-theme="f1"');
        });
        
        it('should render theme badge with correct label', () => {
            const puzzle = {
                id: 'test-1',
                type: 'trivia',
                theme: 'football',
                question: 'Test question?',
                options: ['A', 'B', 'C', 'D'],
                correctAnswerIndex: 0
            };
            
            const html = uiManager.renderTriviaPuzzle(puzzle);
            
            expect(html).toContain('⚽ Football');
            expect(html).toContain('data-theme="football"');
        });
        
        it('should render all theme types correctly', () => {
            const themes = [
                { theme: 'f1', label: '🏎️ F1 Racing' },
                { theme: 'football', label: '⚽ Football' },
                { theme: 'office', label: '📺 The Office' },
                { theme: 'personal', label: '💝 Personal Memory' }
            ];
            
            themes.forEach(({ theme, label }) => {
                const puzzle = {
                    id: `test-${theme}`,
                    type: 'trivia',
                    theme: theme,
                    question: 'Test?',
                    options: ['A', 'B', 'C', 'D'],
                    correctAnswerIndex: 0
                };
                
                const html = uiManager.renderTriviaPuzzle(puzzle);
                expect(html).toContain(label);
                expect(html).toContain(`data-theme="${theme}"`);
            });
        });
        
        it('should render puzzle options with data-index attributes', () => {
            const puzzle = {
                id: 'test-1',
                type: 'trivia',
                theme: 'f1',
                question: 'Test?',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswerIndex: 1
            };
            
            const html = uiManager.renderTriviaPuzzle(puzzle);
            
            expect(html).toContain('data-index="0"');
            expect(html).toContain('data-index="1"');
            expect(html).toContain('data-index="2"');
            expect(html).toContain('data-index="3"');
        });
        
        it('should include puzzle feedback container', () => {
            const puzzle = {
                id: 'test-1',
                type: 'trivia',
                theme: 'f1',
                question: 'Test?',
                options: ['A', 'B', 'C', 'D'],
                correctAnswerIndex: 0
            };
            
            const html = uiManager.renderTriviaPuzzle(puzzle);
            
            expect(html).toContain('puzzle-feedback');
            expect(html).toContain('id="puzzle-feedback"');
            expect(html).toContain('style="display: none;"');
        });
    });
    
    describe('Theme Label Generation', () => {
        it('should return correct label for F1 theme', () => {
            const label = uiManager.getThemeLabel('f1');
            expect(label).toBe('🏎️ F1 Racing');
        });
        
        it('should return correct label for football theme', () => {
            const label = uiManager.getThemeLabel('football');
            expect(label).toBe('⚽ Football');
        });
        
        it('should return correct label for office theme', () => {
            const label = uiManager.getThemeLabel('office');
            expect(label).toBe('📺 The Office');
        });
        
        it('should return correct label for personal theme', () => {
            const label = uiManager.getThemeLabel('personal');
            expect(label).toBe('💝 Personal Memory');
        });
        
        it('should return theme name for unknown theme', () => {
            const label = uiManager.getThemeLabel('unknown');
            expect(label).toBe('unknown');
        });
    });
    
    describe('Puzzle Feedback Display', () => {
        it('should show success feedback', () => {
            container.innerHTML = '<div id="puzzle-feedback" style="display: none;"></div>';
            
            uiManager.showPuzzleFeedback('Correct!', 'success');
            
            const feedback = document.getElementById('puzzle-feedback');
            expect(feedback.textContent).toBe('Correct!');
            expect(feedback.className).toContain('feedback-success');
            expect(feedback.style.display).toBe('block');
        });
        
        it('should show error feedback', () => {
            container.innerHTML = '<div id="puzzle-feedback" style="display: none;"></div>';
            
            uiManager.showPuzzleFeedback('Try again!', 'error');
            
            const feedback = document.getElementById('puzzle-feedback');
            expect(feedback.textContent).toBe('Try again!');
            expect(feedback.className).toContain('feedback-error');
            expect(feedback.style.display).toBe('block');
        });
    });
    
    describe('Puzzle Option Interaction', () => {
        beforeEach(() => {
            container.innerHTML = `
                <button class="puzzle-option" data-index="0">Option A</button>
                <button class="puzzle-option" data-index="1">Option B</button>
                <button class="puzzle-option" data-index="2">Option C</button>
                <button class="puzzle-option" data-index="3">Option D</button>
            `;
        });
        
        it('should disable all puzzle options', () => {
            uiManager.disablePuzzleOptions();
            
            const options = document.querySelectorAll('.puzzle-option');
            options.forEach(option => {
                expect(option.disabled).toBe(true);
                expect(option.style.pointerEvents).toBe('none');
                expect(option.style.opacity).toBe('0.6');
            });
        });
        
        it('should enable all puzzle options', () => {
            uiManager.disablePuzzleOptions();
            uiManager.enablePuzzleOptions();
            
            const options = document.querySelectorAll('.puzzle-option');
            options.forEach(option => {
                expect(option.disabled).toBe(false);
                expect(option.style.pointerEvents).toBe('auto');
                expect(option.style.opacity).toBe('1');
            });
        });
        
        it('should highlight correct answer', () => {
            uiManager.highlightCorrectAnswer(2);
            
            const options = document.querySelectorAll('.puzzle-option');
            expect(options[2].classList.contains('correct-answer')).toBe(true);
            expect(options[0].classList.contains('correct-answer')).toBe(false);
            expect(options[1].classList.contains('correct-answer')).toBe(false);
            expect(options[3].classList.contains('correct-answer')).toBe(false);
        });
        
        it('should highlight selected answer', () => {
            uiManager.highlightSelectedAnswer(1);
            
            const options = document.querySelectorAll('.puzzle-option');
            expect(options[1].classList.contains('selected-answer')).toBe(true);
            expect(options[0].classList.contains('selected-answer')).toBe(false);
            expect(options[2].classList.contains('selected-answer')).toBe(false);
            expect(options[3].classList.contains('selected-answer')).toBe(false);
        });
        
        it('should clear all answer highlights', () => {
            uiManager.highlightCorrectAnswer(2);
            uiManager.highlightSelectedAnswer(1);
            
            uiManager.clearAnswerHighlights();
            
            const options = document.querySelectorAll('.puzzle-option');
            options.forEach(option => {
                expect(option.classList.contains('correct-answer')).toBe(false);
                expect(option.classList.contains('selected-answer')).toBe(false);
                expect(option.classList.contains('incorrect-answer')).toBe(false);
            });
        });
    });
    
    describe('Game Screen with Trivia Puzzle', () => {
        it('should render game screen with trivia puzzle', () => {
            const puzzle = {
                id: 'test-1',
                type: 'trivia',
                theme: 'f1',
                question: 'How many championships?',
                options: ['5', '6', '7', '8'],
                correctAnswerIndex: 2
            };
            
            const progress = {
                completedPuzzles: 1,
                totalPuzzles: 8,
                carPosition: 12.5,
                currentPuzzleIndex: 0,
                isGameComplete: false
            };
            
            uiManager.renderGameScreen(container, puzzle, progress);
            
            expect(container.innerHTML).toContain('game-screen');
            expect(container.innerHTML).toContain('How many championships?');
            expect(container.innerHTML).toContain('1/8');
            expect(container.innerHTML).toContain('track');
            expect(container.innerHTML).toContain('car');
        });
    });
    
    describe('Pattern Matching Puzzle - Spot the Difference', () => {
        it('should render spot-the-difference puzzle with image', () => {
            const puzzle = {
                id: 'pattern-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Find the hidden difference',
                imageUrl: 'assets/test-image.jpg',
                challengeType: 'spot-difference',
                correctAreas: [
                    { x: 100, y: 150, width: 50, height: 50 }
                ]
            };
            
            const html = uiManager.renderSpotDifferencePuzzle(puzzle);
            
            expect(html).toContain('spot-difference');
            expect(html).toContain('Find the hidden difference');
            expect(html).toContain('assets/test-image.jpg');
            expect(html).toContain('clickable-overlay');
            expect(html).toContain('🔍 Spot the Difference');
        });
        
        it('should include correct areas data in overlay', () => {
            const puzzle = {
                id: 'pattern-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Find differences',
                imageUrl: 'assets/test.jpg',
                challengeType: 'spot-difference',
                correctAreas: [
                    { x: 100, y: 150, width: 50, height: 50 },
                    { x: 200, y: 250, width: 40, height: 40 }
                ]
            };
            
            const html = uiManager.renderSpotDifferencePuzzle(puzzle);
            
            expect(html).toContain('data-correct-areas');
            expect(html).toContain('100');
            expect(html).toContain('150');
            expect(html).toContain('200');
            expect(html).toContain('250');
        });
        
        it('should render hint text for spot-the-difference', () => {
            const puzzle = {
                id: 'pattern-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Find it',
                imageUrl: 'assets/test.jpg',
                challengeType: 'spot-difference',
                correctAreas: []
            };
            
            const html = uiManager.renderSpotDifferencePuzzle(puzzle);
            
            expect(html).toContain('Click on the differences you find');
            expect(html).toContain('hint-text');
        });
    });
    
    describe('Pattern Matching Puzzle - Memory Game', () => {
        it('should render memory game puzzle with cards', () => {
            const puzzle = {
                id: 'memory-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Match all pairs',
                challengeType: 'memory',
                cards: [
                    { pair: '1', symbol: '🏎️' },
                    { pair: '1', symbol: '🏎️' },
                    { pair: '2', symbol: '⚽' },
                    { pair: '2', symbol: '⚽' }
                ]
            };
            
            const html = uiManager.renderMemoryPuzzle(puzzle);
            
            expect(html).toContain('memory-game');
            expect(html).toContain('Match all pairs');
            expect(html).toContain('🎮 Memory Game');
            expect(html).toContain('memory-grid');
            expect(html).toContain('memory-card');
        });
        
        it('should render all memory cards with correct data attributes', () => {
            const puzzle = {
                id: 'memory-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Match pairs',
                challengeType: 'memory',
                cards: [
                    { pair: '1', symbol: '🏎️' },
                    { pair: '1', symbol: '🏎️' },
                    { pair: '2', symbol: '⚽' },
                    { pair: '2', symbol: '⚽' }
                ]
            };
            
            const html = uiManager.renderMemoryPuzzle(puzzle);
            
            expect(html).toContain('data-index="0"');
            expect(html).toContain('data-index="1"');
            expect(html).toContain('data-index="2"');
            expect(html).toContain('data-index="3"');
            expect(html).toContain('data-pair="1"');
            expect(html).toContain('data-pair="2"');
        });
        
        it('should render card symbols', () => {
            const puzzle = {
                id: 'memory-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Match',
                challengeType: 'memory',
                cards: [
                    { pair: '1', symbol: '🏎️' },
                    { pair: '2', symbol: '⚽' }
                ]
            };
            
            const html = uiManager.renderMemoryPuzzle(puzzle);
            
            expect(html).toContain('🏎️');
            expect(html).toContain('⚽');
            expect(html).toContain('card-front');
            expect(html).toContain('card-back');
        });
        
        it('should display match counter', () => {
            const puzzle = {
                id: 'memory-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Match',
                challengeType: 'memory',
                cards: [
                    { pair: '1', symbol: '🏎️' },
                    { pair: '1', symbol: '🏎️' }
                ]
            };
            
            const html = uiManager.renderMemoryPuzzle(puzzle);
            
            expect(html).toContain('Matches:');
            expect(html).toContain('match-count');
            expect(html).toContain('memory-stats');
        });
    });
    
    describe('Pattern Puzzle Rendering', () => {
        it('should render spot-the-difference when challengeType is spot-difference', () => {
            const puzzle = {
                id: 'pattern-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Find it',
                imageUrl: 'assets/test.jpg',
                challengeType: 'spot-difference',
                correctAreas: []
            };
            
            const html = uiManager.renderPatternPuzzle(puzzle);
            
            expect(html).toContain('spot-difference');
            expect(html).toContain('🔍 Spot the Difference');
        });
        
        it('should render memory game when challengeType is memory', () => {
            const puzzle = {
                id: 'memory-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Match',
                challengeType: 'memory',
                cards: [
                    { pair: '1', symbol: '🏎️' },
                    { pair: '1', symbol: '🏎️' }
                ]
            };
            
            const html = uiManager.renderPatternPuzzle(puzzle);
            
            expect(html).toContain('memory-game');
            expect(html).toContain('🎮 Memory Game');
        });
        
        it('should return error message for unknown pattern type', () => {
            const puzzle = {
                id: 'pattern-1',
                type: 'pattern-match',
                theme: 'personal',
                question: 'Unknown',
                challengeType: 'unknown-type'
            };
            
            const html = uiManager.renderPatternPuzzle(puzzle);
            
            expect(html).toContain('Unknown pattern puzzle type');
        });
    });
    
    describe('Completion Screen', () => {
        it('should render completion screen with all required elements', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                playerName: 'Test Player'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('completion-screen');
            expect(container.innerHTML).toContain('You Did It! 🎉');
            expect(container.innerHTML).toContain('🏁');
            expect(container.innerHTML).toContain('Thank you for being patient with me');
            expect(container.innerHTML).toContain('Get Well Soon');
            expect(container.innerHTML).toContain('8/8');
            expect(container.innerHTML).toContain('2m 0s');
            expect(container.innerHTML).toContain('Play Again 🏎️');
            expect(container.innerHTML).toContain('Share 📤');
        });
        
        it('should display correct puzzle count in completion screen', () => {
            const stats = {
                puzzlesSolved: 5,
                totalPuzzles: 8,
                timeTaken: 300,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('5/8');
        });
        
        it('should format time correctly in completion screen', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 45,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('45s');
        });
        
        it('should format time with minutes and seconds', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 125,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('2m 5s');
        });
        
        it('should include apology message in completion screen', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('Thank you for being patient with me');
            expect(container.innerHTML).toContain('I hope this little race brought a smile to your face');
        });
        
        it('should include get well soon message', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('Get Well Soon');
            expect(container.innerHTML).toContain('💚');
        });
        
        it('should include couple photo with default URL if not provided', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('couple-photo');
            expect(container.innerHTML).toContain('assets/couple-photo.jpg');
        });
        
        it('should use provided photo URL if available', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                playerName: 'Test',
                photoUrl: 'assets/custom-photo.jpg'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('assets/custom-photo.jpg');
            expect(container.innerHTML).not.toContain('assets/couple-photo.jpg');
        });
        
        it('should include restart and share buttons', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('Play Again 🏎️');
            expect(container.innerHTML).toContain('Share 📤');
            expect(container.innerHTML).toContain('completion-actions');
        });
        
        it('should set current screen to completion', () => {
            const stats = {
                puzzlesSolved: 8,
                totalPuzzles: 8,
                timeTaken: 120,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(uiManager.currentScreen).toBe('completion');
        });
        
        it('should display performance summary with correct labels', () => {
            const stats = {
                puzzlesSolved: 7,
                totalPuzzles: 8,
                timeTaken: 180,
                playerName: 'Test'
            };
            
            uiManager.renderCompletionScreen(container, stats);
            
            expect(container.innerHTML).toContain('Puzzles Solved:');
            expect(container.innerHTML).toContain('Time Taken:');
            expect(container.innerHTML).toContain('7/8');
            expect(container.innerHTML).toContain('3m 0s');
        });
    });
});
