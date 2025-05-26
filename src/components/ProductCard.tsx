
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CoffeeProduct } from '@/types/coffee';

interface ProductCardProps {
  product: CoffeeProduct;
  onBuy: () => void;
}

export const ProductCard = ({ product, onBuy }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {product.description}
        </p>
        <div className="text-2xl font-bold text-green-600">
          KES {product.price}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={onBuy}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Buy with M-PESA
        </Button>
      </CardFooter>
    </Card>
  );
};
