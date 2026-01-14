# Customization Guide - F1 Apology Gift Game

## How to Customize the Game

### 1. Change the Apology Message

Edit `js/modules/GameStateManager.js` and find the `getGameStats()` method (around line 70):

```javascript
customMessage: 'Thank you for being patient with me. I\'m sorry for what happened.',
customMessage2: 'I hope this little race brought a smile to your face.'
```

Replace these with your own heartfelt messages:

```javascript
customMessage: 'Your custom first message here',
customMessage2: 'Your custom second message here'
```

**Important**: If your message contains single quotes (`'`), escape them with a backslash: `\'`

### 2. Change the Couple Photo

1. Replace the photo file at: `assets/couple-photo.jpg`
   - Keep the same filename and location
   - Supported formats: JPG, PNG, WebP
   - Recommended size: 400x300px or similar aspect ratio
   - File size: Keep under 1MB for fast loading

2. The photo will automatically display on the completion screen

### 3. Customize Puzzle Content

Edit `js/data/puzzles.js` to modify:
- Puzzle questions
- Answer options
- Correct answers
- Puzzle themes (F1, Football, Office, Personal)

### 4. Change Game Title or Styling

Edit `css/styles.css` to customize:
- Colors
- Fonts
- Layout
- Animations

## Testing Your Changes

1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Refresh the page (F5 or Cmd+R)
3. Play through the game to see your changes

## Troubleshooting

**Photo not showing?**
- Check that `assets/couple-photo.jpg` exists
- Verify the file is a valid image
- Check browser console (F12) for 404 errors

**Message not updating?**
- Make sure you saved the file
- Clear browser cache and refresh
- Check for syntax errors (missing quotes or semicolons)

**Game not loading?**
- Check browser console for JavaScript errors
- Verify all files are in the correct locations
- Try clearing cache and restarting the server
