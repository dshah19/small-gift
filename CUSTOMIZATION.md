# Customization Guide: F1 Apology Gift Game

This guide shows you how to customize the game to make it personal and meaningful for your partner.

## Quick Customization Checklist

- [ ] Add your couple photo
- [ ] Write your apology message
- [ ] Customize the puzzles with personal memories
- [ ] Update the game title (optional)
- [ ] Change colors/theme (optional)

---

## 1. Add Your Couple Photo

### Step 1: Prepare Your Photo

1. Choose a favorite photo of you and your partner
2. Resize it to approximately 600x400 pixels (landscape)
3. Compress it to reduce file size (< 2MB)
   - Use https://tinypng.com/ or similar tool
   - Or use ImageMagick: `convert photo.jpg -quality 85 photo-compressed.jpg`

### Step 2: Add to Project

1. Place your photo in the `assets/` folder
2. Name it something memorable (e.g., `couple-photo.jpg`)

### Step 3: Update the Code

Edit `js/modules/UIManager.js` around line 422:

**Before:**
```javascript
const photoUrl = stats.photoUrl || 'assets/couple-photo.jpg';
```

**After:**
```javascript
const photoUrl = stats.photoUrl || 'assets/your-photo-name.jpg';
```

---

## 2. Write Your Apology Message

### Edit the Message

Open `js/modules/UIManager.js` and find the completion screen (around line 430).

**Before:**
```javascript
<div class="apology-message" role="region" aria-label="Apology message">
    <p>Thank you for being patient with me. I'm sorry for what happened.</p>
    <p>I hope this little race brought a smile to your face.</p>
</div>
```

**After:**
```javascript
<div class="apology-message" role="region" aria-label="Apology message">
    <p>Your heartfelt message here.</p>
    <p>You can add multiple paragraphs.</p>
    <p>Make it personal and sincere.</p>
</div>
```

### Message Tips

- Keep it sincere and heartfelt
- 2-4 paragraphs is ideal
- Use simple, direct language
- Avoid being too formal or too casual

### Example Messages

**Sincere:**
```
I'm truly sorry for hurting you. I've had time to think about what I did, 
and I realize how much pain I caused. You mean everything to me, and I want 
to make things right. Thank you for giving me a chance to show you how much 
I care. I promise to do better.
```

**Playful:**
```
I messed up, and I know it. But I hope this little game brought a smile to 
your face. You're the best, and I'm lucky to have you. Let's make more 
memories together—better ones this time!
```

**Romantic:**
```
Every moment with you is precious to me. I'm sorry for taking you for granted. 
You deserve someone who shows up every day and makes you feel loved. That's 
what I want to be for you. Thank you for your patience and your heart.
```

---

## 3. Customize the Puzzles

### Understanding Puzzle Structure

Each puzzle is an object with this structure:

```javascript
{
    id: 'unique-id',                    // Unique identifier
    type: 'trivia',                     // 'trivia' or 'pattern-match'
    theme: 'f1',                        // 'f1', 'football', 'office', 'personal'
    personalMemory: 'bike-trips',       // Optional: memory category
    question: 'The question text',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswerIndex: 0,              // Index of correct answer (0-3)
    explanation: 'Why this is correct'
}
```

### Edit Puzzles

Open `js/data/puzzles.js` and modify the puzzle objects.

### Example: Change an F1 Puzzle

**Before:**
```javascript
{
    id: 'f1-1',
    type: 'trivia',
    theme: 'f1',
    question: 'How many F1 championships has Lewis Hamilton won?',
    options: ['6', '7', '8', '9'],
    correctAnswerIndex: 1,  // Answer is '7'
    explanation: 'Lewis Hamilton has won 7 F1 World Championships'
}
```

**After:**
```javascript
{
    id: 'f1-1',
    type: 'trivia',
    theme: 'f1',
    question: 'What is Lewis Hamilton\'s favorite color?',
    options: ['Red', 'Silver', 'Blue', 'Green'],
    correctAnswerIndex: 1,  // Answer is 'Silver'
    explanation: 'Lewis drives for Mercedes, which uses silver as their team color'
}
```

### Add Personal Memory Puzzles

Personal memory puzzles reference shared experiences. Here are the categories:

#### Bike Trips
```javascript
{
    id: 'personal-bike',
    type: 'trivia',
    theme: 'personal',
    personalMemory: 'bike-trips',
    question: 'What\'s our favorite bike trail?',
    options: ['Mountain View Trail', 'Beach Path', 'Forest Loop', 'City Route'],
    correctAnswerIndex: 0,
    explanation: 'Remember that amazing ride with the sunset view?'
}
```

#### Office Time
```javascript
{
    id: 'personal-office',
    type: 'trivia',
    theme: 'personal',
    personalMemory: 'office-time',
    question: 'What\'s our favorite lunch spot near the office?',
    options: ['Thai Restaurant', 'Pizza Place', 'Sushi Bar', 'Cafe'],
    correctAnswerIndex: 1,
    explanation: 'We always get the pepperoni pizza!'
}
```

#### Whiskey Buddies
```javascript
{
    id: 'personal-whiskey',
    type: 'trivia',
    theme: 'personal',
    personalMemory: 'whiskey-buddies',
    question: 'What\'s our favorite whiskey?',
    options: ['Jameson', 'Macallan', 'Bourbon', 'Scotch'],
    correctAnswerIndex: 2,
    explanation: 'Our go-to choice for a relaxing evening!'
}
```

#### Work Wife/Husband
```javascript
{
    id: 'personal-work-spouse',
    type: 'trivia',
    theme: 'personal',
    personalMemory: 'work-spouse',
    question: 'What\'s our inside joke about being work spouses?',
    options: ['We finish each other\'s sentences', 'We always order the same lunch', 'We\'re always in meetings together', 'We share the same desk'],
    correctAnswerIndex: 0,
    explanation: 'We really do finish each other\'s sentences!'
}
```

### Tips for Great Puzzles

1. **Make them personal:** Use inside jokes and shared memories
2. **Mix difficulty:** Some easy, some challenging
3. **Keep answers clear:** Avoid ambiguous correct answers
4. **Add explanations:** Help them remember the moment
5. **Use humor:** Make them smile while solving

---

## 4. Update Game Title

### In HTML

Edit `index.html`:

**Before:**
```html
<title>F1 Apology Gift Game</title>
```

**After:**
```html
<title>Our Special Race</title>
```

### In Welcome Screen

Edit `js/modules/UIManager.js` in the `renderWelcomeScreen` method:

**Before:**
```javascript
<h1 class="welcome-title">🏎️ F1 Apology Gift Game</h1>
```

**After:**
```javascript
<h1 class="welcome-title">🏎️ Our Special Race</h1>
```

---

## 5. Customize Colors and Theme

### Change F1 Colors

Edit `css/styles.css` at the top:

```css
:root {
    --color-mercedes-silver: #00D2BE;  /* Main color */
    --color-black: #000000;             /* Dark color */
    --color-accent: #FF0000;            /* Accent color */
    --color-success: #00FF00;           /* Success feedback */
    --color-error: #FF0000;             /* Error feedback */
}
```

### Color Suggestions

**Romantic Theme:**
```css
--color-mercedes-silver: #FF69B4;  /* Hot pink */
--color-accent: #FF1493;           /* Deep pink */
--color-success: #FF69B4;          /* Pink success */
```

**Ocean Theme:**
```css
--color-mercedes-silver: #00CED1;  /* Turquoise */
--color-accent: #1E90FF;           /* Dodger blue */
--color-success: #00CED1;          /* Turquoise success */
```

**Sunset Theme:**
```css
--color-mercedes-silver: #FF6347;  /* Tomato */
--color-accent: #FFD700;           /* Gold */
--color-success: #FF6347;          /* Tomato success */
```

---

## 6. Advanced Customization

### Change Welcome Screen Subtitle

Edit `js/modules/UIManager.js`:

**Before:**
```javascript
<p class="welcome-subtitle">Solve puzzles to complete the race and unlock a special message</p>
```

**After:**
```javascript
<p class="welcome-subtitle">Your custom subtitle here</p>
```

### Change "Get Well Soon" Message

Edit `js/modules/UIManager.js` in the completion screen:

**Before:**
```javascript
<div class="get-well-message" role="region" aria-label="Get well message">
    <p>💚 Get Well Soon 💚</p>
</div>
```

**After:**
```javascript
<div class="get-well-message" role="region" aria-label="Get well message">
    <p>💚 Your custom message 💚</p>
</div>
```

### Add More Puzzles

1. Open `js/data/puzzles.js`
2. Add new puzzle objects to the `puzzleData` array
3. The game will automatically include them

**Note:** The game displays 8 puzzles by default. If you add more, they'll be included in rotation.

---

## Testing Your Customizations

### Test Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:8000` in your browser.

### Checklist

- [ ] Photo displays correctly
- [ ] Apology message is visible
- [ ] All puzzles load without errors
- [ ] Correct answers work
- [ ] Incorrect answers show retry message
- [ ] Game completes successfully
- [ ] Completion screen shows all customizations
- [ ] No console errors (F12)

---

## Common Customization Issues

### Photo not showing

**Problem:** Photo appears as broken image

**Solution:**
1. Check file path in `UIManager.js`
2. Verify file exists in `assets/` folder
3. Check file format (JPG, PNG, WebP)
4. Try a different image

### Puzzle answers not working

**Problem:** Correct answer marked as wrong

**Solution:**
1. Check `correctAnswerIndex` matches the correct option
2. Remember: index starts at 0 (first option = 0)
3. Test locally before deploying

### Colors not changing

**Problem:** CSS changes don't appear

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check CSS syntax (no typos)
4. Verify file saved correctly

### Text not updating

**Problem:** Changes to messages don't appear

**Solution:**
1. Save the file
2. Refresh browser (F5)
3. Clear cache if needed
4. Check for typos in file path

---

## Customization Examples

### Example 1: Sports Fan Theme

```javascript
// Change F1 to their favorite sport
{
    id: 'sports-1',
    type: 'trivia',
    theme: 'football',
    question: 'What\'s your favorite team?',
    options: ['Team A', 'Team B', 'Team C', 'Team D'],
    correctAnswerIndex: 0,
    explanation: 'Go Team A!'
}
```

### Example 2: Movie Fan Theme

```javascript
{
    id: 'movie-1',
    type: 'trivia',
    theme: 'office',  // Reuse existing theme
    question: 'What\'s our favorite movie?',
    options: ['Movie A', 'Movie B', 'Movie C', 'Movie D'],
    correctAnswerIndex: 1,
    explanation: 'We\'ve watched it so many times!'
}
```

### Example 3: Travel Theme

```javascript
{
    id: 'travel-1',
    type: 'trivia',
    theme: 'personal',
    personalMemory: 'bike-trips',  // Reuse for travel
    question: 'Where did we have the best trip?',
    options: ['Paris', 'Tokyo', 'Barcelona', 'New York'],
    correctAnswerIndex: 2,
    explanation: 'Barcelona was magical!'
}
```

---

## Need Help?

1. Check the main README.md for technical details
2. Review the DEPLOYMENT.md for deployment help
3. Check browser console for error messages (F12)
4. Review code comments in `js/modules/`

---

Made with ❤️ as an apology gift
