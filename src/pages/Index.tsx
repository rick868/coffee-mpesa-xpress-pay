
import { useState } from 'react';
import { CoffeeHeader } from '@/components/CoffeeHeader';
import { ProductGrid } from '@/components/ProductGrid';
import { PaymentModal } from '@/components/PaymentModal';
import { CoffeeFooter } from '@/components/CoffeeFooter';
import { CoffeeProduct } from '@/types/coffee';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<CoffeeProduct | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleBuyProduct = (product: CoffeeProduct) => {
    setSelectedProduct(product);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CoffeeHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Coffee Kiosk
          </h1>
          <p className="text-xl text-gray-600">
            Premium coffee, delivered fresh. Pay seamlessly with M-PESA.
          </p>
        </div>
        
        <ProductGrid onBuyProduct={handleBuyProduct} />
      </main>

      <CoffeeFooter />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Index;
