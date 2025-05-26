
# Coffee Kiosk M-PESA API

A minimalistic Node.js API service that integrates with Safaricom M-PESA STK Push payment gateway in sandbox environment.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your M-PESA sandbox credentials
   - For local development, use ngrok to expose your callback URL

3. **Start the Server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### POST /pay
Initiates M-PESA STK Push payment.

**Request:**
```json
{
  "phone": "254712345678",
  "amount": 250
}
```

**Response:**
```json
{
  "success": true,
  "message": "STK Push sent successfully. Please check your phone.",
  "transactionId": "ws_CO_DMZ_123456789_12345678"
}
```

### POST /callback
Handles M-PESA payment confirmations (called by Safaricom).

### GET /health
Health check endpoint.

## Environment Variables

- `CONSUMER_KEY`: M-PESA app consumer key
- `CONSUMER_SECRET`: M-PESA app consumer secret  
- `BUSINESS_SHORT_CODE`: Your paybill number (174379 for sandbox)
- `PASSKEY`: M-PESA passkey for your shortcode
- `CALLBACK_URL`: URL where M-PESA sends payment confirmations
- `PORT`: Server port (default: 3000)

## Development Setup with Ngrok

1. Install ngrok: `npm install -g ngrok`
2. Start your server: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Copy the ngrok URL and set it as CALLBACK_URL in your .env file
5. Restart your server

## M-PESA Sandbox Setup

1. Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account and new app
3. Get your Consumer Key and Consumer Secret
4. Use the provided sandbox credentials for testing
