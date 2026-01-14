/**
 * Quick test to verify completion screen implementation
 */

import { UIManager } from './js/modules/UIManager.js';

// Create a mock container
const container = document.createElement('div');
container.id = 'test-container';

// Create UIManager instance
const uiManager = new UIManager();

// Test data
const stats = {
    puzzlesSolved: 8,
    totalPuzzles: 8,
    timeTaken: 120,
    playerName: 'Test Player',
    photoUrl: 'assets/couple-photo.jpg'
};

// Render completion screen
uiManager.renderCompletionScreen(container, stats);

// Verify all required elements are present
const checks = [
    { name: 'Completion screen container', check: () => container.innerHTML.includes('completion-screen') },
    { name: 'Checkered flag', check: () => container.innerHTML.includes('🏁') },
    { name: 'Title', check: () => container.innerHTML.includes('You Did It! 🎉') },
    { name: 'Apology message', check: () => container.innerHTML.includes('Thank you for being patient with me') },
    { name: 'Get Well Soon message', check: () => container.innerHTML.includes('Get Well Soon') },
    { name: 'Couple photo', check: () => container.innerHTML.includes('couple-photo') },
    { name: 'Puzzle count', check: () => container.innerHTML.includes('8/8') },
    { name: 'Time taken', check: () => container.innerHTML.includes('2m 0s') },
    { name: 'Play Again button', check: () => container.innerHTML.includes('Play Again 🏎️') },
    { name: 'Share button', check: () => container.innerHTML.includes('Share 📤') },
    { name: 'Current screen set to completion', check: () => uiManager.currentScreen === 'completion' }
];

console.log('Completion Screen Implementation Tests:');
console.log('========================================\n');

let passed = 0;
let failed = 0;

checks.forEach(({ name, check }) => {
    try {
        if (check()) {
            console.log(`✓ ${name}`);
            passed++;
        } else {
            console.log(`✗ ${name}`);
            failed++;
        }
    } catch (error) {
        console.log(`✗ ${name} - Error: ${error.message}`);
        failed++;
    }
});

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed === 0) {
    console.log('All checks passed! ✓');
    process.exit(0);
} else {
    console.log(`${failed} check(s) failed.`);
    process.exit(1);
}
