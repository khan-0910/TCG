# Complete GitHub Setup Guide - From Beginning

This guide will help you upload your Pokemon Cards Store to a **NEW** GitHub repository from scratch.

## Prerequisites

1. **Git installed** on your computer
   - Download from: https://git-scm.com/downloads
   - Verify installation: Open terminal/command prompt and type `git --version`

2. **GitHub account**
   - Create free account at: https://github.com/signup

---

## Method 1: Using Git Command Line (Recommended)

### Step 1: Create a New Repository on GitHub

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in repository details:
   - **Repository name**: `pokemon-cards-store` (or any name you prefer)
   - **Description**: "Pokemon Trading Cards E-commerce Store with Razorpay Integration"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** check "Initialize this repository with a README" (we already have files)
4. Click **"Create repository"**
5. **Keep this page open** - you'll need the repository URL

### Step 2: Initialize Git in Your Local Project

Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux):

```bash
# Navigate to your project folder
cd C:\Users\khana\Desktop\pokemon-cards-store

# Initialize Git repository
git init

# Configure your Git identity (if not done before)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add All Files to Git

```bash
# Add all files to staging area
git add .

# Verify files are staged (optional)
git status
```

### Step 4: Create First Commit

```bash
# Commit all files with a message
git commit -m "Initial commit: Pokemon Cards Store with checkout page and rupee currency"
```

### Step 5: Connect to GitHub Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Example:
# git remote add origin https://github.com/johnsmith/pokemon-cards-store.git
```

### Step 6: Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push all files to GitHub
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Create token at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)
  - Copy the token and use it as password

### Step 7: Verify Upload

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files uploaded!

---

## Method 2: Using GitHub Desktop (Easier for Beginners)

### Step 1: Install GitHub Desktop

1. Download from: https://desktop.github.com/
2. Install and sign in with your GitHub account

### Step 2: Add Your Project

1. Open GitHub Desktop
2. Click **"File"** → **"Add local repository"**
3. Click **"Choose..."** and select: `C:\Users\khana\Desktop\pokemon-cards-store`
4. If it says "This directory does not appear to be a Git repository":
   - Click **"create a repository"**
   - Repository name: `pokemon-cards-store`
   - Click **"Create Repository"**

### Step 3: Commit Files

1. You'll see all files listed in the left panel
2. In the bottom left:
   - **Summary**: "Initial commit: Pokemon Cards Store"
   - **Description** (optional): "Added checkout page with address form, delivery options, and changed currency to rupees"
3. Click **"Commit to main"**

### Step 4: Publish to GitHub

1. Click **"Publish repository"** button (top right)
2. Choose:
   - **Name**: pokemon-cards-store
   - **Description**: Pokemon Trading Cards E-commerce Store
   - **Keep this code private**: Check if you want it private
3. Click **"Publish Repository"**

### Step 5: Verify

1. Click **"View on GitHub"** button
2. Your repository should open in browser with all files!

---

## Method 3: Using VSCode (If you use VSCode)

### Step 1: Open Project in VSCode

1. Open VSCode
2. File → Open Folder → Select `C:\Users\khana\Desktop\pokemon-cards-store`

### Step 2: Initialize Git

1. Click **Source Control** icon (left sidebar, looks like a branch)
2. Click **"Initialize Repository"**

### Step 3: Stage and Commit Files

1. You'll see all files listed
2. Click **"+"** icon next to "Changes" to stage all files
3. Enter commit message: "Initial commit: Pokemon Cards Store"
4. Click **✓** checkmark to commit

### Step 4: Publish to GitHub

1. Click **"Publish to GitHub"** button
2. Choose repository name: `pokemon-cards-store`
3. Choose **Public** or **Private**
4. Click **"Publish"**
5. Sign in to GitHub if prompted

---

## File Structure That Will Be Uploaded

```
pokemon-cards-store/
├── index.html                          # Main store page
├── cart.html                           # Shopping cart page
├── checkout.html                       # NEW - Checkout page with address form
├── admin.html                          # Admin panel
├── contact.html                        # Contact page
├── privacy.html                        # Privacy policy
├── terms.html                          # Terms & conditions
├── shipping.html                       # Shipping policy
├── refund-policy.html                  # Refund policy
├── css/
│   ├── style.css                       # Main styles
│   └── admin.css                       # Admin panel styles
├── js/
│   ├── data.js                         # Data management
│   ├── store.js                        # Store functionality (UPDATED - ₹)
│   ├── cart.js                         # Cart functionality (UPDATED - ₹)
│   ├── checkout.js                     # NEW - Checkout functionality
│   ├── admin.js                        # Admin functionality (UPDATED - ₹)
│   └── razorpay-config.js              # Razorpay configuration
├── README.md                           # Project documentation
├── CHECKOUT_UPDATE_SUMMARY.md          # NEW - Summary of changes
├── GITHUB_SETUP_GUIDE.md               # NEW - This guide
├── TESTING_REPORT.md                   # Testing documentation
├── RAZORPAY_SETUP.md                   # Razorpay setup guide
├── DEPLOYMENT_GUIDE.md                 # Deployment instructions
├── GITHUB_UPLOAD_GUIDE.md              # GitHub upload guide
└── RAZORPAY_POLICY_PAGES.md            # Policy pages guide
```

---

## Important Files to Check Before Uploading

### 1. **Sensitive Information** ⚠️

Check `js/razorpay-config.js` and make sure you're comfortable with the keys being public:

```javascript
live: {
    keyId: 'rzp_live_Rn3w5m3jxnc59J',
    keySecret: 'rCstbTm1nu2NnwTBAH79DLso'  // ⚠️ This should NOT be in frontend!
}
```

**IMPORTANT**: The `keySecret` should NEVER be in frontend code! Remove it before uploading:

```javascript
live: {
    keyId: 'rzp_live_Rn3w5m3jxnc59J',
    keySecret: 'YOUR_KEY_SECRET_HERE' // Keep this placeholder only
}
```

### 2. **Create .gitignore File** (Optional but Recommended)

Create a file named `.gitignore` in your project root:

```
# Node modules (if you add them later)
node_modules/

# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
```

---

## After Uploading - Enable GitHub Pages (Optional)

To host your website for free on GitHub:

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll to **"Pages"** section (left sidebar)
4. Under **"Source"**:
   - Branch: Select **"main"**
   - Folder: Select **"/ (root)"**
5. Click **"Save"**
6. Wait 1-2 minutes
7. Your site will be live at: `https://YOUR_USERNAME.github.io/pokemon-cards-store/`

**Note**: GitHub Pages only works with static files. Your Razorpay integration will work, but you won't have a backend server.

---

## Troubleshooting

### Problem: "Permission denied (publickey)"

**Solution**: Set up SSH key or use HTTPS with Personal Access Token
- HTTPS method: Use token instead of password
- Create token: https://github.com/settings/tokens

### Problem: "Repository not found"

**Solution**: Check the repository URL is correct
```bash
git remote -v  # Check current remote URL
git remote set-url origin https://github.com/USERNAME/REPO.git  # Update if wrong
```

### Problem: "Failed to push some refs"

**Solution**: Pull first, then push
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### Problem: Files not showing on GitHub

**Solution**: Make sure you committed and pushed
```bash
git status  # Check if files are committed
git log     # Check commit history
git push origin main  # Push again
```

---

## Future Updates

When you make changes to your code:

```bash
# 1. Stage changes
git add .

# 2. Commit with message
git commit -m "Description of changes"

# 3. Push to GitHub
git push origin main
```

Or use GitHub Desktop/VSCode and click the sync/push button.

---

## Summary of Commands (Quick Reference)

```bash
# Initial setup (one time only)
cd C:\Users\khana\Desktop\pokemon-cards-store
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your message"
git push origin main
```

---

## Need Help?

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- GitHub Desktop Help: https://docs.github.com/en/desktop

Your Pokemon Cards Store is now ready to be uploaded to GitHub! 🚀
