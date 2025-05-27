
import { CoffeeProduct } from '@/types/coffee';
import { ProductCard } from '@/components/ProductCard';

const coffeeProducts: CoffeeProduct[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Rich and bold single shot espresso',
    price: 150,
    image: 'https://pin.it/4eamqgCw4'
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Creamy cappuccino with perfect foam',
    price: 200,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Latte',
    description: 'Smooth latte with steamed milk',
    price: 220,
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Americano',
    description: 'Classic americano for coffee purists',
    price: 180,
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Mocha',
    description: 'Chocolate infused coffee delight',
    price: 250,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    name: 'Macchiato',
    description: 'Espresso with a dollop of foam',
    price: 190,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=300&fit=crop'
  }
];

interface ProductGridProps {
  onBuyProduct: (product: CoffeeProduct) => void;
}

export const ProductGrid = ({ onBuyProduct }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coffeeProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onBuy={() => onBuyProduct(product)}
        />
      ))}
    </div>
  );
};
