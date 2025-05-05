import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash, Plus, Upload, X, Image } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}

const GalleryManagement = () => {
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    image: ""
  });

  // Load gallery images from localStorage
  useEffect(() => {
    const loadGalleryImages = () => {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleGalleryImages = [
        {
          id: "1",
          title: "Chocolate Cake Masterpiece",
          description: "Our signature chocolate cake with edible gold leaf decoration.",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          title: "Wedding Cake Collection",
          description: "Elegant three-tier wedding cake with fresh flowers.",
          image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1000&auto=format&fit=crop",
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          title: "Birthday Cupcakes",
          description: "Colorful birthday cupcakes with buttercream frosting.",
          image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop",
          createdAt: new Date().toISOString()
        },
        {
          id: "4",
          title: "Molecular Gastronomy Dessert",
          description: "Experimental dessert using molecular gastronomy techniques.",
          image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1000&auto=format&fit=crop",
          createdAt: new Date().toISOString()
        }
      ];

      // Check if we have gallery images in localStorage
      const storedGalleryImages = localStorage.getItem('galleryImages');
      if (storedGalleryImages) {
        setGalleryImages(JSON.parse(storedGalleryImages));
      } else {
        // If not, use sample data and save to localStorage
        setGalleryImages(sampleGalleryImages);
        localStorage.setItem('galleryImages', JSON.stringify(sampleGalleryImages));
      }
    };

    loadGalleryImages();
  }, []);

  // Save gallery images to localStorage
  const saveGalleryImages = (updatedGalleryImages: GalleryImage[]) => {
    setGalleryImages(updatedGalleryImages);
    localStorage.setItem('galleryImages', JSON.stringify(updatedGalleryImages));

    // Dispatch event for other parts of the app
    const event = new CustomEvent('galleryImagesUpdated');
    window.dispatchEvent(event);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open add gallery image dialog
  const openAddDialog = () => {
    setFormData({
      id: `gallery_${Date.now()}`,
      title: "",
      description: "",
      image: ""
    });
    setIsAddDialogOpen(true);
  };

  // Open edit gallery image dialog
  const openEditDialog = (image: GalleryImage) => {
    setSelectedImage(image);
    setFormData({
      id: image.id,
      title: image.title,
      description: image.description,
      image: image.image
    });
    setIsEditDialogOpen(true);
  };

  // Open delete gallery image dialog
  const openDeleteDialog = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsDeleteDialogOpen(true);
  };

  // Add new gallery image
  const handleAddGalleryImage = () => {
    if (!formData.title || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newGalleryImage: GalleryImage = {
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updatedGalleryImages = [...galleryImages, newGalleryImage];
    saveGalleryImages(updatedGalleryImages);

    toast({
      title: "Gallery Image Added",
      description: `${newGalleryImage.title} has been added successfully.`
    });

    setIsAddDialogOpen(false);
  };

  // Update existing gallery image
  const handleUpdateGalleryImage = () => {
    if (!selectedImage) return;

    if (!formData.title || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedGalleryImages = galleryImages.map(image =>
      image.id === selectedImage.id ? {
        ...formData,
        createdAt: selectedImage.createdAt
      } : image
    );

    saveGalleryImages(updatedGalleryImages);

    toast({
      title: "Gallery Image Updated",
      description: `${formData.title} has been updated successfully.`
    });

    setIsEditDialogOpen(false);
  };

  // Delete gallery image
  const handleDeleteGalleryImage = () => {
    if (!selectedImage) return;

    const updatedGalleryImages = galleryImages.filter(image => image.id !== selectedImage.id);
    saveGalleryImages(updatedGalleryImages);

    toast({
      title: "Gallery Image Deleted",
      description: `${selectedImage.title} has been deleted successfully.`
    });

    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Gallery Management</h2>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {galleryImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No gallery images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg truncate">{image.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                  {image.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(image)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => openDeleteDialog(image)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Gallery Image Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Gallery Image</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Image Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter image title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter image description"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Gallery Image</Label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Gallery"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => document.getElementById('image-upload-gallery')?.click()}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a gallery image
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image-upload-gallery')?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
              <Input
                id="image-upload-gallery"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGalleryImage}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Gallery Image Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Gallery Image</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Image Title</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter image title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter image description"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image">Gallery Image</Label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Gallery"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => document.getElementById('edit-image-upload-gallery')?.click()}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a gallery image
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('edit-image-upload-gallery')?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
              <Input
                id="edit-image-upload-gallery"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateGalleryImage}>Update Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Gallery Image Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gallery Image</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedImage?.title}</strong>?</p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteGalleryImage}>Delete Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagement;
