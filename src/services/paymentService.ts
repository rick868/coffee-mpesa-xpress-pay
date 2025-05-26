
import axios from 'axios';
import { PaymentRequest, PaymentResponse } from '@/types/coffee';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Configure axios with timeout and error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const processPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('Initiating payment:', { phone: paymentData.phone, amount: paymentData.amount });
    
    const response = await apiClient.post<PaymentResponse>('/pay', paymentData);
    
    console.log('Payment response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Payment error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData?.message || 'Payment failed. Please try again.',
          error: errorData?.error || 'SERVER_ERROR'
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'Unable to connect to payment service. Please check your connection.',
          error: 'NETWORK_ERROR'
        };
      }
    }
    
    // Unknown error
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: 'UNKNOWN_ERROR'
    };
  }
};
