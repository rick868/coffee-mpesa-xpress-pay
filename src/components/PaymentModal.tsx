
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoffeeProduct } from '@/types/coffee';
import { validatePhoneNumber, formatPhoneNumber } from '@/utils/phoneValidation';
import { processPayment } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CoffeeProduct | null;
}

export const PaymentModal = ({ isOpen, onClose, product }: PaymentModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const { toast } = useToast();

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handlePayment = async () => {
    if (!product) return;

    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setPhoneError(validation.error || 'Invalid phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await processPayment({
        phone: formattedPhone,
        amount: product.price
      });

      if (response.success) {
        toast({
          title: "Payment Initiated",
          description: "Please check your phone for M-PESA prompt and enter your PIN to complete the payment.",
        });
        onClose();
        setPhoneNumber('');
      } else {
        toast({
          title: "Payment Failed",
          description: response.message || "Payment could not be processed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Network error occurred. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setPhoneNumber('');
      setPhoneError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            Pay with M-PESA
          </DialogTitle>
        </DialogHeader>

        {product && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <div className="text-xl font-bold text-green-600">
                  KES {product.price}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Safaricom Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 0712345678"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={phoneError ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {phoneError && (
                <p className="text-sm text-red-500">{phoneError}</p>
              )}
              <p className="text-xs text-gray-500">
                Accepted formats: 07XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isLoading || !phoneNumber}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay KES ${product.price}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
