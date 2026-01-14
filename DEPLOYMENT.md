# Deployment Guide: F1 Apology Gift Game

This guide covers how to deploy the F1 Apology Gift Game to various hosting platforms so you can share it with your partner.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Customization Before Deployment](#customization-before-deployment)
3. [Deployment Options](#deployment-options)
4. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 16+ installed
- Git (optional, for some deployment methods)
- A text editor for customization

### Local Testing

Before deploying, test the game locally:

```bash
cd apology-gift-game
npm install
npm run dev
```

Then open `http://localhost:8000` in your browser.

---

## Customization Before Deployment

### 1. Add Your Personal Photo

Replace the placeholder photo with your couple photo:

1. Add your photo to `assets/` folder (e.g., `assets/couple-photo.jpg`)
2. Update the photo URL in `js/modules/UIManager.js` (line ~422):
   ```javascript
   const photoUrl = stats.photoUrl || 'assets/your-photo.jpg';
   ```

### 2. Customize the Apology Message

Edit the apology message in `js/modules/UIManager.js` (around line 430):

```javascript
<div class="apology-message" role="region" aria-label="Apology message">
    <p>Your custom apology message here.</p>
    <p>Add as many paragraphs as you need.</p>
</div>
```

### 3. Customize Puzzles

Edit `js/data/puzzles.js` to:
- Change trivia questions and answers
- Add more personal memory references
- Adjust difficulty levels
- Add custom themes

Example:
```javascript
{
    id: 'personal-1',
    type: 'trivia',
    theme: 'personal',
    personalMemory: 'bike-trips',
    question: 'What\'s our favorite bike trail?',
    options: ['Mountain View Trail', 'Beach Path', 'Forest Loop', 'City Route'],
    correctAnswerIndex: 0,
    explanation: 'Remember our amazing ride there?'
}
```

### 4. Customize Colors

Edit `css/styles.css` to change the F1 theme colors:

```css
:root {
    --color-mercedes-silver: #00D2BE;  /* Change this */
    --color-black: #000000;             /* Or this */
    --color-accent: #FF0000;            /* Or this */
}
```

### 5. Customize Game Title

Edit `index.html`:
```html
<title>Your Custom Game Title</title>
```

And `js/modules/UIManager.js`:
```javascript
<h1 class="welcome-title">🏎️ Your Custom Title</h1>
```

---

## Deployment Options

### Option 1: GitHub Pages (Recommended - Free & Easy)

**Best for:** Quick sharing, no server setup needed

#### Steps:

1. **Create a GitHub account** (if you don't have one): https://github.com/signup

2. **Create a new repository:**
   - Go to https://github.com/new
   - Name it `apology-gift-game`
   - Choose "Public"
   - Click "Create repository"

3. **Upload your files:**
   ```bash
   cd apology-gift-game
   git init
   git add .
   git commit -m "Initial commit: F1 Apology Gift Game"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/apology-gift-game.git
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your game will be live at: `https://YOUR-USERNAME.github.io/apology-gift-game`

5. **Share the link** with your partner!

#### Updating the Game:
```bash
git add .
git commit -m "Update: [describe changes]"
git push
```

---

### Option 2: Netlify (Free & Powerful)

**Best for:** Easy deployment with custom domain support

#### Steps:

1. **Create a Netlify account:** https://app.netlify.com/signup

2. **Deploy via GitHub:**
   - First, push your code to GitHub (see Option 1)
   - In Netlify, click "New site from Git"
   - Connect your GitHub account
   - Select the `apology-gift-game` repository
   - Click "Deploy site"

3. **Or deploy via drag-and-drop:**
   - Build the project: `npm run build`
   - Drag the `dist/` folder into Netlify
   - Your game is live!

4. **Custom domain (optional):**
   - In Netlify settings, add your custom domain
   - Follow DNS setup instructions

#### Updating the Game:
- Push to GitHub and Netlify auto-deploys
- Or drag-and-drop the new `dist/` folder

---

### Option 3: Vercel (Free & Fast)

**Best for:** Blazing fast performance

#### Steps:

1. **Create a Vercel account:** https://vercel.com/signup

2. **Deploy via GitHub:**
   - First, push your code to GitHub (see Option 1)
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"

3. **Your game is live at:** `https://your-project-name.vercel.app`

#### Updating the Game:
- Push to GitHub and Vercel auto-deploys

---

### Option 4: Self-Hosted (Advanced)

**Best for:** Full control, custom domain

#### Requirements:
- Web hosting with Node.js support (or static hosting)
- SSH access to your server
- Basic command line knowledge

#### Steps:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload the `dist/` folder** to your web server

3. **Configure your web server** to serve `index.html` for all routes

4. **Example Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/apology-gift-game/dist;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## Deployment Checklist

Before deploying, verify:

- [ ] Personal photo added to `assets/`
- [ ] Apology message customized
- [ ] Puzzles customized with personal memories
- [ ] Colors/theme customized (optional)
- [ ] Game title updated
- [ ] All tests pass: `npm test`
- [ ] Game works locally: `npm run dev`
- [ ] No console errors (F12 to check)
- [ ] Responsive on mobile (test with phone)

---

## Sharing Your Game

### Share the Link

Once deployed, share the URL with your partner:

```
Hey, I made something special for you:
[Your Game URL]

Solve the puzzles to unlock a message from me! 💚
```

### Share via QR Code

Generate a QR code for your game URL:
- Use https://qr-code-generator.com/
- Paste your game URL
- Download the QR code
- Share it in a message or print it

### Share via Email

Send an email with:
- The game URL
- A brief message explaining what to do
- Emoji to make it fun! 🏎️

---

## Troubleshooting

### Game won't load after deployment

**Check:**
1. All files uploaded correctly
2. File paths are correct (case-sensitive on Linux servers)
3. Browser console for errors (F12)
4. Try clearing browser cache (Ctrl+Shift+Delete)

### Photo not showing

**Check:**
1. Photo file exists in `assets/` folder
2. File path is correct in `UIManager.js`
3. File format is supported (JPG, PNG, WebP)
4. File size is reasonable (< 5MB)

### Styles not loading

**Check:**
1. `css/styles.css` is in the correct location
2. File paths in HTML are correct
3. No 404 errors in browser console

### Game is slow

**Try:**
1. Optimize images: https://tinypng.com/
2. Use `npm run build` for production build
3. Check browser performance (F12 → Performance tab)

### Custom domain not working

**Check:**
1. DNS records are configured correctly
2. SSL certificate is valid
3. Wait 24-48 hours for DNS propagation

---

## Performance Tips

### Optimize Images

Before deploying, compress your photo:

```bash
# Using ImageMagick
convert couple-photo.jpg -quality 85 -resize 1200x800 couple-photo-optimized.jpg
```

Or use online tools:
- https://tinypng.com/
- https://imageoptim.com/

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Monitor Performance

After deployment, check:
- Page load time (target: < 2 seconds)
- Lighthouse score: https://developers.google.com/web/tools/lighthouse
- Browser DevTools Performance tab

---

## Support

### Common Issues

**Q: Can I update the game after sharing?**
A: Yes! Make changes locally, test with `npm run dev`, then redeploy.

**Q: Can I add more puzzles?**
A: Yes! Edit `js/data/puzzles.js` and redeploy.

**Q: Can I change the apology message?**
A: Yes! Edit `js/modules/UIManager.js` and redeploy.

**Q: How do I track if they played?**
A: GitHub Pages and Netlify provide basic analytics. For detailed tracking, use Google Analytics.

### Getting Help

1. Check browser console for errors (F12)
2. Review this guide's troubleshooting section
3. Check the main README.md for technical details
4. Review the code comments in `js/modules/`

---

## Next Steps

1. ✅ Customize your game
2. ✅ Test locally
3. ✅ Choose a deployment platform
4. ✅ Deploy your game
5. ✅ Share the link with your partner
6. ✅ Enjoy their reaction! 💚

---

Made with ❤️ as an apology gift
