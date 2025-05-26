
import { Coffee } from 'lucide-react';

export const CoffeeHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Coffee Kiosk</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Menu
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
