
export const CoffeeFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Coffee Kiosk</h3>
            <p className="text-gray-300">
              Premium coffee experience with seamless M-PESA payments.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">Phone: +254 700 000 000</p>
            <p className="text-gray-300">Email: info@coffeekiosk.ke</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment</h3>
            <p className="text-gray-300">We accept M-PESA payments</p>
            <p className="text-gray-300">Safe & Secure transactions</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Coffee Kiosk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
