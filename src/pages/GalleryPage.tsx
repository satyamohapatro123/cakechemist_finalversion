
import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/section-heading";

interface GalleryImage {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  alt?: string;
  createdAt?: string;
}

const GalleryPage = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load gallery images from localStorage
    const loadGalleryImages = () => {
      setIsLoading(true);
      const storedGalleryImages = localStorage.getItem('galleryImages');

      if (storedGalleryImages) {
        const parsedImages = JSON.parse(storedGalleryImages);
        // Transform the data if needed to match the expected format
        const formattedImages = parsedImages.map((img: GalleryImage) => ({
          id: img.id,
          url: img.image || img.url,
          alt: img.title || img.alt || "Gallery image"
        }));
        setGalleryImages(formattedImages);
      } else {
        // Fallback to sample gallery images if none in localStorage
        const sampleGalleryImages = [
          {
            id: "1",
            url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
            alt: "Fresh croissants"
          },
          {
            id: "2",
            url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
            alt: "Chocolate cake"
          },
          {
            id: "3",
            url: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
            alt: "Sourdough bread"
          },
          {
            id: "4",
            url: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
            alt: "Fruit tart"
          },
          {
            id: "5",
            url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop",
            alt: "Freshly baked cookies"
          },
          {
            id: "6",
            url: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=1000&auto=format&fit=crop",
            alt: "Bakery display case"
          },
          {
            id: "7",
            url: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=1000&auto=format&fit=crop",
            alt: "Baker working with dough"
          },
          {
            id: "8",
            url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop",
            alt: "Fresh muffins"
          },
          {
            id: "9",
            url: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?q=80&w=1000&auto=format&fit=crop",
            alt: "Bread selection"
          }
        ];
        setGalleryImages(sampleGalleryImages);
      }
      setIsLoading(false);
    };

    loadGalleryImages();

    // Listen for gallery image updates
    const handleGalleryImagesUpdated = () => {
      console.log("Gallery images updated event received");
      loadGalleryImages();
    };

    window.addEventListener('galleryImagesUpdated', handleGalleryImagesUpdated);

    return () => {
      window.removeEventListener('galleryImagesUpdated', handleGalleryImagesUpdated);
    };
  }, []);

  return (
    <main>
      {/* Gallery Banner */}
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="Our Gallery"
            subtitle="A visual feast of our bakery creations"
            center
          />
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Loading gallery...</p>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No gallery images found.</p>
              <p className="text-muted-foreground mt-2">Check back later for our latest creations!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default GalleryPage;
