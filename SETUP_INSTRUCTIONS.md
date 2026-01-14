# Setup Instructions: F1 Apology Gift Game

Quick reference for setting up and deploying your apology gift game.

## 5-Minute Quick Start

### 1. Install Dependencies
```bash
cd apology-gift-game
npm install
```

### 2. Test Locally
```bash
npm run dev
```
Open `http://localhost:8000` in your browser.

### 3. Customize
- Add your photo to `assets/`
- Edit apology message in `js/modules/UIManager.js`
- Update puzzles in `js/data/puzzles.js`

### 4. Deploy
Choose one:
- **GitHub Pages:** Push to GitHub, enable Pages
- **Netlify:** Connect GitHub repo, auto-deploys
- **Vercel:** Import GitHub repo, instant deploy

### 5. Share
Send the link to your partner!

---

## Detailed Setup

### Prerequisites
- Node.js 16+ (download from https://nodejs.org/)
- A text editor (VS Code, Sublime, etc.)
- Git (optional, for GitHub deployment)

### Installation

1. **Navigate to project:**
   ```bash
   cd apology-gift-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify installation:**
   ```bash
   npm test
   ```
   All tests should pass.

---

## Development Workflow

### Run Development Server
```bash
npm run dev
```
- Opens at `http://localhost:8000`
- Auto-reloads on file changes
- Press Ctrl+C to stop

### Run Tests
```bash
npm test              # Run once
npm run test:watch   # Watch mode
npm run test:ui      # Visual UI
```

### Build for Production
```bash
npm run build
```
Creates optimized `dist/` folder for deployment.

---

## Customization Workflow

### 1. Add Photo
1. Place photo in `assets/` folder
2. Update path in `js/modules/UIManager.js` line ~422

### 2. Write Message
1. Edit `js/modules/UIManager.js` around line 430
2. Replace placeholder text with your message

### 3. Customize Puzzles
1. Open `js/data/puzzles.js`
2. Edit puzzle questions, options, and answers
3. Add personal memory references

### 4. Test Changes
```bash
npm run dev
```
- Play through the game
- Verify all puzzles work
- Check completion screen

### 5. Deploy
See DEPLOYMENT.md for platform-specific instructions.

---

## File Structure Reference

```
apology-gift-game/
├── index.html                    # Main HTML file
├── package.json                  # Dependencies and scripts
├── README.md                     # Project overview
├── CUSTOMIZATION.md              # Customization guide
├── DEPLOYMENT.md                 # Deployment guide
├── SETUP_INSTRUCTIONS.md         # This file
│
├── css/
│   └── styles.css               # All styling
│
├── js/
│   ├── main.js                  # Application entry point
│   ├── modules/
│   │   ├── GameStateManager.js  # Game state logic
│   │   ├── PuzzleEngine.js      # Puzzle logic
│   │   ├── UIManager.js         # UI rendering
│   │   ├── AnimationEngine.js   # Animations
│   │   ├── StorageManager.js    # LocalStorage
│   │   └── *.test.js            # Tests
│   └── data/
│       └── puzzles.js           # Puzzle definitions
│
├── assets/                       # Images and media
│   └── couple-photo.jpg         # Your photo here
│
└── dist/                         # Production build (created by npm run build)
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with visual UI |
| `npm run build` | Build for production |
| `npm run build:serve` | Build and serve production |
| `npm run perf` | Run performance tests |

---

## Troubleshooting

### npm install fails
- Delete `node_modules/` folder
- Delete `package-lock.json`
- Run `npm install` again

### Port 8000 already in use
```bash
# Use different port
python -m http.server 8001
```

### Tests fail
```bash
# Clear cache and retry
rm -rf .vitest/
npm test
```

### Game won't load locally
- Check browser console (F12)
- Verify all files are in correct locations
- Try a different browser
- Clear browser cache

### Photo not showing
- Check file path in `UIManager.js`
- Verify file exists in `assets/`
- Try a different image format (JPG, PNG)

---

## Deployment Quick Links

### GitHub Pages
1. Create repo at https://github.com/new
2. Push code: `git push -u origin main`
3. Enable Pages in repo settings
4. Live at: `https://username.github.io/apology-gift-game`

### Netlify
1. Sign up at https://app.netlify.com
2. Connect GitHub repo
3. Auto-deploys on push
4. Live at: `https://your-site.netlify.app`

### Vercel
1. Sign up at https://vercel.com
2. Import GitHub repo
3. Auto-deploys on push
4. Live at: `https://your-project.vercel.app`

See DEPLOYMENT.md for detailed instructions.

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Test locally: `npm run dev`
3. ✅ Customize the game (see CUSTOMIZATION.md)
4. ✅ Run tests: `npm test`
5. ✅ Deploy (see DEPLOYMENT.md)
6. ✅ Share with your partner!

---

## Need Help?

- **Customization:** See CUSTOMIZATION.md
- **Deployment:** See DEPLOYMENT.md
- **Technical Details:** See README.md
- **Performance:** See PERFORMANCE.md
- **Accessibility:** See ACCESSIBILITY_IMPLEMENTATION.md

---

Made with ❤️ as an apology gift
