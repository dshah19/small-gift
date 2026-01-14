# F1 Apology Gift Game

An interactive web-based game where your partner drives an F1 car through a race track, solving puzzles to progress. The game combines F1 racing, football trivia, The Office references, and personal memories into an engaging apology gift experience.

## Features

- 🏎️ Interactive F1 racing track with car progression
- 🧩 Multiple puzzle types (trivia and pattern-matching)
- 🎨 F1-themed visual design with Mercedes colors
- 💾 Progress persistence using localStorage
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Smooth animations and transitions
- ♿ Accessible keyboard navigation

## Project Structure

```
apology-gift-game/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styles and responsive design
├── js/
│   ├── main.js            # Application entry point
│   ├── modules/
│   │   ├── GameStateManager.js    # Game state management
│   │   ├── PuzzleEngine.js        # Puzzle logic and validation
│   │   ├── UIManager.js           # UI rendering
│   │   ├── AnimationEngine.js     # Animations
│   │   └── StorageManager.js      # LocalStorage persistence
│   └── data/
│       └── puzzles.js     # Puzzle definitions
├── assets/                # Images and media files
├── package.json           # Project dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js 16+ (for running tests)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local development server)

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd apology-gift-game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Game

#### Option 1: Using Python (Recommended)
```bash
npm run dev
```
Then open `http://localhost:8000` in your browser.

#### Option 2: Direct File Access
Simply open `index.html` in your web browser.

#### Option 3: Using Node.js
```bash
npx http-server
```

## Running Tests

### Run all tests once:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with UI:
```bash
npm run test:ui
```

## Game Architecture

### Core Modules

1. **GameStateManager**: Manages game progress, puzzle index, and car position
2. **PuzzleEngine**: Loads puzzles, validates answers, and manages puzzle logic
3. **UIManager**: Renders all screens and handles user interface
4. **AnimationEngine**: Handles smooth animations using requestAnimationFrame
5. **StorageManager**: Persists game progress to localStorage

### Data Flow

```
User Input → UIManager → GameStateManager → StorageManager
                ↓
         PuzzleEngine (validation)
                ↓
         AnimationEngine (visual feedback)
                ↓
         UIManager (render update)
```

## Customization

Before deploying, customize the game to make it personal:

### Quick Start

1. **Add your couple photo** to `assets/` folder
2. **Write your apology message** in `js/modules/UIManager.js`
3. **Customize puzzles** with personal memories in `js/data/puzzles.js`
4. **Update colors** in `css/styles.css` (optional)

### Detailed Guide

See **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** for complete customization instructions including:
- Adding your couple photo
- Writing a heartfelt apology message
- Creating personal memory puzzles
- Changing colors and themes
- Advanced customization options

### Quick Examples

**Adding Personal Memories:**
```javascript
{
    id: 'personal-1',
    type: 'trivia',
    theme: 'personal',
    personalMemory: 'bike-trips',
    question: 'What\'s our favorite activity?',
    options: ['Bike trips', 'Video games', 'Cooking', 'Reading'],
    correctAnswerIndex: 0,
}
```

**Changing Colors:**
```css
:root {
    --color-mercedes-silver: #00D2BE;  /* Main color */
    --color-black: #000000;             /* Dark color */
    --color-accent: #FF0000;            /* Accent color */
}
```

## Deployment

Ready to share your game? See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions.

### Quick Deployment Options

1. **GitHub Pages** (Free, easiest)
   - Push to GitHub
   - Enable Pages in settings
   - Share the link

2. **Netlify** (Free, powerful)
   - Connect GitHub repository
   - Auto-deploys on push
   - Custom domain support

3. **Vercel** (Free, fast)
   - Import GitHub repository
   - Instant deployment
   - Blazing fast performance

4. **Self-Hosted** (Full control)
   - Build with `npm run build`
   - Upload `dist/` folder
   - Configure your server

### Deployment Checklist

- [ ] Customized with personal photo
- [ ] Apology message written
- [ ] Puzzles personalized
- [ ] All tests pass: `npm test`
- [ ] Game works locally: `npm run dev`
- [ ] No console errors
- [ ] Responsive on mobile

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed step-by-step instructions for each platform.

## Sharing Your Game

Once deployed, share the link with your partner:

```
Hey, I made something special for you:
[Your Game URL]

Solve the puzzles to unlock a message from me! 💚
```

You can also:
- Generate a QR code for easy mobile access
- Send via email with a personal note
- Share on social media (if desired)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for sharing tips and QR code generation.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Accessibility

- Keyboard navigation support (Tab, Enter, Arrow keys)
- ARIA labels on interactive elements
- Alt text for all images
- WCAG AA color contrast compliance
- Screen reader compatible

## Documentation

This project includes comprehensive guides:

- **[README.md](./README.md)** - Project overview and getting started
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - How to customize the game with personal touches
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - How to deploy and share your game
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance optimization details
- **[ACCESSIBILITY_IMPLEMENTATION.md](./ACCESSIBILITY_IMPLEMENTATION.md)** - Accessibility features

## Support

For issues or questions, check the browser console for error messages and ensure all files are properly loaded.

---

Made with ❤️ as an apology gift
