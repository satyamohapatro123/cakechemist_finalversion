import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Image, Save, Upload } from "lucide-react";

interface AboutPageContent {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  
  ourStoryImage: string;
  ourStoryTitle: string;
  ourStoryContent: string;
  
  ourValuesImage: string;
  ourValuesTitle: string;
  ourValuesContent: string;
  
  teamTitle: string;
  teamSubtitle: string;
}

const AboutPageManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hero");
  
  const [content, setContent] = useState<AboutPageContent>({
    heroImage: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=1000&auto=format&fit=crop",
    heroTitle: "About CakeChemist",
    heroSubtitle: "Crafting Sweet Memories Since 2010",
    
    ourStoryImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
    ourStoryTitle: "Our Story",
    ourStoryContent: "CakeChemist began as a small family bakery in Mumbai with a passion for creating delicious, handcrafted desserts. What started as a hobby in our founder Priya Sharma's kitchen has grown into a beloved bakery known for quality ingredients and innovative recipes. We believe that every celebration deserves something special, and we put our heart into every creation.",
    
    ourValuesImage: "https://images.unsplash.com/photo-1464349095431-e9a21285b5c3?q=80&w=1000&auto=format&fit=crop",
    ourValuesTitle: "Our Values",
    ourValuesContent: "At CakeChemist, we're committed to quality, creativity, and community. We source the finest ingredients, support local suppliers, and constantly innovate our recipes. Our team works with passion and precision to ensure every product exceeds expectations. We believe in creating not just desserts, but experiences that bring joy and create lasting memories.",
    
    teamTitle: "Meet Our Team",
    teamSubtitle: "The talented people behind our delicious creations"
  });

  // Load content from localStorage on component mount
  useEffect(() => {
    const storedContent = localStorage.getItem('aboutPageContent');
    if (storedContent) {
      setContent(JSON.parse(storedContent));
    }
  }, []);

  // Handle text input changes
  const handleInputChange = (field: keyof AboutPageContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof AboutPageContent) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save content to localStorage
  const saveContent = () => {
    localStorage.setItem('aboutPageContent', JSON.stringify(content));
    
    // Dispatch event to notify the app of the update
    const event = new CustomEvent('aboutPageUpdated');
    window.dispatchEvent(event);
    
    toast({
      title: "Content Saved",
      description: "About page content has been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">About Page Management</h2>
        <Button onClick={saveContent}>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="story">Our Story</TabsTrigger>
          <TabsTrigger value="values">Our Values</TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the main banner of the About page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={content.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    placeholder="Enter hero title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={content.heroSubtitle}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    placeholder="Enter hero subtitle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-image">Hero Image</Label>
                  {content.heroImage ? (
                    <div className="relative">
                      <img
                        src={content.heroImage}
                        alt="Hero"
                        className="h-40 w-full object-cover rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => document.getElementById('hero-image-upload')?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a hero image
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
                    onChange={(e) => handleImageUpload(e, 'heroImage')}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Our Story Tab */}
        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
              <CardDescription>
                Edit the Our Story section content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="story-title">Section Title</Label>
                  <Input
                    id="story-title"
                    value={content.ourStoryTitle}
                    onChange={(e) => handleInputChange('ourStoryTitle', e.target.value)}
                    placeholder="Enter section title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="story-content">Content</Label>
                  <Textarea
                    id="story-content"
                    value={content.ourStoryContent}
                    onChange={(e) => handleInputChange('ourStoryContent', e.target.value)}
                    placeholder="Enter your story"
                    rows={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="story-image">Section Image</Label>
                  {content.ourStoryImage ? (
                    <div className="relative">
                      <img
                        src={content.ourStoryImage}
                        alt="Our Story"
                        className="h-40 w-full object-cover rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => document.getElementById('story-image-upload')?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a section image
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('story-image-upload')?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                  <Input
                    id="story-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'ourStoryImage')}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Our Values Tab */}
        <TabsContent value="values" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
              <CardDescription>
                Edit the Our Values section content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="values-title">Section Title</Label>
                  <Input
                    id="values-title"
                    value={content.ourValuesTitle}
                    onChange={(e) => handleInputChange('ourValuesTitle', e.target.value)}
                    placeholder="Enter section title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="values-content">Content</Label>
                  <Textarea
                    id="values-content"
                    value={content.ourValuesContent}
                    onChange={(e) => handleInputChange('ourValuesContent', e.target.value)}
                    placeholder="Describe your values"
                    rows={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="values-image">Section Image</Label>
                  {content.ourValuesImage ? (
                    <div className="relative">
                      <img
                        src={content.ourValuesImage}
                        alt="Our Values"
                        className="h-40 w-full object-cover rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => document.getElementById('values-image-upload')?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a section image
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('values-image-upload')?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                  <Input
                    id="values-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'ourValuesImage')}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutPageManagement;
