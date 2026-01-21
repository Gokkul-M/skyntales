SKYNTALES HOSTINGER DEPLOYMENT GUIDE
=====================================

FILE STRUCTURE FOR HOSTINGER (public_html):
--------------------------------------------

public_html/
├── .htaccess              (handles routing & security)
├── .env                   (Razorpay credentials - KEEP SECRET)
├── index.html             (main React app entry)
├── vite.svg
├── api/
│   ├── config.php         (shared configuration)
│   ├── create-order.php   (creates Razorpay order)
│   └── verify-payment.php (verifies payment signature)
└── assets/
    ├── index-Cox5zf7x.js  (main app bundle)
    ├── index-B78_F0BR.css (styles)
    ├── hero-video-*.mp4   (video files)
    └── *.woff, *.jpg, etc (fonts & images)


UPLOAD INSTRUCTIONS:
--------------------

1. Log in to Hostinger File Manager or use FTP

2. Navigate to: public_html/

3. DELETE all existing files in public_html/ (except any folders you want to keep)

4. Upload the ENTIRE contents of this folder to public_html/
   - Upload all files and folders maintaining the same structure

5. IMPORTANT: Make sure .env file is uploaded (it may be hidden)
   - The .env file contains your Razorpay credentials
   - It is protected by .htaccess from public access

6. Verify the file structure matches:
   public_html/.htaccess
   public_html/.env
   public_html/index.html
   public_html/api/config.php
   public_html/api/create-order.php
   public_html/api/verify-payment.php
   public_html/assets/ (with all files)


.ENV FILE CONTENTS:
-------------------
Your .env file should contain:

VITE_RAZORPAY_KEY_ID=rzp_live_IaTsJsviHehuIP
RAZORPAY_KEY_SECRET=LTY3GZUfoezUC024Ltigoc1a


RAZORPAY DASHBOARD SETUP:
-------------------------
1. Log in to https://dashboard.razorpay.com
2. Go to Settings > Website and App Settings
3. Add your domain: https://skyntales.com
4. Make sure you're in LIVE MODE (not Test Mode)


TESTING:
--------
1. Visit https://skyntales.com
2. Add a product to cart
3. Go to checkout
4. Complete shipping info
5. Click "Pay with Razorpay"
6. The payment modal should show LIVE mode (no test banner)


TROUBLESHOOTING:
----------------
- 404 on API: Check that api/*.php files exist and .htaccess is uploaded
- 500 Error: Check .env file has correct credentials
- Test Mode showing: Browser cache - clear cache or use incognito
- CORS errors: Check .htaccess is properly configured


CONTACT FOR SUPPORT:
--------------------
If you face issues, check:
1. Browser Developer Tools > Console for errors
2. Browser Developer Tools > Network for API responses
3. Hostinger Error Logs in hPanel
