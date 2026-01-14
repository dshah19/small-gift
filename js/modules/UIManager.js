/**
 * UI Manager
 * 
 * Handles all user interface rendering and interactions.
 * Manages screen rendering, feedback display, and user input.
 */

export class UIManager {
    constructor() {
        this.currentScreen = null;
        this.feedbackTimeout = null;
    }
    
    /**
     * Render the welcome screen
     */
    renderWelcomeScreen(container, onStartClick) {
        container.innerHTML = `
            <div class="welcome-screen" role="main" aria-label="Welcome screen">
                <div class="welcome-content">
                    <h1 class="welcome-title">🎁 Small Gift</h1>
                    <p class="welcome-subtitle">Solve puzzles to complete the race and unlock a special message</p>
                    <button class="btn-primary btn-start" onclick="window.gameApp.startGame()" aria-label="Start the race game">
                        Start Race 🏁
                    </button>
                </div>
            </div>
        `;
        
        this.currentScreen = 'welcome';
    }
    
    /**
     * Render the main game screen
     */
    renderGameScreen(container, puzzle, progress, onAnswerSubmit) {
        const themeClass = puzzle && puzzle.theme ? `data-theme="${puzzle.theme}"` : '';
        
        container.innerHTML = `
            <div class="game-screen" role="main" aria-label="Game screen">
                <div class="game-header">
                    <div class="progress-section">
                        <div class="progress-text">
                            <span class="progress-label">Progress:</span>
                            <span class="progress-value" aria-live="polite" aria-label="Puzzles completed">${progress.completedPuzzles}/${progress.totalPuzzles}</span>
                        </div>
                        <div class="progress-bar" role="progressbar" aria-valuenow="${progress.carPosition}" aria-valuemin="0" aria-valuemax="100" aria-label="Race progress">
                            <div class="progress-fill" style="width: ${progress.carPosition}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="track-section">
                    <div class="track" aria-label="Race track with car position at ${progress.carPosition}%">
                        <div class="car" style="left: ${progress.carPosition}%" aria-hidden="true">🏎️</div>
                    </div>
                </div>
                
                <div class="puzzle-section" ${themeClass}>
                    ${this.renderPuzzleContent(puzzle, onAnswerSubmit)}
                </div>
            </div>
        `;
        
        // Setup pattern puzzle interactions if needed
        if (puzzle && puzzle.type === 'pattern-match') {
            if (puzzle.challengeType === 'spot-difference') {
                this.setupSpotDifferencePuzzle(puzzle);
            } else if (puzzle.challengeType === 'memory') {
                this.setupMemoryPuzzle(puzzle);
            }
        }
        
        this.currentScreen = 'game';
    }
    
    /**
     * Render puzzle content based on type
     */
    renderPuzzleContent(puzzle, onAnswerSubmit) {
        if (!puzzle) {
            return '<p>Loading puzzle...</p>';
        }
        
        if (puzzle.type === 'trivia') {
            return this.renderTriviaPuzzle(puzzle, onAnswerSubmit);
        } else if (puzzle.type === 'pattern-match') {
            return this.renderPatternPuzzle(puzzle, onAnswerSubmit);
        }
        
        return '<p>Unknown puzzle type</p>';
    }
    
    /**
     * Render trivia puzzle
     */
    renderTriviaPuzzle(puzzle, onAnswerSubmit) {
        const optionsHTML = puzzle.options.map((option, index) => `
            <button class="puzzle-option" data-index="${index}" onclick="window.gameApp.handlePuzzleAnswer(${index})" aria-label="Answer option: ${option}">
                ${option}
            </button>
        `).join('');
        
        return `
            <div class="trivia-puzzle" role="region" aria-label="Trivia puzzle">
                <div class="puzzle-theme-badge" data-theme="${puzzle.theme}" aria-label="${this.getThemeLabel(puzzle.theme)}">
                    ${this.getThemeLabel(puzzle.theme)}
                </div>
                <h2 class="puzzle-question">${puzzle.question}</h2>
                <div class="puzzle-options" role="group" aria-label="Answer options">
                    ${optionsHTML}
                </div>
                <div class="puzzle-feedback" id="puzzle-feedback" role="status" aria-live="polite" style="display: none;"></div>
            </div>
        `;
    }
    
    /**
     * Get theme label for display
     */
    getThemeLabel(theme) {
        const labels = {
            'f1': '🏎️ F1 Racing',
            'football': '⚽ Football',
            'office': '📺 The Office',
            'personal': '💝 Personal Memory'
        };
        return labels[theme] || theme;
    }
    
    /**
     * Show puzzle feedback (correct/incorrect)
     */
    showPuzzleFeedback(message, type = 'info') {
        const feedbackElement = document.getElementById('puzzle-feedback');
        if (!feedbackElement) return;
        
        feedbackElement.className = `puzzle-feedback feedback-${type}`;
        feedbackElement.textContent = message;
        feedbackElement.style.display = 'block';
        
        // Auto-hide after 2 seconds for success, keep visible for errors
        if (type === 'success') {
            setTimeout(() => {
                feedbackElement.style.display = 'none';
            }, 2000);
        }
    }
    
    /**
     * Disable all puzzle options
     */
    disablePuzzleOptions() {
        const options = document.querySelectorAll('.puzzle-option');
        options.forEach(option => {
            option.disabled = true;
            option.style.pointerEvents = 'none';
            option.style.opacity = '0.6';
        });
    }
    
    /**
     * Enable all puzzle options
     */
    enablePuzzleOptions() {
        const options = document.querySelectorAll('.puzzle-option');
        options.forEach(option => {
            option.disabled = false;
            option.style.pointerEvents = 'auto';
            option.style.opacity = '1';
        });
    }
    
    /**
     * Highlight correct answer
     */
    highlightCorrectAnswer(correctIndex) {
        const options = document.querySelectorAll('.puzzle-option');
        options.forEach((option, index) => {
            if (index === correctIndex) {
                option.classList.add('correct-answer');
            }
        });
    }
    
    /**
     * Highlight selected answer
     */
    highlightSelectedAnswer(selectedIndex) {
        const options = document.querySelectorAll('.puzzle-option');
        options.forEach((option, index) => {
            if (index === selectedIndex) {
                option.classList.add('selected-answer');
            }
        });
    }
    
    /**
     * Clear answer highlights
     */
    clearAnswerHighlights() {
        const options = document.querySelectorAll('.puzzle-option');
        options.forEach(option => {
            option.classList.remove('correct-answer', 'selected-answer', 'incorrect-answer');
        });
    }
    
    /**
     * Render pattern matching puzzle
     */
    renderPatternPuzzle(puzzle, onAnswerSubmit) {
        if (puzzle.challengeType === 'spot-difference') {
            return this.renderSpotDifferencePuzzle(puzzle);
        } else if (puzzle.challengeType === 'memory') {
            return this.renderMemoryPuzzle(puzzle);
        }
        
        return `<p>Unknown pattern puzzle type</p>`;
    }
    
    /**
     * Render spot-the-difference puzzle
     */
    renderSpotDifferencePuzzle(puzzle) {
        const correctAreasData = JSON.stringify(puzzle.correctAreas);
        
        return `
            <div class="pattern-puzzle spot-difference" role="region" aria-label="Spot the difference puzzle">
                <div class="puzzle-theme-badge" data-theme="${puzzle.theme}">
                    🔍 Spot the Difference
                </div>
                <h2 class="puzzle-question">${puzzle.question}</h2>
                <div class="pattern-content">
                    <div class="image-container">
                        <img src="${puzzle.imageUrl}" alt="Pattern puzzle image - find the differences" class="pattern-image" id="pattern-image">
                        <div class="clickable-overlay" id="clickable-overlay" data-correct-areas='${correctAreasData}' role="button" tabindex="0" aria-label="Click on the image to find differences"></div>
                    </div>
                </div>
                <div class="puzzle-feedback" id="puzzle-feedback" role="status" aria-live="polite" style="display: none;"></div>
                <div class="hint-text">Click on the differences you find</div>
            </div>
        `;
    }
    
    /**
     * Render memory game puzzle
     */
    renderMemoryPuzzle(puzzle) {
        const cards = puzzle.cards || [];
        const cardsHTML = cards.map((card, index) => `
            <div class="memory-card" data-index="${index}" data-pair="${card.pair}" role="button" tabindex="0" aria-label="Memory card ${index + 1} of ${cards.length}">
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${card.symbol}</div>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="pattern-puzzle memory-game" role="region" aria-label="Memory game puzzle">
                <div class="puzzle-theme-badge" data-theme="${puzzle.theme}">
                    🎮 Memory Game
                </div>
                <h2 class="puzzle-question">${puzzle.question}</h2>
                <div class="memory-grid" id="memory-grid" role="group" aria-label="Memory card grid">
                    ${cardsHTML}
                </div>
                <div class="puzzle-feedback" id="puzzle-feedback" role="status" aria-live="polite" style="display: none;"></div>
                <div class="memory-stats">
                    <span>Matches: <span id="match-count" aria-live="polite">0</span>/${cards.length / 2}</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Setup spot-the-difference click detection
     */
    setupSpotDifferencePuzzle(puzzle) {
        const overlay = document.getElementById('clickable-overlay');
        if (!overlay) return;
        
        const correctAreas = puzzle.correctAreas || [];
        let foundDifferences = new Set();
        
        // Handle click events
        overlay.addEventListener('click', (e) => {
            this.handleSpotDifferenceClick(e, overlay, correctAreas, foundDifferences);
        });
        
        // Handle keyboard events (Enter and Space)
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // For keyboard, we'll focus on the first uncovered difference
                if (foundDifferences.size < correctAreas.length) {
                    const nextIndex = Array.from({length: correctAreas.length}).findIndex((_, i) => !foundDifferences.has(i));
                    if (nextIndex !== -1) {
                        foundDifferences.add(nextIndex);
                        this.markDifferenceFound(overlay, correctAreas[nextIndex], foundDifferences, correctAreas);
                    }
                }
            }
        });
    }
    
    /**
     * Handle spot-the-difference click
     */
    handleSpotDifferenceClick(e, overlay, correctAreas, foundDifferences) {
        const rect = overlay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is within any correct area
        let foundIndex = -1;
        for (let i = 0; i < correctAreas.length; i++) {
            const area = correctAreas[i];
            if (x >= area.x && x <= area.x + area.width &&
                y >= area.y && y <= area.y + area.height) {
                foundIndex = i;
                break;
            }
        }
        
        if (foundIndex !== -1 && !foundDifferences.has(foundIndex)) {
            foundDifferences.add(foundIndex);
            this.markDifferenceFound(overlay, correctAreas[foundIndex], foundDifferences, correctAreas);
        } else if (foundIndex === -1) {
            this.showPuzzleFeedback('Not quite there. Try again!', 'error');
        }
    }
    
    /**
     * Mark a difference as found
     */
    markDifferenceFound(overlay, area, foundDifferences, correctAreas) {
        // Visual feedback for found difference
        const marker = document.createElement('div');
        marker.className = 'difference-marker';
        marker.style.left = (area.x + area.width / 2) + 'px';
        marker.style.top = (area.y + area.height / 2) + 'px';
        marker.setAttribute('aria-label', `Difference ${foundDifferences.size} of ${correctAreas.length} found`);
        overlay.appendChild(marker);
        
        // Check if all differences found
        if (foundDifferences.size === correctAreas.length) {
            this.showPuzzleFeedback('All differences found! 🎉', 'success');
            overlay.style.pointerEvents = 'none';
            window.gameApp.handlePuzzleAnswer(true);
        }
    }
    
    /**
     * Setup memory game puzzle
     */
    setupMemoryPuzzle(puzzle) {
        const cards = document.querySelectorAll('.memory-card');
        let flipped = [];
        let matched = 0;
        const totalPairs = (puzzle.cards || []).length / 2;
        
        cards.forEach(card => {
            // Handle click events
            card.addEventListener('click', () => {
                this.handleMemoryCardClick(card, flipped, matched, totalPairs, puzzle);
            });
            
            // Handle keyboard events (Enter and Space)
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleMemoryCardClick(card, flipped, matched, totalPairs, puzzle);
                }
            });
        });
    }
    
    /**
     * Handle memory card click/activation
     */
    handleMemoryCardClick(card, flipped, matched, totalPairs, puzzle) {
        if (card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        flipped.push(card);
        
        if (flipped.length === 2) {
            const [card1, card2] = flipped;
            const match = card1.dataset.pair === card2.dataset.pair;
            
            if (match) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matched++;
                
                document.getElementById('match-count').textContent = matched;
                
                if (matched === totalPairs) {
                    this.showPuzzleFeedback('All pairs matched! 🎉', 'success');
                    window.gameApp.handlePuzzleAnswer(true);
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                }, 1000);
            }
            
            flipped = [];
        }
    }
    
    /**
     * Render completion screen
     */
    renderCompletionScreen(container, stats) {
        console.log('📸 renderCompletionScreen called with stats:', stats);
        const timeString = this.formatTime(stats.timeTaken);
        const photoUrl = stats.photoUrl || 'assets/couple-photo.jpg';
        const customMessage = stats.customMessage || 'Thank you for being patient with me. I\'m sorry for what happened.';
        const customMessage2 = stats.customMessage2 || 'I hope this little race brought a smile to your face.';
        
        console.log('Photo URL:', photoUrl);
        console.log('Photo URL type:', typeof photoUrl);
        console.log('Photo URL length:', photoUrl.length);
        console.log('Custom Message:', customMessage);
        console.log('Custom Message 2:', customMessage2);
        console.log('Container element:', container);
        console.log('Container HTML before:', container.innerHTML.substring(0, 100));
        
        container.innerHTML = `
            <div class="completion-screen" role="main" aria-label="Game completion screen">
                <div class="completion-content">
                    <div class="checkered-flag" aria-hidden="true">🏁</div>
                    <h1 class="completion-title">You Did It! 🎉</h1>
                    
                    <div class="apology-message" role="region" aria-label="Apology message">
                        <p>${customMessage}</p>
                        <p>${customMessage2}</p>
                    </div>
                    
                    <div class="couple-photo-container">
                        <img src="${photoUrl}" alt="A special moment we shared together" class="couple-photo" onerror="console.error('Image failed to load:', this.src); this.style.display='none'" onload="console.log('Image loaded successfully:', this.src)">
                    </div>
                    
                    <div class="get-well-message" role="region" aria-label="Get well message">
                        <p>💚 Get Well Soon 💚</p>
                    </div>
                    
                    <div class="completion-stats" role="region" aria-label="Game statistics">
                        <div class="stat">
                            <span class="stat-label">Puzzles Solved:</span>
                            <span class="stat-value">${stats.puzzlesSolved}/${stats.totalPuzzles}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Time Taken:</span>
                            <span class="stat-value">${timeString}</span>
                        </div>
                    </div>
                    
                    <div class="completion-actions">
                        <button class="btn-primary" onclick="window.gameApp.resetGame()" aria-label="Play the game again">
                            Play Again 🏎️
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Completion screen HTML set');
        console.log('Container HTML after:', container.innerHTML.substring(0, 200));
        console.log('Image element in DOM:', container.querySelector('.couple-photo'));
        console.log('Photo container in DOM:', container.querySelector('.couple-photo-container'));
        this.currentScreen = 'completion';
    }
    
    /**
     * Show feedback message
     */
    showFeedback(message, type = 'info') {
        // Clear existing feedback
        if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
        }
        
        // Remove existing feedback
        const existingFeedback = document.querySelector('.feedback-message');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback-message feedback-${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        // Auto-remove after 3 seconds
        this.feedbackTimeout = setTimeout(() => {
            feedback.remove();
        }, 3000);
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.showFeedback(message, 'error');
    }
    
    /**
     * Format time in seconds to readable string
     */
    formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }
    
    /**
     * Share completion screen
     */
    shareCompletion() {
        const text = 'I just completed Small Gift! 🎁 Can you beat my time?';
        
        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'Small Gift',
                text: text,
                url: window.location.href
            }).catch(err => {
                // User cancelled or error occurred
                console.log('Share cancelled or failed:', err);
            });
        } else {
            // Fallback: Copy to clipboard
            const shareText = `${text}\n${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showFeedback('Completion message copied to clipboard! 📋', 'success');
            }).catch(() => {
                this.showFeedback('Unable to share. Please copy the link manually.', 'error');
            });
        }
    }
}
