/**
 * Unit Tests for Puzzle Engine
 * 
 * Tests core functionality of puzzle loading, retrieval, and validation.
 * Validates: Requirements 3.5, 3.6, 4.3
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PuzzleEngine } from './PuzzleEngine.js';

describe('PuzzleEngine - Unit Tests', () => {
    let puzzleEngine;
    
    beforeEach(async () => {
        puzzleEngine = new PuzzleEngine();
        await puzzleEngine.loadPuzzles();
    });
    
    describe('Puzzle Loading', () => {
        it('should load puzzles from data source', async () => {
            const engine = new PuzzleEngine();
            await engine.loadPuzzles();
            
            expect(engine.puzzles).toBeDefined();
            expect(engine.puzzles.length).toBeGreaterThan(0);
        });
        
        it('should have puzzles with required properties', () => {
            puzzleEngine.puzzles.forEach(puzzle => {
                expect(puzzle).toHaveProperty('id');
                expect(puzzle).toHaveProperty('type');
                expect(puzzle).toHaveProperty('question');
                
                // Trivia puzzles should have correctAnswerIndex
                if (puzzle.type === 'trivia') {
                    expect(puzzle).toHaveProperty('correctAnswerIndex');
                }
            });
        });
    });
    
    describe('Get Current Puzzle', () => {
        it('should return first puzzle initially', () => {
            const puzzle = puzzleEngine.getCurrentPuzzle();
            
            expect(puzzle).toBeDefined();
            expect(puzzle).toBe(puzzleEngine.puzzles[0]);
        });
        
        it('should return correct puzzle at current index', () => {
            puzzleEngine.currentPuzzleIndex = 2;
            const puzzle = puzzleEngine.getCurrentPuzzle();
            
            expect(puzzle).toBe(puzzleEngine.puzzles[2]);
        });
        
        it('should return null when index is out of bounds', () => {
            puzzleEngine.currentPuzzleIndex = puzzleEngine.puzzles.length;
            const puzzle = puzzleEngine.getCurrentPuzzle();
            
            expect(puzzle).toBeNull();
        });
        
        it('should return null when index is negative', () => {
            puzzleEngine.currentPuzzleIndex = -1;
            const puzzle = puzzleEngine.getCurrentPuzzle();
            
            expect(puzzle).toBeNull();
        });
    });
    
    describe('Get Puzzle By Index', () => {
        it('should return puzzle at specified index', () => {
            const puzzle = puzzleEngine.getPuzzleByIndex(0);
            
            expect(puzzle).toBe(puzzleEngine.puzzles[0]);
        });
        
        it('should return null for out of bounds index', () => {
            const puzzle = puzzleEngine.getPuzzleByIndex(999);
            
            expect(puzzle).toBeNull();
        });
        
        it('should return null for negative index', () => {
            const puzzle = puzzleEngine.getPuzzleByIndex(-1);
            
            expect(puzzle).toBeNull();
        });
    });
    
    describe('Answer Validation - Correct Answers', () => {
        it('should validate correct answer for trivia puzzle', () => {
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            const isValid = puzzleEngine.validateAnswer(puzzle, puzzle.correctAnswerIndex);
            
            expect(isValid).toBe(true);
        });
        
        it('should validate correct answer at any index', () => {
            puzzleEngine.puzzles.forEach(puzzle => {
                if (puzzle.type === 'trivia') {
                    const isValid = puzzleEngine.validateAnswer(puzzle, puzzle.correctAnswerIndex);
                    expect(isValid).toBe(true);
                }
            });
        });
    });
    
    describe('Answer Validation - Incorrect Answers', () => {
        it('should reject incorrect answer for trivia puzzle', () => {
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            const wrongIndex = (puzzle.correctAnswerIndex + 1) % puzzle.options.length;
            const isValid = puzzleEngine.validateAnswer(puzzle, wrongIndex);
            
            expect(isValid).toBe(false);
        });
        
        it('should reject all incorrect answers', () => {
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            
            for (let i = 0; i < puzzle.options.length; i++) {
                if (i !== puzzle.correctAnswerIndex) {
                    const isValid = puzzleEngine.validateAnswer(puzzle, i);
                    expect(isValid).toBe(false);
                }
            }
        });
    });
    
    describe('Answer Validation - Edge Cases', () => {
        it('should return false for null puzzle', () => {
            const isValid = puzzleEngine.validateAnswer(null, 0);
            
            expect(isValid).toBe(false);
        });
        
        it('should return false for undefined puzzle', () => {
            const isValid = puzzleEngine.validateAnswer(undefined, 0);
            
            expect(isValid).toBe(false);
        });
        
        it('should validate pattern match puzzle', () => {
            const patternPuzzle = puzzleEngine.puzzles.find(p => p.type === 'pattern-match');
            
            if (patternPuzzle) {
                const isValid = puzzleEngine.validateAnswer(patternPuzzle, true);
                expect(isValid).toBe(true);
            }
        });
    });
    
    describe('Get Next Puzzle', () => {
        it('should advance to next puzzle', () => {
            const firstPuzzle = puzzleEngine.getCurrentPuzzle();
            const nextPuzzle = puzzleEngine.getNextPuzzle();
            
            expect(nextPuzzle).not.toBe(firstPuzzle);
            expect(puzzleEngine.currentPuzzleIndex).toBe(1);
        });
        
        it('should return correct puzzle after advancing', () => {
            puzzleEngine.getNextPuzzle();
            const current = puzzleEngine.getCurrentPuzzle();
            
            expect(current).toBe(puzzleEngine.puzzles[1]);
        });
        
        it('should return null when at last puzzle', () => {
            puzzleEngine.currentPuzzleIndex = puzzleEngine.puzzles.length - 1;
            const nextPuzzle = puzzleEngine.getNextPuzzle();
            
            expect(nextPuzzle).toBeNull();
        });
        
        it('should advance through all puzzles sequentially', () => {
            for (let i = 0; i < puzzleEngine.puzzles.length - 1; i++) {
                const nextPuzzle = puzzleEngine.getNextPuzzle();
                expect(nextPuzzle).toBeDefined();
                expect(nextPuzzle).toBe(puzzleEngine.puzzles[i + 1]);
            }
        });
    });
    
    describe('Get Total Puzzles', () => {
        it('should return total number of puzzles', () => {
            const total = puzzleEngine.getTotalPuzzles();
            
            expect(total).toBe(puzzleEngine.puzzles.length);
            expect(total).toBeGreaterThan(0);
        });
    });
    
    describe('Randomize Answer Options', () => {
        it('should randomize options for trivia puzzle', () => {
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            const randomized = puzzleEngine.randomizeAnswerOptions(puzzle);
            
            expect(randomized).toBeDefined();
            expect(randomized.options).toBeDefined();
            expect(randomized.correctAnswerIndex).toBeDefined();
        });
        
        it('should preserve all options when randomizing', () => {
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            const originalOptions = [...puzzle.options];
            const randomized = puzzleEngine.randomizeAnswerOptions(puzzle);
            
            expect(randomized.options.sort()).toEqual(originalOptions.sort());
        });
        
        it('should update correct answer index after randomization', () => {
            const puzzle = puzzleEngine.puzzles.find(p => p.type === 'trivia');
            const correctAnswer = puzzle.options[puzzle.correctAnswerIndex];
            const randomized = puzzleEngine.randomizeAnswerOptions(puzzle);
            
            expect(randomized.options[randomized.correctAnswerIndex]).toBe(correctAnswer);
        });
        
        it('should not randomize non-trivia puzzles', () => {
            const patternPuzzle = puzzleEngine.puzzles.find(p => p.type === 'pattern-match');
            
            if (patternPuzzle) {
                const result = puzzleEngine.randomizeAnswerOptions(patternPuzzle);
                expect(result).toBe(patternPuzzle);
            }
        });
    });
    
    describe('Boundary Cases', () => {
        it('should handle first puzzle correctly', () => {
            puzzleEngine.currentPuzzleIndex = 0;
            const puzzle = puzzleEngine.getCurrentPuzzle();
            
            expect(puzzle).toBe(puzzleEngine.puzzles[0]);
        });
        
        it('should handle last puzzle correctly', () => {
            const lastIndex = puzzleEngine.puzzles.length - 1;
            puzzleEngine.currentPuzzleIndex = lastIndex;
            const puzzle = puzzleEngine.getCurrentPuzzle();
            
            expect(puzzle).toBe(puzzleEngine.puzzles[lastIndex]);
        });
        
        it('should not advance past last puzzle', () => {
            puzzleEngine.currentPuzzleIndex = puzzleEngine.puzzles.length - 1;
            const nextPuzzle = puzzleEngine.getNextPuzzle();
            
            expect(nextPuzzle).toBeNull();
            expect(puzzleEngine.currentPuzzleIndex).toBe(puzzleEngine.puzzles.length - 1);
        });
    });
});
