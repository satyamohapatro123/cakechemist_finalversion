
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
                  CakeChemist was founded in 2015 by Dr. Priya Sharma, a food scientist with a passion for baking who dreamed of creating a bakery where science and culinary art intersect to create extraordinary cakes.
                </p>
                <p>
                  What started as an experimental kitchen with just three signature cake formulas has grown into an innovative bakery known for our molecular gastronomy techniques, unique flavor combinations, and visually stunning cake designs.
                </p>
                <p>
                  Despite our growth, we remain committed to our founding principles: using premium ingredients, applying scientific precision to our baking process, and pushing the boundaries of what's possible in cake design.
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
                <span className="text-3xl text-bakery-700">🧪</span>
              </div>
              <h3 className="text-xl font-serif mb-3">Scientific Precision</h3>
              <p>
                We approach baking with scientific rigor, measuring ingredients to the gram and controlling temperature and humidity for perfect results every time.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-bakery-700">🔬</span>
              </div>
              <h3 className="text-xl font-serif mb-3">Innovative Techniques</h3>
              <p>
                We embrace molecular gastronomy and cutting-edge baking methods to create unique textures, flavors, and visual presentations that surprise and delight.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-bakery-700">🧠</span>
              </div>
              <h3 className="text-xl font-serif mb-3">Creative Experimentation</h3>
              <p>
                Our test kitchen is constantly developing new cake formulas, flavor combinations, and decorative techniques to push the boundaries of cake design.
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
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                alt="Dr. Priya Sharma - Founder & Food Scientist"
                className="w-64 h-64 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-serif mb-1">Dr. Priya Sharma</h3>
              <p className="text-muted-foreground">Founder & Food Scientist</p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop"
                alt="Arjun Patel - Molecular Gastronomy Specialist"
                className="w-64 h-64 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-serif mb-1">Arjun Patel</h3>
              <p className="text-muted-foreground">Molecular Gastronomy Specialist</p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                alt="Meera Kapoor - Cake Design Artist"
                className="w-64 h-64 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-serif mb-1">Meera Kapoor</h3>
              <p className="text-muted-foreground">Cake Design Artist</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
