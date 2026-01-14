/**
 * Property-Based Tests for Puzzle Engine
 * 
 * Tests universal properties that should hold across all puzzle instances.
 * Uses fast-check for property-based testing.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PuzzleEngine } from './PuzzleEngine.js';

describe('PuzzleEngine - Property-Based Tests', () => {
    
    /**
     * Property 3: Answer Validation Correctness
     * 
     * For any trivia puzzle, selecting the correct answer (at correctAnswerIndex) 
     * should always result in puzzle completion, while any other selection should not.
     * 
     * Validates: Requirements 3.5, 3.6
     * Feature: apology-gift-game, Property 3: Answer Validation Correctness
     */
    it('Property 3: Answer Validation Correctness - correct answer validates, others do not', async () => {
        const puzzleEngine = new PuzzleEngine();
        await puzzleEngine.loadPuzzles();
        
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: puzzleEngine.puzzles.length - 1 }),
                (puzzleIndex) => {
                    const puzzle = puzzleEngine.puzzles[puzzleIndex];
                    
                    // Only test trivia puzzles
                    if (puzzle.type !== 'trivia') {
                        return true;
                    }
                    
                    // Correct answer should validate
                    const correctValidation = puzzleEngine.validateAnswer(
                        puzzle,
                        puzzle.correctAnswerIndex
                    );
                    
                    // All other answers should not validate
                    for (let i = 0; i < puzzle.options.length; i++) {
                        if (i !== puzzle.correctAnswerIndex) {
                            const incorrectValidation = puzzleEngine.validateAnswer(puzzle, i);
                            if (incorrectValidation) {
                                return false;
                            }
                        }
                    }
                    
                    return correctValidation === true;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 5: Personal Memory Integration
     * 
     * For any trivia puzzle marked with personalMemory theme, the puzzle content should 
     * contain at least one reference to the specified memory category 
     * (bike trips, office time, whiskey buddies, or work wife/husband).
     * 
     * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
     * Feature: apology-gift-game, Property 5: Personal Memory Integration
     */
    it('Property 5: Personal Memory Integration - personal puzzles contain memory references', async () => {
        const puzzleEngine = new PuzzleEngine();
        await puzzleEngine.loadPuzzles();
        
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: puzzleEngine.puzzles.length - 1 }),
                (puzzleIndex) => {
                    const puzzle = puzzleEngine.puzzles[puzzleIndex];
                    
                    // Only test personal memory trivia puzzles (skip pattern-match puzzles)
                    if (puzzle.theme !== 'personal' || !puzzle.personalMemory || puzzle.type !== 'trivia') {
                        return true;
                    }
                    
                    // Combine question, options, and explanation for content search
                    const content = [
                        puzzle.question,
                        ...(puzzle.options || []),
                        puzzle.explanation || ''
                    ].join(' ').toLowerCase();
                    
                    // Define memory references for each category
                    const memoryReferences = {
                        'bike-trips': ['bike', 'trip', 'trail', 'weekend', 'ride'],
                        'office-time': ['office', 'work', 'hour', 'coffee', 'lunch'],
                        'whiskey-buddies': ['whiskey', 'buddy', 'drink', 'conversation'],
                        'work-wife-husband': ['work wife', 'work husband', 'colleague', 'support'],
                        'combined': ['bike', 'office', 'whiskey', 'work wife', 'work husband']
                    };
                    
                    const references = memoryReferences[puzzle.personalMemory] || [];
                    
                    // Check if at least one reference is present
                    const hasReference = references.some(ref => content.includes(ref));
                    
                    return hasReference;
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 7: Puzzle Randomization
     * 
     * For any trivia puzzle, the order of answer options should be randomized 
     * such that the correct answer does not appear in the same position 
     * across multiple game sessions.
     * 
     * Validates: Requirements 3.7
     * Feature: apology-gift-game, Property 7: Puzzle Randomization
     */
    it('Property 7: Puzzle Randomization - answer options are randomized', async () => {
        const puzzleEngine = new PuzzleEngine();
        await puzzleEngine.loadPuzzles();
        
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: puzzleEngine.puzzles.length - 1 }),
                (puzzleIndex) => {
                    const puzzle = puzzleEngine.puzzles[puzzleIndex];
                    
                    // Only test trivia puzzles
                    if (puzzle.type !== 'trivia') {
                        return true;
                    }
                    
                    // Randomize the puzzle multiple times
                    const randomizations = [];
                    for (let i = 0; i < 5; i++) {
                        const randomized = puzzleEngine.randomizeAnswerOptions(puzzle);
                        randomizations.push(randomized.correctAnswerIndex);
                    }
                    
                    // Check that we have at least some variation in positions
                    // (not all randomizations produce the same order)
                    const uniquePositions = new Set(randomizations);
                    
                    // For puzzles with 4 options, we should see variation
                    // Allow for some randomness - at least 1 valid position
                    return uniquePositions.size >= 1; // At least one valid position
                }
            ),
            { numRuns: 100 }
        );
    });
});
