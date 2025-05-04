
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { Testimonial } from "@/components/ui/testimonial";

const HomePage = () => {
  // Sample featured products
  const featuredProducts = [
    {
      id: "1",
      name: "Classic Croissant",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
      category: "Pastry"
    },
    {
      id: "2",
      name: "Chocolate Cake",
      price: 28.99,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      category: "Cakes"
    },
    {
      id: "3",
      name: "Sourdough Bread",
      price: 6.49,
      image: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
      category: "Bread"
    },
    {
      id: "4",
      name: "Fruit Tart",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
      category: "Desserts"
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=1080&auto=format&fit=crop"
            alt="Freshly baked goods"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">Handcrafted with Love</h1>
            <p className="text-lg md:text-xl mb-8">
              Indulge in our freshly baked treats made with the finest ingredients and passion for quality.
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
            title="Our Featured Products" 
            subtitle="Handmade with love and the finest ingredients"
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
                At Sweet Delights, we believe in the power of a perfectly baked treat to brighten someone's day. Our bakery was founded with a simple mission: to create delicious, handcrafted baked goods using traditional methods and the finest ingredients available.
              </p>
              <p className="text-lg">
                Every morning, our bakers arrive before dawn to mix, knead, and shape our signature breads, pastries, and desserts. We're committed to quality and authenticity in everything we make.
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
              quote="The croissants from Sweet Delights are better than what I've had in Paris! Flaky, buttery, and absolutely perfect."
              author="Sarah Johnson"
              role="Loyal Customer"
            />
            <Testimonial 
              quote="I ordered a custom cake for my daughter's birthday and it exceeded all my expectations. Not only was it beautiful, but it tasted amazing too!"
              author="Michael Thompson"
              role="Happy Parent"
            />
            <Testimonial 
              quote="Their sourdough bread is the best in town. I've been a weekly customer for years and the quality never disappoints."
              author="Emily Rodriguez"
              role="Bread Enthusiast"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bakery-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Ready to Place an Order?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Browse our selection of freshly-baked goods and place your order for pickup today.
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
