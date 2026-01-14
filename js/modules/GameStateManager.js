/**
 * Game State Manager
 * 
 * Maintains and updates the game state throughout the session.
 * Tracks puzzle progress, car position, and game completion status.
 */

export class GameStateManager {
    constructor() {
        this.currentPuzzleIndex = -1; // -1 means welcome screen
        this.totalPuzzles = 11; // Updated to match actual puzzle count (F1: 2, Football: 2, Office: 2, Personal: 5)
        this.completedPuzzles = 0;
        this.carPosition = 0; // 0-100 percentage
        this.startTime = null;
        this.endTime = null;
        this.isGameComplete = false;
        this.playerName = '';
    }
    
    /**
     * Initialize the game with default values
     */
    initializeGame() {
        this.currentPuzzleIndex = -1;
        this.completedPuzzles = 0;
        this.carPosition = 0;
        this.startTime = null;
        this.endTime = null;
        this.isGameComplete = false;
        this.playerName = '';
    }
    
    /**
     * Advance to the next puzzle and update car position
     */
    advancePuzzle() {
        if (this.currentPuzzleIndex < this.totalPuzzles) {
            this.currentPuzzleIndex++;
            this.completedPuzzles++;
            this.updateCarPosition();
            
            if (this.startTime === null) {
                this.startTime = new Date();
            }
        }
    }
    
    /**
     * Update car position based on completed puzzles
     * Position = (completed / total) * 100
     */
    updateCarPosition() {
        this.carPosition = (this.completedPuzzles / this.totalPuzzles) * 100;
    }
    
    /**
     * Get the current puzzle index
     */
    getCurrentPuzzleIndex() {
        return this.currentPuzzleIndex;
    }
    
    /**
     * Get game progress object
     */
    getGameProgress() {
        return {
            currentPuzzleIndex: this.currentPuzzleIndex,
            completedPuzzles: this.completedPuzzles,
            totalPuzzles: this.totalPuzzles,
            carPosition: this.carPosition,
            isGameComplete: this.isGameComplete
        };
    }
    
    /**
     * Mark game as complete
     */
    completeGame() {
        this.isGameComplete = true;
        this.endTime = new Date();
    }
    
    /**
     * Get game statistics
     */
    getGameStats() {
        const timeTaken = this.endTime && this.startTime 
            ? Math.round((this.endTime - this.startTime) / 1000)
            : 0;
        
        return {
            puzzlesSolved: this.completedPuzzles,
            totalPuzzles: this.totalPuzzles,
            timeTaken: timeTaken,
            playerName: this.playerName,
            photoUrl: 'assets/couple-photo.jpg',
            customMessage: 'Hey daddy, hope you are doing good. I just wanted to tell you that I am grateful for whatever we have right now, whatever stage we are at currently. And sorry for my misbehavior. I just tried turning on my creative mind which was I guess off from quite a time and I have not done something like this. I\'ve done that in last Udaipur trip, but after that not done something. So just tried creating this short trivia game, tried creating something like F1, but it can take lot of time, so this.',
            customMessage2: 'I know you are not feeling good. You are having fever and we are also not at good stage right now. So just wanted to send you a good wishes. Feel better soon so that I can meet you, I can hug you, I can kiss you. You are the best. I\'m sorry. Thank you and also thank you for being patient with me and sorry for whatever happened. I cannot undo it, but I\'ll try that I\'ll not continue this behavior. At least I can give it a try. I know it\'s not happening, but I will not stop this trying process. Also, I will try to keep the balance maintained. So sad things happened. I cannot undo it, but I will try to create so many good things so that it will overcome and balance that sad thing. Hope you will like it. I love you. Tedhi hu par aapki hu!!'
        };
    }
    
    /**
     * Reset the game to initial state
     */
    resetGame() {
        this.initializeGame();
    }
    
    /**
     * Get current game state for persistence
     */
    getState() {
        return {
            currentPuzzleIndex: this.currentPuzzleIndex,
            completedPuzzles: this.completedPuzzles,
            carPosition: this.carPosition,
            startTime: this.startTime,
            endTime: this.endTime,
            isGameComplete: this.isGameComplete,
            playerName: this.playerName
        };
    }
    
    /**
     * Restore game state from saved data
     */
    restoreState(state) {
        this.currentPuzzleIndex = state.currentPuzzleIndex;
        this.completedPuzzles = state.completedPuzzles;
        this.carPosition = state.carPosition;
        this.startTime = state.startTime ? new Date(state.startTime) : null;
        this.endTime = state.endTime ? new Date(state.endTime) : null;
        this.isGameComplete = state.isGameComplete;
        this.playerName = state.playerName || '';
    }
}
