
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ShoppingBag,
  Menu,
  X,
  Beaker,
  User,
  Settings,
  LogOut,
  UserCog,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();

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
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-bakery-600 text-white rounded-full w-10 h-10">
            <Beaker className="h-6 w-6" />
          </div>
          <span className="font-handwriting text-2xl md:text-3xl text-bakery-800">CakeChemist</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-bakery-700 transition-colors">Home</Link>
          <Link to="/about" className="font-medium hover:text-bakery-700 transition-colors">About</Link>
          <Link to="/shop" className="font-medium hover:text-bakery-700 transition-colors">Shop</Link>
          <Link to="/recipes" className="font-medium hover:text-bakery-700 transition-colors">Recipes</Link>
          <Link to="/gallery" className="font-medium hover:text-bakery-700 transition-colors">Gallery</Link>
          <Link to="/contact" className="font-medium hover:text-bakery-700 transition-colors">Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="font-medium text-bakery-700 hover:text-bakery-800 transition-colors flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="p-2 relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-bakery-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartItemsCount}</span>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.profilePicture} alt={currentUser?.name} />
                    <AvatarFallback className="bg-bakery-100 text-bakery-800">
                      {currentUser?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="cursor-pointer">
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>Admin Profile</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild className="hidden lg:flex">
              <Link to="/login">Login</Link>
            </Button>
          )}

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
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <div className="flex items-center justify-center bg-bakery-600 text-white rounded-full w-8 h-8">
                <Beaker className="h-5 w-5" />
              </div>
              <span className="font-handwriting text-2xl text-bakery-800">CakeChemist</span>
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
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="font-medium text-bakery-700 hover:text-bakery-800 transition-colors flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={currentUser?.profilePicture} alt={currentUser?.name} />
                    <AvatarFallback className="bg-bakery-100 text-bakery-800 text-xs">
                      {currentUser?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  My Profile
                </Link>

                {isAdmin && (
                  <Link to="/admin/profile" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors flex items-center">
                    <UserCog className="h-4 w-4 mr-2" />
                    Admin Profile
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="font-medium text-red-600 hover:text-red-700 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-bakery-700 transition-colors">
                Login / Register
              </Link>
            )}

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
