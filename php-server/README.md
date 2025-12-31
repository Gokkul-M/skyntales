# Skyntales PHP Server for Hostinger

## Deployment Steps

### 1. Build the React Frontend
```bash
npm run build
```
This creates the `dist` folder with your static files.

### 2. Prepare Files for Upload

Copy these to your Hostinger `public_html` folder:
- All contents from `dist/` folder (index.html, assets/, etc.)
- The `api/` folder from `php-server/`
- The `.htaccess` file from `php-server/`

### 3. Configure API Keys (Using .env file)

Create a `.env` file in the `public_html` folder (same level as index.html):

```
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX
```

**Important Security Notes:**
- NEVER commit the `.env` file to version control
- The `.env` file should NOT be publicly accessible
- Add this to your `.htaccess` to block access to .env:
  ```
  <Files .env>
      Order allow,deny
      Deny from all
  </Files>
  ```

### 4. Final Structure in public_html

```
public_html/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
├── api/
│   ├── config.php
│   ├── create-order.php
│   ├── verify-payment.php
│   └── health.php
├── .htaccess
└── (other static files)
```

### 5. Update Frontend API URL (if needed)

If your API is on a different domain, update the fetch URLs in your React app before building:
- `/api/create-order` → `https://yourdomain.com/api/create-order`
- `/api/verify-payment` → `https://yourdomain.com/api/verify-payment`

### 6. Test the Deployment

1. Visit your domain to see the website
2. Test API: `https://yourdomain.com/api/health`
3. Test a payment with Razorpay test cards

## Troubleshooting

### API returns 500 error
- Check PHP error logs in hPanel
- Verify cURL extension is enabled in PHP
- Confirm API keys are correct

### Routing not working
- Ensure `.htaccess` file is uploaded
- Enable mod_rewrite in PHP settings

### CORS issues
- The config.php already includes CORS headers
- Make sure your domain matches the frontend origin
