# Deployment Fix - Blank Page Issue

## Problem
After deployment to Vercel, the page was showing blank. This was caused by:
1. Build script was creating minified files with `.min.js` extensions
2. HTML was still referencing original paths like `js/main.js`
3. The minified files didn't exist at the expected paths

## Solution
Updated `build.js` to:
- Copy files as-is instead of minifying them
- Maintain original file structure and paths
- Ensure HTML references match the actual file locations

## Steps to Deploy
1. Commit the changes:
   ```bash
   git add build.js vercel.json
   git commit -m "Fix deployment - copy files instead of minifying"
   git push
   ```

2. Redeploy on Vercel:
   - Go to your Vercel project
   - Click "Redeploy" 
   - Wait for build to complete

The game should now display correctly!
