
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to update cart count
  const updateCartCount = () => {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartItemsCount(totalItems);
    } else {
      setCartItemsCount(0);
    }
  };

  useEffect(() => {
    // Initialize cart count
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <header className="py-4 bg-background sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="font-handwriting text-2xl md:text-3xl text-bakery-800">Sweet Delights</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-bakery-700 transition-colors">Home</Link>
          <Link to="/about" className="font-medium hover:text-bakery-700 transition-colors">About</Link>
          <Link to="/shop" className="font-medium hover:text-bakery-700 transition-colors">Shop</Link>
          <Link to="/recipes" className="font-medium hover:text-bakery-700 transition-colors">Recipes</Link>
          <Link to="/gallery" className="font-medium hover:text-bakery-700 transition-colors">Gallery</Link>
          <Link to="/contact" className="font-medium hover:text-bakery-700 transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="p-2 relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-bakery-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartItemsCount}</span>
          </Link>
          <Button variant="default" asChild className="hidden lg:flex">
            <Link to="/shop">Order Now</Link>
          </Button>
          <button 
            className="lg:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background z-50 animate-fade-in">
          <div className="container-custom py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="font-handwriting text-2xl text-bakery-800">Sweet Delights</span>
            </Link>
            <button onClick={toggleMenu} className="p-2">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="container-custom flex flex-col space-y-6 py-12 text-lg">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors">About</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors">Shop</Link>
            <Link to="/recipes" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors">Recipes</Link>
            <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors">Gallery</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors">Contact</Link>
            <Button variant="default" asChild className="w-full mt-4">
              <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Order Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
