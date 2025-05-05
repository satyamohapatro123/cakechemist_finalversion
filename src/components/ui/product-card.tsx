
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    // Get existing cart items from localStorage
    const existingCartItems = localStorage.getItem('cartItems');
    let cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if it doesn't exist
      cartItems.push({
        id,
        name,
        price,
        image,
        category,
        quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count in header
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${name} added to your cart`,
    });
    
    // Reset quantity
    setQuantity(1);
  };

  return (
    <div className="group">
      <Link to={`/shop/${id}`} className="block overflow-hidden rounded-md">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="mt-3 flex justify-between">
        <div>
          <Link to={`/shop/${id}`}>
            <h3 className="font-medium text-lg group-hover:text-bakery-700 transition-colors">{name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">₹{price.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center border border-input rounded-md">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none" 
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none" 
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button 
          onClick={addToCart} 
          size="sm" 
          className="gap-1"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
