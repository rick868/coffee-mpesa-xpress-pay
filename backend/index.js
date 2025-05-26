
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// M-PESA API Configuration
const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const BUSINESS_SHORT_CODE = process.env.BUSINESS_SHORT_CODE;
const PASSKEY = process.env.PASSKEY;
const CALLBACK_URL = process.env.CALLBACK_URL;

// Token storage
let accessToken = null;
let tokenExpiry = null;

/**
 * Middleware to generate and inject M-PESA OAuth access token
 */
const generateToken = async (req, res, next) => {
  try {
    // Check if token is still valid
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
      req.accessToken = accessToken;
      return next();
    }

    console.log('Generating new access token...');
    
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000); // Convert to milliseconds
    
    console.log('Access token generated successfully');
    req.accessToken = accessToken;
    next();
  } catch (error) {
    console.error('Token generation failed:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with M-PESA API',
      error: 'TOKEN_GENERATION_FAILED'
    });
  }
};

/**
 * Generate timestamp in M-PESA required format
 */
const generateTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${minute}${second}`;
};

/**
 * Generate M-PESA password
 */
const generatePassword = (timestamp) => {
  const data = `${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`;
  return Buffer.from(data).toString('base64');
};

/**
 * POST /pay - Initiate M-PESA STK Push payment
 */
app.post('/pay', generateToken, async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // Validate input
    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and amount are required',
        error: 'MISSING_PARAMETERS'
      });
    }

    // Validate amount
    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least KES 1',
        error: 'INVALID_AMOUNT'
      });
    }

    // Format phone number (ensure it starts with 254)
    let formattedPhone = phone.toString();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.substring(1);
    }

    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    console.log(`Initiating STK Push for phone: ${formattedPhone}, amount: ${amount}`);

    const stkPushPayload = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: BUSINESS_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: 'Coffee Kiosk',
      TransactionDesc: 'Coffee Purchase'
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      stkPushPayload,
      {
        headers: {
          Authorization: `Bearer ${req.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('STK Push response:', response.data);

    if (response.data.ResponseCode === '0') {
      res.json({
        success: true,
        message: 'STK Push sent successfully. Please check your phone.',
        transactionId: response.data.CheckoutRequestID
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.ResponseDescription || 'STK Push failed',
        error: 'STK_PUSH_FAILED'
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      res.status(400).json({
        success: false,
        message: 'Invalid request. Please check your phone number and try again.',
        error: 'INVALID_REQUEST'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Payment processing failed. Please try again.',
        error: 'PAYMENT_PROCESSING_FAILED'
      });
    }
  }
});

/**
 * POST /callback - Handle M-PESA payment callbacks
 */
app.post('/callback', (req, res) => {
  console.log('M-PESA Callback received:', JSON.stringify(req.body, null, 2));

  const { Body } = req.body;
  
  if (Body && Body.stkCallback) {
    const { ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;
    
    console.log(`Payment Result: ${ResultCode} - ${ResultDesc}`);
    
    if (ResultCode === 0 && CallbackMetadata) {
      // Payment successful - extract transaction details
      const items = CallbackMetadata.Item;
      const transactionData = {};
      
      items.forEach(item => {
        switch (item.Name) {
          case 'Amount':
            transactionData.Amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            transactionData.MpesaReceiptNumber = item.Value;
            break;
          case 'PhoneNumber':
            transactionData.PhoneNumber = item.Value;
            break;
          case 'TransactionDate':
            transactionData.TransactionDate = item.Value;
            break;
        }
      });
      
      console.log('Transaction completed successfully:', transactionData);
      console.log(`Amount: KES ${transactionData.Amount}`);
      console.log(`Phone: ${transactionData.PhoneNumber}`);
      console.log(`Receipt: ${transactionData.MpesaReceiptNumber}`);
    } else {
      console.log('Payment failed or was cancelled');
    }
  }

  // Always respond with success to acknowledge receipt
  res.json({
    ResultCode: 0,
    ResultDesc: 'Callback received successfully'
  });
});

/**
 * GET /health - Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Coffee Kiosk M-PESA API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Coffee Kiosk M-PESA API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      pay: 'POST /pay',
      callback: 'POST /callback'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: 'INTERNAL_ERROR'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Coffee Kiosk M-PESA API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  // Validate environment variables
  const requiredEnvVars = ['CONSUMER_KEY', 'CONSUMER_SECRET', 'BUSINESS_SHORT_CODE', 'PASSKEY', 'CALLBACK_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('WARNING: Missing environment variables:', missingVars.join(', '));
  } else {
    console.log('All required environment variables are configured');
  }
});
