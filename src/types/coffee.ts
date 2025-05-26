
export interface CoffeeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface PaymentRequest {
  phone: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  error?: string;
}
