/**
 * Puzzle Engine
 * 
 * Loads, manages, and validates puzzles.
 * Handles puzzle data and answer validation logic.
 */

export class PuzzleEngine {
    constructor() {
        this.puzzles = [];
        this.currentPuzzleIndex = 0;
    }
    
    /**
     * Load puzzles from data source
     */
    async loadPuzzles() {
        try {
            // Import puzzle data
            const { puzzleData } = await import('../data/puzzles.js');
            this.puzzles = puzzleData;
            
            if (this.puzzles.length === 0) {
                throw new Error('No puzzles loaded');
            }
        } catch (error) {
            console.error('Failed to load puzzles:', error);
            throw error;
        }
    }
    
    /**
     * Get the current puzzle
     */
    getCurrentPuzzle() {
        if (this.currentPuzzleIndex >= 0 && this.currentPuzzleIndex < this.puzzles.length) {
            return this.puzzles[this.currentPuzzleIndex];
        }
        return null;
    }
    
    /**
     * Get puzzle by index
     */
    getPuzzleByIndex(index) {
        if (index >= 0 && index < this.puzzles.length) {
            return this.puzzles[index];
        }
        return null;
    }
    
    /**
     * Validate an answer for the current puzzle
     */
    validateAnswer(puzzle, answer) {
        if (!puzzle) return false;
        
        if (puzzle.type === 'trivia') {
            // For trivia, check if answer matches correct answer index
            return answer === puzzle.correctAnswerIndex;
        } else if (puzzle.type === 'pattern-match') {
            // For pattern matching, validate against correct areas
            return this.validatePatternMatch(puzzle, answer);
        }
        
        return false;
    }
    
    /**
     * Validate pattern matching answer
     */
    validatePatternMatch(puzzle, answer) {
        // For pattern matching puzzles, answer is true when puzzle is solved
        // The UI handles the actual validation through click detection
        return answer === true;
    }
    
    /**
     * Get the next puzzle
     */
    getNextPuzzle() {
        if (this.currentPuzzleIndex < this.puzzles.length - 1) {
            this.currentPuzzleIndex++;
            return this.getCurrentPuzzle();
        }
        return null;
    }
    
    /**
     * Get total number of puzzles
     */
    getTotalPuzzles() {
        return this.puzzles.length;
    }
    
    /**
     * Randomize answer options for a trivia puzzle
     */
    randomizeAnswerOptions(puzzle) {
        if (puzzle.type !== 'trivia') return puzzle;
        
        const options = [...puzzle.options];
        const correctAnswer = options[puzzle.correctAnswerIndex];
        
        // Fisher-Yates shuffle
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        // Find new index of correct answer
        const newCorrectIndex = options.indexOf(correctAnswer);
        
        return {
            ...puzzle,
            options: options,
            correctAnswerIndex: newCorrectIndex
        };
    }
}
