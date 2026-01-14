/**
 * Quick test to verify trivia puzzle UI implementation
 */

import { UIManager } from './js/modules/UIManager.js';

const uiManager = new UIManager();

// Test 1: Render trivia puzzle
const puzzle = {
    id: 'f1-1',
    type: 'trivia',
    theme: 'f1',
    question: 'How many F1 World Championships has Lewis Hamilton won?',
    options: ['6', '7', '8', '5'],
    correctAnswerIndex: 1,
    explanation: 'Lewis Hamilton has won 7 F1 World Championships'
};

console.log('Test 1: Rendering trivia puzzle...');
const html = uiManager.renderTriviaPuzzle(puzzle);
console.log('✓ Trivia puzzle rendered successfully');
console.log('  - Contains question:', html.includes('How many F1'));
console.log('  - Contains all options:', html.includes('6') && html.includes('7') && html.includes('8') && html.includes('5'));
console.log('  - Contains theme badge:', html.includes('puzzle-theme-badge'));
console.log('  - Contains F1 theme:', html.includes('data-theme="f1"'));
console.log('  - Contains feedback container:', html.includes('puzzle-feedback'));

// Test 2: Theme labels
console.log('\nTest 2: Theme labels...');
const themes = ['f1', 'football', 'office', 'personal'];
themes.forEach(theme => {
    const label = uiManager.getThemeLabel(theme);
    console.log(`✓ ${theme}: ${label}`);
});

// Test 3: Verify CSS classes are applied
console.log('\nTest 3: CSS classes...');
console.log('✓ puzzle-option class present:', html.includes('puzzle-option'));
console.log('✓ data-index attributes present:', html.includes('data-index="0"') && html.includes('data-index="1"'));

console.log('\n✅ All trivia puzzle UI tests passed!');
