import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId: string;
  description?: string;
}

const ShopPage = () => {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "All Products" },
  ]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from localStorage
  useEffect(() => {
    const loadCategories = () => {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        // Parse stored categories and add the "All Products" option
        const parsedCategories = JSON.parse(storedCategories);
        setCategories([
          { id: "all", name: "All Products" },
          ...parsedCategories
        ]);
      }
    };

    loadCategories();

    // Listen for category updates
    const handleCategoriesUpdated = () => {
      console.log("Categories updated event received in ShopPage");
      loadCategories();
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);

    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
    };
  }, []);

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      setIsLoading(true);
      const storedProducts = localStorage.getItem('products');

      if (storedProducts) {
        setAllProducts(JSON.parse(storedProducts));
      } else {
        // Fallback to sample products if none in localStorage
        const sampleProducts = [
          {
            id: "1",
            name: "Classic Croissant",
            price: 199.50,
            image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
            category: "Pastry",
            categoryId: "pastry"
          },
          {
            id: "2",
            name: "Chocolate Cake",
            price: 1299.00,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
            category: "Cakes",
            categoryId: "cake"
          },
          {
            id: "3",
            name: "Sourdough Bread",
            price: 299.00,
            image: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
            category: "Bread",
            categoryId: "bread"
          },
          {
            id: "4",
            name: "Fruit Tart",
            price: 249.50,
            image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
            category: "Desserts",
            categoryId: "dessert"
          },
          {
            id: "5",
            name: "Baguette",
            price: 169.00,
            image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop",
            category: "Bread",
            categoryId: "bread"
          },
          {
            id: "6",
            name: "Cinnamon Roll",
            price: 189.00,
            image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop",
            category: "Pastry",
            categoryId: "pastry"
          },
          {
            id: "7",
            name: "Red Velvet Cake",
            price: 1499.00,
            image: "https://images.unsplash.com/photo-1586788680434-30d324626f4c?q=80&w=1000&auto=format&fit=crop",
            category: "Cakes",
            categoryId: "cake"
          },
          {
            id: "8",
            name: "Cheesecake",
            price: 279.00,
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
            category: "Desserts",
            categoryId: "dessert"
          },
        ];
        setAllProducts(sampleProducts);
      }
      setIsLoading(false);
    };

    loadProducts();

    // Listen for product updates
    const handleProductsUpdated = () => {
      console.log("Products updated event received in ShopPage");
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  const filteredProducts = activeCategory === "all"
    ? allProducts
    : allProducts.filter((product) => product.categoryId === activeCategory);

  return (
    <main>
      {/* Shop Banner */}
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="Our Bakery Shop"
            subtitle="Browse our selection of fresh baked goods"
            center
          />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p>No products found in this category.</p>
              <p className="text-muted-foreground mt-2">Try selecting a different category or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ShopPage;
