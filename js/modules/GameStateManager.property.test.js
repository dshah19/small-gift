/**
 * Property-Based Tests for GameStateManager
 * 
 * Tests universal properties that should hold across all valid game states.
 * Uses fast-check for property-based testing with minimum 100 iterations.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { GameStateManager } from './GameStateManager.js';

describe('GameStateManager - Property-Based Tests', () => {
    
    /**
     * Property 1: Puzzle Progression Invariant
     * 
     * For any game session, the car's position on the track should always equal
     * (completed puzzles / total puzzles) * 100, ensuring the visual representation
     * accurately reflects progress.
     * 
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('Property 1: Puzzle Progression Invariant - car position equals (completed / total) * 100', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                (completedCount) => {
                    const gameState = new GameStateManager();
                    
                    // Advance puzzle completedCount times
                    for (let i = 0; i < completedCount; i++) {
                        gameState.advancePuzzle();
                    }
                    
                    // Calculate expected position
                    const expectedPosition = (completedCount / gameState.totalPuzzles) * 100;
                    
                    // Verify car position matches expected calculation
                    expect(gameState.carPosition).toBe(expectedPosition);
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 2: Puzzle Completion Idempotence
     * 
     * For any puzzle, solving it multiple times should result in the same game state
     * progression—solving a puzzle twice should not advance the car twice.
     * 
     * Validates: Requirements 2.1, 2.2
     */
    it('Property 2: Puzzle Completion Idempotence - advancing twice gives same result as advancing once', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 7 }),
                (puzzleIndex) => {
                    const gameState1 = new GameStateManager();
                    const gameState2 = new GameStateManager();
                    
                    // Advance to the same puzzle index in both
                    for (let i = 0; i < puzzleIndex; i++) {
                        gameState1.advancePuzzle();
                        gameState2.advancePuzzle();
                    }
                    
                    // Record state after first advance
                    const position1 = gameState1.carPosition;
                    const completed1 = gameState1.completedPuzzles;
                    
                    // Advance one more time in gameState1
                    gameState1.advancePuzzle();
                    const positionAfterAdvance = gameState1.carPosition;
                    const completedAfterAdvance = gameState1.completedPuzzles;
                    
                    // Advance one more time in gameState2
                    gameState2.advancePuzzle();
                    
                    // Both should have same state after one advance
                    expect(gameState1.carPosition).toBe(gameState2.carPosition);
                    expect(gameState1.completedPuzzles).toBe(gameState2.completedPuzzles);
                    expect(gameState1.currentPuzzleIndex).toBe(gameState2.currentPuzzleIndex);
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 3: Completed Puzzles Never Decreases
     * 
     * For any sequence of puzzle advancements, the completed puzzle count should
     * never decrease—it should only stay the same or increase.
     * 
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('Property 3: Completed Puzzles Never Decreases - monotonic increase', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                (advanceCount) => {
                    const gameState = new GameStateManager();
                    let previousCompleted = 0;
                    
                    for (let i = 0; i < advanceCount; i++) {
                        gameState.advancePuzzle();
                        expect(gameState.completedPuzzles).toBeGreaterThanOrEqual(previousCompleted);
                        previousCompleted = gameState.completedPuzzles;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 4: Car Position Bounds
     * 
     * For any game state, the car position should always be between 0 and 100,
     * representing a valid percentage along the track.
     * 
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('Property 4: Car Position Bounds - always between 0 and 100', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                (advanceCount) => {
                    const gameState = new GameStateManager();
                    
                    for (let i = 0; i < advanceCount; i++) {
                        gameState.advancePuzzle();
                        expect(gameState.carPosition).toBeGreaterThanOrEqual(0);
                        expect(gameState.carPosition).toBeLessThanOrEqual(100);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 5: Puzzle Index Bounds
     * 
     * For any game state, the current puzzle index should be between -1 (welcome screen)
     * and totalPuzzles - 1 (last puzzle).
     * 
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('Property 5: Puzzle Index Bounds - always between -1 and totalPuzzles-1', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                (advanceCount) => {
                    const gameState = new GameStateManager();
                    
                    expect(gameState.currentPuzzleIndex).toBeGreaterThanOrEqual(-1);
                    expect(gameState.currentPuzzleIndex).toBeLessThan(gameState.totalPuzzles);
                    
                    for (let i = 0; i < advanceCount; i++) {
                        gameState.advancePuzzle();
                        expect(gameState.currentPuzzleIndex).toBeGreaterThanOrEqual(-1);
                        expect(gameState.currentPuzzleIndex).toBeLessThan(gameState.totalPuzzles);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 6: Completed Puzzles Never Exceeds Total
     * 
     * For any game state, the number of completed puzzles should never exceed
     * the total number of puzzles.
     * 
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('Property 6: Completed Puzzles Never Exceeds Total - invariant constraint', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 10 }),
                (advanceCount) => {
                    const gameState = new GameStateManager();
                    
                    for (let i = 0; i < advanceCount; i++) {
                        gameState.advancePuzzle();
                    }
                    
                    expect(gameState.completedPuzzles).toBeLessThanOrEqual(gameState.totalPuzzles);
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 7: Reset Returns to Initial State
     * 
     * For any game state, calling resetGame() should return the game to its
     * initial state with all counters at zero.
     * 
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('Property 7: Reset Returns to Initial State - idempotent reset', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                (advanceCount) => {
                    const gameState = new GameStateManager();
                    
                    // Advance some puzzles
                    for (let i = 0; i < advanceCount; i++) {
                        gameState.advancePuzzle();
                    }
                    
                    // Reset
                    gameState.resetGame();
                    
                    // Verify back to initial state
                    expect(gameState.currentPuzzleIndex).toBe(-1);
                    expect(gameState.completedPuzzles).toBe(0);
                    expect(gameState.carPosition).toBe(0);
                    expect(gameState.isGameComplete).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });
    
    /**
     * Property 8: Progress Object Consistency
     * 
     * For any game state, the progress object returned by getGameProgress()
     * should have values consistent with the internal state.
     * 
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('Property 8: Progress Object Consistency - progress reflects state', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 8 }),
                (advanceCount) => {
                    const gameState = new GameStateManager();
                    
                    for (let i = 0; i < advanceCount; i++) {
                        gameState.advancePuzzle();
                    }
                    
                    const progress = gameState.getGameProgress();
                    
                    // Verify progress object matches internal state
                    expect(progress.currentPuzzleIndex).toBe(gameState.currentPuzzleIndex);
                    expect(progress.completedPuzzles).toBe(gameState.completedPuzzles);
                    expect(progress.totalPuzzles).toBe(gameState.totalPuzzles);
                    expect(progress.carPosition).toBe(gameState.carPosition);
                    expect(progress.isGameComplete).toBe(gameState.isGameComplete);
                }
            ),
            { numRuns: 100 }
        );
    });
});
