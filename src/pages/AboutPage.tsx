
import { SectionHeading } from "@/components/ui/section-heading";

const AboutPage = () => {
  return (
    <main>
      {/* About Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=1080&auto=format&fit=crop"
            alt="Bakery kitchen"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">About Our Bakery</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            The story of passion, tradition, and the love for baking.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?q=80&w=1000&auto=format&fit=crop"
                alt="Baker kneading dough"
                className="rounded-md w-full"
              />
            </div>
            <div>
              <SectionHeading title="Our Story" />
              <div className="space-y-4 text-lg">
                <p>
                  Sweet Delights was founded in 2010 by Jane Smith, a passionate baker with a dream of creating a neighborhood bakery where every item is made with care, quality ingredients, and traditional techniques.
                </p>
                <p>
                  What started as a small bakery with just three signature items has grown into a beloved local institution, known for our artisanal breads, decadent pastries, and custom celebration cakes.
                </p>
                <p>
                  Despite our growth, we remain committed to our founding principles: using the finest ingredients, baking fresh daily, and treating every customer like family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-bakery-50">
        <div className="container-custom">
          <SectionHeading
            title="Our Values"
            subtitle="What makes our bakery special"
            center
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-bakery-700">🌾</span>
              </div>
              <h3 className="text-xl font-serif mb-3">Quality Ingredients</h3>
              <p>
                We source the finest organic flour, European-style butter, farm-fresh eggs, and seasonal produce to ensure every bite is exceptional.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-bakery-700">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-serif mb-3">Traditional Methods</h3>
              <p>
                We believe in taking the time to do things right, using time-honored techniques handed down through generations of bakers.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-bakery-700">❤️</span>
              </div>
              <h3 className="text-xl font-serif mb-3">Made with Love</h3>
              <p>
                Every item that leaves our bakery is crafted with care and attention to detail by our passionate team of bakers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16">
        <div className="container-custom">
          <SectionHeading
            title="Meet Our Team"
            subtitle="The passionate people behind our delicious creations"
            center
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=1000&auto=format&fit=crop"
                alt="Jane Smith - Founder & Head Baker"
                className="w-64 h-64 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-serif mb-1">Jane Smith</h3>
              <p className="text-muted-foreground">Founder & Head Baker</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1595273670150-bd6c3c4e6482?q=80&w=1000&auto=format&fit=crop"
                alt="Mark Johnson - Pastry Chef"
                className="w-64 h-64 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-serif mb-1">Mark Johnson</h3>
              <p className="text-muted-foreground">Pastry Chef</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1597248374161-426f0d6d2fc9?q=80&w=1000&auto=format&fit=crop"
                alt="Sarah Williams - Bread Specialist"
                className="w-64 h-64 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-serif mb-1">Sarah Williams</h3>
              <p className="text-muted-foreground">Bread Specialist</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
