# Deployment Checklist: F1 Apology Gift Game

Use this checklist to ensure everything is ready before deploying your game.

## Pre-Deployment Checklist

### Customization
- [ ] Added couple photo to `assets/` folder
- [ ] Updated photo path in `js/modules/UIManager.js`
- [ ] Written heartfelt apology message
- [ ] Customized all 8 puzzles with personal content
- [ ] Added personal memory references (bike trips, office time, whiskey buddies, work wife/husband)
- [ ] Updated game title (optional)
- [ ] Changed colors/theme (optional)
- [ ] Verified photo is optimized (< 2MB)

### Testing
- [ ] Ran `npm install` successfully
- [ ] Ran `npm test` - all tests pass
- [ ] Ran `npm run dev` - game loads locally
- [ ] Played through entire game locally
- [ ] Verified all puzzle answers work correctly
- [ ] Checked completion screen displays correctly
- [ ] Verified photo displays on completion screen
- [ ] Tested on mobile device (or mobile view in browser)
- [ ] Checked browser console for errors (F12)
- [ ] Tested keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Verified localStorage works (progress saves)

### Code Quality
- [ ] No console errors or warnings
- [ ] No broken links or missing files
- [ ] All images load correctly
- [ ] All CSS styles apply correctly
- [ ] All JavaScript runs without errors
- [ ] Responsive design works on all screen sizes

### Browser Compatibility
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge
- [ ] Tested on iOS Safari
- [ ] Tested on Chrome Android

### Performance
- [ ] Page loads in under 2 seconds
- [ ] Animations run smoothly (60fps)
- [ ] No lag during gameplay
- [ ] No memory leaks (check DevTools)

### Accessibility
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] ARIA labels are present
- [ ] Screen reader compatible

### Documentation
- [ ] README.md is up to date
- [ ] CUSTOMIZATION.md is complete
- [ ] DEPLOYMENT.md is complete
- [ ] SETUP_INSTRUCTIONS.md is complete
- [ ] .gitignore is configured
- [ ] package.json is correct

### Git/Version Control
- [ ] All changes committed
- [ ] No uncommitted changes
- [ ] .gitignore excludes node_modules/
- [ ] .gitignore excludes dist/
- [ ] .gitignore excludes build artifacts

---

## Deployment Platform Checklist

### GitHub Pages
- [ ] GitHub account created
- [ ] Repository created
- [ ] Code pushed to main branch
- [ ] Pages enabled in settings
- [ ] Custom domain configured (optional)
- [ ] Game accessible at public URL
- [ ] Tested deployed version

### Netlify
- [ ] Netlify account created
- [ ] GitHub repository connected
- [ ] Build settings configured
- [ ] Deploy successful
- [ ] Custom domain configured (optional)
- [ ] Game accessible at public URL
- [ ] Tested deployed version

### Vercel
- [ ] Vercel account created
- [ ] GitHub repository imported
- [ ] Deploy successful
- [ ] Custom domain configured (optional)
- [ ] Game accessible at public URL
- [ ] Tested deployed version

### Self-Hosted
- [ ] Web hosting account created
- [ ] SSH access configured
- [ ] Ran `npm run build`
- [ ] Uploaded `dist/` folder
- [ ] Web server configured
- [ ] SSL certificate installed
- [ ] Game accessible at public URL
- [ ] Tested deployed version

---

## Post-Deployment Checklist

### Verification
- [ ] Game loads at public URL
- [ ] All features work on deployed version
- [ ] Photo displays correctly
- [ ] Apology message is visible
- [ ] All puzzles load and work
- [ ] Completion screen displays correctly
- [ ] No console errors on deployed version
- [ ] Responsive design works on deployed version

### Testing
- [ ] Played through entire game on deployed version
- [ ] Tested on mobile device
- [ ] Tested in different browsers
- [ ] Verified localStorage works
- [ ] Tested keyboard navigation
- [ ] Tested accessibility features

### Sharing
- [ ] Generated QR code (optional)
- [ ] Prepared sharing message
- [ ] Tested link works from different devices
- [ ] Verified link is shareable
- [ ] Ready to send to partner

---

## Final Verification

### Before Sending to Partner
- [ ] Game is fully functional
- [ ] All customizations are in place
- [ ] No errors or warnings
- [ ] Tested on multiple devices
- [ ] Tested in multiple browsers
- [ ] Performance is acceptable
- [ ] Accessibility is good
- [ ] Documentation is complete

### Sharing Preparation
- [ ] Wrote a nice message to accompany the link
- [ ] Chose best time to share
- [ ] Prepared for their reaction
- [ ] Have backup plan if technical issues arise

---

## Troubleshooting During Deployment

### If Tests Fail
1. [ ] Check error messages carefully
2. [ ] Review recent changes
3. [ ] Run `npm test` locally
4. [ ] Fix issues locally first
5. [ ] Re-run tests
6. [ ] Deploy only after tests pass

### If Game Won't Load
1. [ ] Check browser console for errors
2. [ ] Verify all files uploaded correctly
3. [ ] Check file paths (case-sensitive)
4. [ ] Clear browser cache
5. [ ] Try different browser
6. [ ] Check web server configuration

### If Photo Doesn't Show
1. [ ] Verify file exists in assets/
2. [ ] Check file path in UIManager.js
3. [ ] Verify file format (JPG, PNG, WebP)
4. [ ] Check file size (< 5MB)
5. [ ] Try different image

### If Styles Look Wrong
1. [ ] Clear browser cache
2. [ ] Hard refresh (Ctrl+F5)
3. [ ] Check CSS file is loaded
4. [ ] Verify CSS syntax
5. [ ] Check for CSS errors in console

### If Puzzles Don't Work
1. [ ] Check puzzle data in puzzles.js
2. [ ] Verify correctAnswerIndex is correct
3. [ ] Check for JavaScript errors
4. [ ] Test locally first
5. [ ] Verify puzzle data is valid JSON

---

## Success Criteria

Your deployment is successful when:

✅ Game loads without errors
✅ All customizations are visible
✅ All puzzles work correctly
✅ Completion screen displays properly
✅ Photo shows on completion screen
✅ Apology message is visible
✅ Game is responsive on all devices
✅ No console errors
✅ Performance is good
✅ Accessibility features work
✅ Link is shareable
✅ You're ready to send to your partner!

---

## Quick Reference

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev         # Test locally
npm test            # Run tests
npm run build       # Build for production
```

### Essential Files to Customize
- `assets/couple-photo.jpg` - Your photo
- `js/modules/UIManager.js` - Apology message
- `js/data/puzzles.js` - Puzzle content
- `css/styles.css` - Colors/theme

### Deployment Platforms
- GitHub Pages: Free, easy
- Netlify: Free, powerful
- Vercel: Free, fast
- Self-hosted: Full control

### Documentation
- README.md - Overview
- CUSTOMIZATION.md - How to customize
- DEPLOYMENT.md - How to deploy
- SETUP_INSTRUCTIONS.md - Quick start

---

## Notes

- Take your time with customization
- Test thoroughly before deploying
- Don't rush the apology message
- Make sure the photo is perfect
- Verify everything works locally first
- Deploy with confidence
- Enjoy their reaction! 💚

---

Made with ❤️ as an apology gift
