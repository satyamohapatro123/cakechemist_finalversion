import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, Save } from "lucide-react";

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

const HomePageManagement = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);

  // Load content from localStorage on component mount
  useEffect(() => {
    const storedContent = localStorage.getItem('homePageContent');
    if (storedContent) {
      setContent(JSON.parse(storedContent));
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setContent(prev => ({
          ...prev,
          heroImage: reader.result as string
        }));
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save content to localStorage
  const saveContent = () => {
    localStorage.setItem('homePageContent', JSON.stringify(content));
    
    // Dispatch event for other parts of the app
    const event = new CustomEvent('homePageUpdated');
    window.dispatchEvent(event);

    toast({
      title: "Changes Saved",
      description: "Home page content has been updated successfully."
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Home Page Management</h2>
        <Button onClick={saveContent}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Background Image</Label>
              {content.heroImage ? (
                <div className="relative">
                  <img
                    src={content.heroImage}
                    alt="Hero Background"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => document.getElementById('hero-image-upload')?.click()}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a hero background image
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('hero-image-upload')?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
              <Input
                id="hero-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                name="heroTitle"
                value={content.heroTitle}
                onChange={handleInputChange}
                placeholder="Enter hero title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                name="heroSubtitle"
                value={content.heroSubtitle}
                onChange={handleInputChange}
                placeholder="Enter hero subtitle"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Products Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featuredTitle">Section Title</Label>
              <Input
                id="featuredTitle"
                name="featuredTitle"
                value={content.featuredTitle}
                onChange={handleInputChange}
                placeholder="Enter featured products section title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredSubtitle">Section Subtitle</Label>
              <Input
                id="featuredSubtitle"
                name="featuredSubtitle"
                value={content.featuredSubtitle}
                onChange={handleInputChange}
                placeholder="Enter featured products section subtitle"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call to Action Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ctaTitle">CTA Title</Label>
              <Input
                id="ctaTitle"
                name="ctaTitle"
                value={content.ctaTitle}
                onChange={handleInputChange}
                placeholder="Enter CTA title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaSubtitle">CTA Subtitle</Label>
              <Textarea
                id="ctaSubtitle"
                name="ctaSubtitle"
                value={content.ctaSubtitle}
                onChange={handleInputChange}
                placeholder="Enter CTA subtitle"
                rows={2}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveContent} className="ml-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HomePageManagement;
