// Razorpay Configuration File
// Replace these values with your actual Razorpay credentials

const RAZORPAY_CONFIG = {
    // Test Mode Credentials (Default)
    test: {
        keyId: 'rzp_test_1DP5mmOlF5G5ag',
        keySecret: 'YOUR_TEST_KEY_SECRET' // Not needed for frontend
    },
    
    // Live Mode Credentials (Replace with your actual keys)
    live: {
        keyId: 'rzp_live_Rn3w5m3jxnc59J',
        keySecret: 'rCstbTm1nu2NnwTBAH79DLso' 
    },
    
    // Current Mode: 'test' or 'live'
    mode: 'live',
    
    // Currency
    currency: 'INR',
    
    // USD to INR conversion rate (update as needed)
    usdToInrRate: 83,
    
    // Store Information
    storeName: 'Froakie_TCG\'s Store',
    storeDescription: 'Pokemon Trading Cards Purchase',
    storeLogo: 'https://orig10.deviantart.net/e689/f/2013/308/9/e/froakie_by_cl0setbr0ny-d6t1kvq.png',
    
    // Theme Color (matches your website theme)
    themeColor: '#e74c3c'
};

// Get current Razorpay Key ID based on mode
function getRazorpayKeyId() {
    return RAZORPAY_CONFIG.mode === 'live' 
        ? RAZORPAY_CONFIG.live.keyId 
        : RAZORPAY_CONFIG.test.keyId;
}

// Instructions for updating to Live Mode:
// 1. Get your Razorpay credentials from: https://dashboard.razorpay.com/app/keys
// 2. Replace 'YOUR_LIVE_KEY_ID' with your actual live key
// 3. Change mode from 'test' to 'live'
// 4. Save this file
