# 📤 GitHub Pages Upload Guide - Complete Fix

## 🎯 The Problem
Your website structure needs to be exactly like this on GitHub:

```
Froackie_TCG-Card-Shop/
├── index.html
├── cart.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── data.js
│   ├── store.js
│   ├── cart.js
│   ├── admin.js
│   └── razorpay-config.js
├── images/
│   └── (any images)
├── README.md
├── RAZORPAY_SETUP.md
├── TESTING_REPORT.md
└── DEPLOYMENT_GUIDE.md
```

---

## ✅ Step-by-Step Upload Instructions

### Step 1: Go to Your Repository
1. Open: https://github.com/Froackie/Froackie_TCG-Card-Shop
2. Make sure you're on the main page

### Step 2: Create Folders First

#### Create CSS Folder:
1. Click "Add file" → "Create new file"
2. Type: `css/style.css`
3. Copy the entire content from `C:\Users\khana\Desktop\pokemon-cards-store\css\style.css`
4. Paste it in the editor
5. Click "Commit changes"

#### Create admin.css:
1. Click "Add file" → "Create new file"
2. Type: `css/admin.css`
3. Copy content from `C:\Users\khana\Desktop\pokemon-cards-store\css\admin.css`
4. Paste and commit

#### Create JS Folder:
1. Click "Add file" → "Create new file"
2. Type: `js/data.js`
3. Copy content from `C:\Users\khana\Desktop\pokemon-cards-store\js\data.js`
4. Paste and commit

Repeat for all JS files:
- `js/store.js`
- `js/cart.js`
- `js/admin.js`
- `js/razorpay-config.js`

#### Create Images Folder:
1. Click "Add file" → "Create new file"
2. Type: `images/.gitkeep`
3. Commit (this creates the folder)

### Step 3: Verify Structure
Your repository should now show:
- ✅ index.html
- ✅ cart.html
- ✅ admin.html
- ✅ css/ (folder with 2 files)
- ✅ js/ (folder with 5 files)
- ✅ images/ (folder)

### Step 4: Wait & Test
1. Wait 2-3 minutes for GitHub Pages to rebuild
2. Visit: https://froackie.github.io/Froackie_TCG-Card-Shop
3. Products should now display!

---

## 🚀 Alternative: Quick Upload Method

### Using GitHub Desktop (Easier):
1. Download GitHub Desktop: https://desktop.github.com
2. Clone your repository
3. Copy all files from `C:\Users\khana\Desktop\pokemon-cards-store\`
4. Paste into the cloned folder
5. Commit and push

---

## 🔍 How to Check if It's Working

Visit your site and check:
- ✅ Products display with images
- ✅ Clicking card images opens modal
- ✅ Add to cart works
- ✅ Cart page shows items
- ✅ Admin panel loads

---

## ⚡ Quick Fix: Use This Checklist

On GitHub, verify you have:
- [ ] `css/style.css` (large file, ~500 lines)
- [ ] `css/admin.css` (medium file, ~300 lines)
- [ ] `js/data.js` (large file, ~200 lines)
- [ ] `js/store.js` (large file, ~200 lines)
- [ ] `js/cart.js` (large file, ~300 lines)
- [ ] `js/admin.js` (large file, ~400 lines)
- [ ] `js/razorpay-config.js` (small file, ~50 lines)

---

## 🆘 Still Not Working?

### Option 1: Check Browser Console
1. Press F12 on your website
2. Look for errors (red text)
3. Common errors:
   - "404 Not Found" = file not uploaded
   - "Failed to load resource" = wrong path

### Option 2: Use Netlify Instead
1. Go to: https://app.netlify.com/drop
2. Drag `C:\Users\khana\Desktop\pokemon-cards-store` folder
3. Get instant working URL
4. No path issues!

---

## 📋 Files to Upload Checklist

### HTML Files (Root):
- [ ] index.html
- [ ] cart.html
- [ ] admin.html

### CSS Files (css/ folder):
- [ ] css/style.css
- [ ] css/admin.css

### JavaScript Files (js/ folder):
- [ ] js/data.js
- [ ] js/store.js
- [ ] js/cart.js
- [ ] js/admin.js
- [ ] js/razorpay-config.js

### Documentation (Optional):
- [ ] README.md
- [ ] RAZORPAY_SETUP.md
- [ ] TESTING_REPORT.md

---

**After uploading all files correctly, your website will work perfectly!**

Your URL: https://froackie.github.io/Froackie_TCG-Card-Shop
