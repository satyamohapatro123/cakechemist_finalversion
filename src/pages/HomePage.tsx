import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { Testimonial } from "@/components/ui/testimonial";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId?: string;
  description?: string;
}

interface HomePageContent {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredTitle: string;
  featuredSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
}

const defaultContent: HomePageContent = {
  heroImage: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=1080&auto=format&fit=crop",
  heroTitle: "Handcrafted with Love",
  heroSubtitle: "Indulge in our freshly baked treats made with the finest ingredients and passion for quality.",
  featuredTitle: "Our Featured Products",
  featuredSubtitle: "Handmade with love and the finest ingredients",
  ctaTitle: "Ready to Place an Order?",
  ctaSubtitle: "Browse our selection of freshly-baked goods and place your order for pickup today."
};

const HomePage = () => {
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Classic Croissant",
      price: 199.50,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
      category: "Pastry"
    },
    {
      id: "2",
      name: "Chocolate Cake",
      price: 1299.00,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      category: "Cakes"
    },
    {
      id: "3",
      name: "Sourdough Bread",
      price: 299.00,
      image: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
      category: "Bread"
    },
    {
      id: "4",
      name: "Fruit Tart",
      price: 249.50,
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
      category: "Desserts"
    }
  ]);

  // Load home page content from localStorage
  useEffect(() => {
    const loadHomePageContent = () => {
      const storedContent = localStorage.getItem('homePageContent');
      if (storedContent) {
        setContent(JSON.parse(storedContent));
      }
    };

    loadHomePageContent();

    // Listen for home page content updates
    const handleHomePageUpdated = () => {
      console.log("Home page content updated event received");
      loadHomePageContent();
    };

    window.addEventListener('homePageUpdated', handleHomePageUpdated);

    return () => {
      window.removeEventListener('homePageUpdated', handleHomePageUpdated);
    };
  }, []);

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        // Get the first 4 products for featured display
        const featured = allProducts.slice(0, 4).map((product: Product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }));
        setFeaturedProducts(featured);
      }
    };

    loadProducts();

    // Listen for product updates
    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={content.heroImage}
            alt="Freshly baked goods"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">{content.heroTitle}</h1>
            <p className="text-lg md:text-xl mb-8">
              {content.heroSubtitle}
            </p>
            <Button size="lg" asChild>
              <Link to="/shop">Order Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-custom">
          <SectionHeading
            title={content.featuredTitle}
            subtitle={content.featuredSubtitle}
            center
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {featuredProducts.map((product) => (
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

          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?q=80&w=1000&auto=format&fit=crop"
                alt="Baker kneading dough"
                className="rounded-md w-full h-[500px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <SectionHeading
                title="Our Story"
                subtitle="Crafting delicious memories since 2010"
              />
              <p className="text-lg">
                At CakeChemist, we blend the art of baking with scientific precision to create extraordinary cakes. Our bakery was founded with a unique mission: to craft innovative, delicious cakes using premium ingredients and creative techniques.
              </p>
              <p className="text-lg">
                Every creation is a perfect balance of flavor, texture, and visual appeal. We approach baking like scientists in a lab, experimenting with ingredients and methods to achieve cake perfection.
              </p>
              <Button asChild>
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container-custom">
          <SectionHeading
            title="What Our Customers Say"
            center
          />

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <Testimonial
              quote="The cakes from CakeChemist are truly extraordinary! The flavors are perfectly balanced and the designs are like edible works of art. Their fusion of Indian and Western flavors is unique."
              author="Ananya Desai"
              role="Loyal Customer"
            />
            <Testimonial
              quote="I ordered a custom cake for my daughter's wedding and it exceeded all my expectations. The molecular gastronomy techniques they used created amazing textures!"
              author="Rajesh Malhotra"
              role="Happy Parent"
            />
            <Testimonial
              quote="Their signature Beaker Cake with cardamom and saffron is the most innovative dessert I've ever tasted. The combination of flavors and textures is pure genius."
              author="Kavita Sharma"
              role="Food Blogger"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bakery-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">{content.ctaTitle}</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {content.ctaSubtitle}
          </p>
          <Button variant="secondary" size="lg" className="text-bakery-800" asChild>
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
