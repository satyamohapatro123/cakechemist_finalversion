import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Plus, Minus, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId: string;
  description?: string;
}

interface Customization {
  isEggless: boolean;
  nameOnCake: string;
  imageOnCake: boolean;
  uploadedImage: string | null;
  flavor: string;
  size: string;
  shape: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customization, setCustomization] = useState<Customization>({
    isEggless: false,
    nameOnCake: "",
    imageOnCake: false,
    uploadedImage: null,
    flavor: "vanilla",
    size: "1kg",
    shape: "round"
  });

  // Calculate price with customizations
  const basePrice = product?.price || 0;
  const egglessPrice = customization.isEggless ? 100 : 0;
  const namePrice = customization.nameOnCake ? 50 : 0;
  const imagePrice = customization.imageOnCake ? 150 : 0;

  // Size pricing
  const sizePrice = customization.size === "0.5kg" ? -100 :
                   customization.size === "1kg" ? 0 :
                   customization.size === "1.5kg" ? 200 :
                   customization.size === "2kg" ? 400 : 0;

  // Flavor pricing
  const flavorPrice = customization.flavor === "vanilla" ? 0 :
                     customization.flavor === "chocolate" ? 50 :
                     customization.flavor === "strawberry" ? 50 :
                     customization.flavor === "butterscotch" ? 70 :
                     customization.flavor === "redvelvet" ? 100 : 0;

  // Shape pricing
  const shapePrice = customization.shape === "round" ? 0 :
                    customization.shape === "square" ? 50 :
                    customization.shape === "heart" ? 100 :
                    customization.shape === "custom" ? 200 : 0;

  const totalItemPrice = basePrice + egglessPrice + namePrice + imagePrice + sizePrice + flavorPrice + shapePrice;

  // Load product data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the sample products from localStorage or hardcoded data
    const loadProduct = () => {
      const allProducts = [
        {
          id: "1",
          name: "Classic Croissant",
          price: 199.50,
          image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
          category: "Pastry",
          categoryId: "pastry",
          description: "A buttery, flaky pastry named for its historical crescent shape."
        },
        {
          id: "2",
          name: "Chocolate Cake",
          price: 1299.00,
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
          category: "Cakes",
          categoryId: "cake",
          description: "Rich, moist chocolate cake with smooth chocolate ganache and chocolate shavings."
        },
        {
          id: "3",
          name: "Sourdough Bread",
          price: 299.00,
          image: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
          category: "Bread",
          categoryId: "bread",
          description: "Artisan bread made with a fermented dough starter, giving it a slightly sour taste."
        },
        {
          id: "4",
          name: "Fruit Tart",
          price: 249.50,
          image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
          category: "Desserts",
          categoryId: "dessert",
          description: "Buttery pastry crust filled with vanilla custard and topped with fresh seasonal fruits."
        },
        {
          id: "5",
          name: "Baguette",
          price: 169.00,
          image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop",
          category: "Bread",
          categoryId: "bread",
          description: "Traditional French bread known for its long, thin shape and crispy crust."
        },
        {
          id: "6",
          name: "Cinnamon Roll",
          price: 189.00,
          image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop",
          category: "Pastry",
          categoryId: "pastry",
          description: "Sweet roll with a cinnamon-sugar filling and topped with cream cheese frosting."
        },
        {
          id: "7",
          name: "Red Velvet Cake",
          price: 1499.00,
          image: "https://images.unsplash.com/photo-1586788680434-30d324626f4c?q=80&w=1000&auto=format&fit=crop",
          category: "Cakes",
          categoryId: "cake",
          description: "Distinctive red-colored cake with a subtle chocolate flavor and cream cheese frosting."
        },
        {
          id: "8",
          name: "Cheesecake",
          price: 279.00,
          image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
          category: "Desserts",
          categoryId: "dessert",
          description: "Creamy dessert with a graham cracker crust, topped with fresh berries."
        }
      ];

      const foundProduct = allProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Product not found, redirect to shop
        navigate("/shop");
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleCustomizationChange = (field: keyof Customization, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleCustomizationChange('uploadedImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    handleCustomizationChange('uploadedImage', null);
  };

  const addToCart = () => {
    if (!product) return;

    // Get existing cart items
    const existingCartItems = localStorage.getItem('cartItems');
    let cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];

    // Create a unique ID for this item with customizations
    const customizationId = isCustomizing ?
      `-${customization.isEggless ? 'e' : ''}${customization.nameOnCake ? 'n' : ''}${customization.imageOnCake ? 'i' : ''}` : '';
    const itemId = `${product.id}${customizationId}`;

    // Check if this exact item (with same customizations) exists
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === itemId);

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cartItems.push({
        id: itemId,
        productId: product.id,
        name: product.name,
        price: totalItemPrice,
        basePrice: product.price,
        image: product.image,
        category: product.category,
        quantity,
        customization: isCustomizing ? {
          isEggless: customization.isEggless,
          nameOnCake: customization.nameOnCake,
          imageOnCake: customization.imageOnCake,
          uploadedImage: customization.uploadedImage,
          flavor: customization.flavor,
          size: customization.size,
          shape: customization.shape
        } : null
      });
    }

    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update cart count
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);

    // Show success message
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });

    // Reset quantity
    setQuantity(1);
  };

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <main>
      <section className="py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-square overflow-hidden rounded-md bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-serif mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.category}</p>

              <div className="flex items-baseline mb-6">
                <span className="text-2xl font-medium">₹{totalItemPrice.toFixed(2)}</span>
                {isCustomizing && totalItemPrice !== basePrice && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Base: ₹{basePrice.toFixed(2)})
                  </span>
                )}
              </div>

              <p className="mb-6">{product.description || "No description available."}</p>

              <Tabs defaultValue="standard" className="mb-6">
                <TabsList>
                  <TabsTrigger
                    value="standard"
                    onClick={() => setIsCustomizing(false)}
                  >
                    Standard
                  </TabsTrigger>
                  {product.categoryId === "cake" && (
                    <TabsTrigger
                      value="customize"
                      onClick={() => setIsCustomizing(true)}
                    >
                      Customize
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="standard" className="pt-4">
                  <p>Standard {product.name} with our classic recipe.</p>
                </TabsContent>

                {product.categoryId === "cake" && (
                  <TabsContent value="customize" className="pt-4 space-y-4">
                    <div className="space-y-6">
                      {/* Egg/Eggless Option */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="eggless"
                          checked={customization.isEggless}
                          onCheckedChange={(checked) =>
                            handleCustomizationChange('isEggless', checked === true)
                          }
                        />
                        <div>
                          <Label htmlFor="eggless">Eggless (+₹100)</Label>
                          <p className="text-sm text-muted-foreground">
                            Made without eggs, perfect for vegetarians
                          </p>
                        </div>
                      </div>

                      {/* Cake Size */}
                      <div className="space-y-2">
                        <Label>Cake Size</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <Button
                            type="button"
                            variant={customization.size === "0.5kg" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('size', "0.5kg")}
                            className="w-full"
                          >
                            0.5 kg (-₹100)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.size === "1kg" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('size', "1kg")}
                            className="w-full"
                          >
                            1 kg (Standard)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.size === "1.5kg" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('size', "1.5kg")}
                            className="w-full"
                          >
                            1.5 kg (+₹200)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.size === "2kg" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('size', "2kg")}
                            className="w-full"
                          >
                            2 kg (+₹400)
                          </Button>
                        </div>
                      </div>

                      {/* Cake Flavor */}
                      <div className="space-y-2">
                        <Label>Cake Flavor</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={customization.flavor === "vanilla" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('flavor', "vanilla")}
                            className="w-full"
                          >
                            Vanilla
                          </Button>
                          <Button
                            type="button"
                            variant={customization.flavor === "chocolate" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('flavor', "chocolate")}
                            className="w-full"
                          >
                            Chocolate (+₹50)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.flavor === "strawberry" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('flavor', "strawberry")}
                            className="w-full"
                          >
                            Strawberry (+₹50)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.flavor === "butterscotch" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('flavor', "butterscotch")}
                            className="w-full"
                          >
                            Butterscotch (+₹70)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.flavor === "redvelvet" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('flavor', "redvelvet")}
                            className="w-full"
                          >
                            Red Velvet (+₹100)
                          </Button>
                        </div>
                      </div>

                      {/* Cake Shape */}
                      <div className="space-y-2">
                        <Label>Cake Shape</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <Button
                            type="button"
                            variant={customization.shape === "round" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('shape', "round")}
                            className="w-full"
                          >
                            Round
                          </Button>
                          <Button
                            type="button"
                            variant={customization.shape === "square" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('shape', "square")}
                            className="w-full"
                          >
                            Square (+₹50)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.shape === "heart" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('shape', "heart")}
                            className="w-full"
                          >
                            Heart (+₹100)
                          </Button>
                          <Button
                            type="button"
                            variant={customization.shape === "custom" ? "default" : "outline"}
                            onClick={() => handleCustomizationChange('shape', "custom")}
                            className="w-full"
                          >
                            Custom (+₹200)
                          </Button>
                        </div>
                      </div>

                      {/* Name on Cake */}
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCake">Name on Cake (+₹50)</Label>
                        <Input
                          id="nameOnCake"
                          placeholder="Enter name or message"
                          value={customization.nameOnCake}
                          onChange={(e) => handleCustomizationChange('nameOnCake', e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Up to 25 characters
                        </p>
                      </div>

                      {/* Image on Cake */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="imageOnCake"
                            checked={customization.imageOnCake}
                            onCheckedChange={(checked) => {
                              handleCustomizationChange('imageOnCake', checked === true);
                              if (checked === false) {
                                handleCustomizationChange('uploadedImage', null);
                              }
                            }}
                          />
                          <div>
                            <Label htmlFor="imageOnCake">Image on Cake (+₹150)</Label>
                            <p className="text-sm text-muted-foreground">
                              Add a custom image to your cake
                            </p>
                          </div>
                        </div>

                        {customization.imageOnCake && (
                          <div className="mt-2">
                            {!customization.uploadedImage ? (
                              <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-2">
                                  Upload an image for your cake
                                </p>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  id="image-upload"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => document.getElementById('image-upload')?.click()}
                                >
                                  Select Image
                                </Button>
                              </div>
                            ) : (
                              <div className="relative">
                                <img
                                  src={customization.uploadedImage}
                                  alt="Uploaded"
                                  className="max-h-40 rounded-md mx-auto"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={removeUploadedImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-input rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={addToCart}
                  className="flex-1 gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Category: {product.category}</p>
                <p>Product ID: {product.id}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
