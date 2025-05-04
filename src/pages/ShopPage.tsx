
import { useState } from "react";
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
}

const ShopPage = () => {
  // Sample categories
  const categories: Category[] = [
    { id: "all", name: "All Products" },
    { id: "bread", name: "Bread" },
    { id: "pastry", name: "Pastries" },
    { id: "cake", name: "Cakes" },
    { id: "dessert", name: "Desserts" },
  ];

  // Sample products
  const allProducts: Product[] = [
    {
      id: "1",
      name: "Classic Croissant",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
      category: "Pastry",
      categoryId: "pastry"
    },
    {
      id: "2",
      name: "Chocolate Cake",
      price: 28.99,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      category: "Cakes",
      categoryId: "cake"
    },
    {
      id: "3",
      name: "Sourdough Bread",
      price: 6.49,
      image: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
      category: "Bread",
      categoryId: "bread"
    },
    {
      id: "4",
      name: "Fruit Tart",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
      category: "Desserts",
      categoryId: "dessert"
    },
    {
      id: "5",
      name: "Baguette",
      price: 3.49,
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop",
      category: "Bread",
      categoryId: "bread"
    },
    {
      id: "6",
      name: "Cinnamon Roll",
      price: 4.29,
      image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop",
      category: "Pastry",
      categoryId: "pastry"
    },
    {
      id: "7",
      name: "Red Velvet Cake",
      price: 32.99,
      image: "https://images.unsplash.com/photo-1586788680434-30d324626f4c?q=80&w=1000&auto=format&fit=crop",
      category: "Cakes",
      categoryId: "cake"
    },
    {
      id: "8",
      name: "Cheesecake",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
      category: "Desserts",
      categoryId: "dessert"
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

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
        </div>
      </section>
    </main>
  );
};

export default ShopPage;
