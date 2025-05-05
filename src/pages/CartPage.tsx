
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customization {
  isEggless: boolean;
  nameOnCake: string;
  imageOnCake: boolean;
  uploadedImage: string | null;
  flavor: string;
  size: string;
  shape: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  basePrice?: number;
  image: string;
  quantity: number;
  category: string;
  customization?: Customization | null;
}

const CartPage = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const items = localStorage.getItem('cartItems');
      if (items) {
        setCartItems(JSON.parse(items));
      }
    };

    loadCartItems();
    window.addEventListener('cartUpdated', loadCartItems);

    return () => {
      window.removeEventListener('cartUpdated', loadCartItems);
    };
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    // Trigger cart update event
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    // Trigger cart update event
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18; // 18% GST rate for India
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main>
      {/* Cart Banner */}
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="Your Cart"
            subtitle={`You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
            center
          />
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container-custom">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center border-b border-border pb-6">
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1">₹{item.price.toFixed(2)}</p>

                        {item.customization && (
                          <div className="text-xs text-muted-foreground mt-1 space-y-1">
                            {item.customization.isEggless && (
                              <p>• Eggless</p>
                            )}
                            {item.customization.size && (
                              <p>• Size: {item.customization.size}</p>
                            )}
                            {item.customization.flavor && (
                              <p>• Flavor: {item.customization.flavor}</p>
                            )}
                            {item.customization.shape && (
                              <p>• Shape: {item.customization.shape}</p>
                            )}
                            {item.customization.nameOnCake && (
                              <p>• Name: "{item.customization.nameOnCake}"</p>
                            )}
                            {item.customization.imageOnCake && (
                              <p>• Custom image added</p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center mt-2">
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-border rounded-l-md"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center border-t border-b border-border">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-border rounded-r-md"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors mt-2"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-secondary p-6 rounded-md">
                  <h2 className="text-xl font-serif mb-4">Order Summary</h2>

                  <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                    <div className="flex justify-between">
                      <span>Items ({totalItems}):</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-medium text-lg mb-6">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <Button className="w-full" asChild disabled={cartItems.length === 0}>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="text-center mt-4">
                    <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CartPage;
