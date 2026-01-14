/**
 * Animation Engine
 * 
 * Handles smooth animations and visual transitions.
 * Uses requestAnimationFrame for optimal performance.
 */

export class AnimationEngine {
    constructor() {
        this.activeAnimations = [];
    }
    
    /**
     * Animate car movement along the track
     */
    animateCarMovement(fromPosition, toPosition, duration = 500) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const car = document.querySelector('.car');
            
            if (!car) {
                resolve();
                return;
            }
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-cubic)
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentPosition = fromPosition + (toPosition - fromPosition) * easeProgress;
                car.style.left = `${currentPosition}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Animate checkered flag for game completion
     */
    async animateCheckeredFlag() {
        return new Promise((resolve) => {
            const flag = document.createElement('div');
            flag.className = 'checkered-flag-animation';
            flag.innerHTML = '🏁';
            document.body.appendChild(flag);
            
            // Trigger animation
            setTimeout(() => {
                flag.classList.add('animate');
            }, 10);
            
            // Remove after animation
            setTimeout(() => {
                flag.remove();
                resolve();
            }, 1000);
        });
    }
    
    /**
     * Animate confetti for celebration
     */
    async animateConfetti() {
        return new Promise((resolve) => {
            const confettiPieces = 50;
            
            for (let i = 0; i < confettiPieces; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.delay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);
            }
            
            // Remove confetti after animation
            setTimeout(() => {
                document.querySelectorAll('.confetti').forEach(el => el.remove());
                resolve();
            }, 3000);
        });
    }
    
    /**
     * Animate puzzle transition
     */
    async animatePuzzleTransition() {
        return new Promise((resolve) => {
            const puzzleSection = document.querySelector('.puzzle-section');
            
            if (!puzzleSection) {
                resolve();
                return;
            }
            
            puzzleSection.classList.add('fade-out');
            
            setTimeout(() => {
                puzzleSection.classList.remove('fade-out');
                resolve();
            }, 300);
        });
    }
    
    /**
     * Animate progress bar update
     */
    async animateProgressBar(fromValue, toValue, duration = 500) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const progressFill = document.querySelector('.progress-fill');
            
            if (!progressFill) {
                resolve();
                return;
            }
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentValue = fromValue + (toValue - fromValue) * progress;
                progressFill.style.width = `${currentValue}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
}
