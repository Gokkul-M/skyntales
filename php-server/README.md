# Skyntales PHP Server for Hostinger

This PHP API server handles RazorPay payment processing for Hostinger shared hosting where Node.js is not available.

## Deployment Steps

### 1. Build the React Frontend

Set the API base URL environment variable before building:

```bash
# Option A: If API is on same domain (recommended)
npm run build

# Option B: If API is on different domain/subdomain
VITE_API_BASE_URL=https://yourdomain.com npm run build
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
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX
```

**Important Security Notes:**
- NEVER commit the `.env` file to version control
- The `.env` file should NOT be publicly accessible
- Add this to your root `.htaccess` to block access to .env:
  ```
  <Files .env>
      Order allow,deny
      Deny from all
  </Files>
  ```

### 4. Final Structure in public_html

```
public_html/
├── .env                     # RazorPay credentials (NOT public)
├── .htaccess               # URL rewriting + protect .env
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
├── api/
│   ├── .htaccess           # API specific rules
│   ├── config.php
│   ├── create-order.php
│   ├── verify-payment.php
│   └── health.php
└── (other static files)
```

### 5. Test the Deployment

1. Visit your domain to see the website
2. Test API: `https://yourdomain.com/api/health.php`
3. Test a payment with Razorpay test cards

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-order.php` | POST | Creates a RazorPay order |
| `/api/verify-payment.php` | POST | Verifies payment signature |
| `/api/health.php` | GET | Health check |

## Troubleshooting

### "Unexpected token '<'" JSON parse error
This means the API is returning HTML instead of JSON:
- Check that PHP files are correctly uploaded to the `api` folder
- Verify PHP is enabled on your Hostinger account
- Make sure the `.htaccess` file is uploaded in the `api` folder
- Check that the `VITE_API_BASE_URL` environment variable was set correctly during build

### API returns 500 error
- Check PHP error logs in hPanel
- Verify cURL extension is enabled in PHP
- Confirm API keys are correct in `.env` file

### "Payment gateway not configured" error
- Ensure the `.env` file exists and contains valid RazorPay credentials
- Check that the path in `config.php` correctly points to your `.env` file

### Routing not working
- Ensure `.htaccess` file is uploaded
- Enable mod_rewrite in PHP settings

### CORS issues
- The config.php already includes CORS headers
- Make sure your domain matches the frontend origin

### Payment verification fails
- Ensure `RAZORPAY_KEY_SECRET` in `.env` matches your RazorPay dashboard
- Check the signature generation uses the same secret as RazorPay
