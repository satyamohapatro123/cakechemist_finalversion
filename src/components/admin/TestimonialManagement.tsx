import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
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
import { Pencil, Trash, Plus } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

const TestimonialManagement = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    quote: "",
    author: "",
    role: ""
  });

  // Load testimonials
  useEffect(() => {
    const loadTestimonials = () => {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleTestimonials = [
        {
          id: "1",
          quote: "The cakes from CakeChemist are truly extraordinary! The flavors are perfectly balanced and the designs are like edible works of art. Their fusion of Indian and Western flavors is unique.",
          author: "Ananya Desai",
          role: "Loyal Customer"
        },
        {
          id: "2",
          quote: "I ordered a custom cake for my daughter's wedding and it exceeded all my expectations. The molecular gastronomy techniques they used created amazing textures!",
          author: "Rajesh Malhotra",
          role: "Happy Parent"
        },
        {
          id: "3",
          quote: "Their signature Beaker Cake with cardamom and saffron is the most innovative dessert I've ever tasted. The combination of flavors and textures is pure genius.",
          author: "Kavita Sharma",
          role: "Food Blogger"
        }
      ];

      // Check if we have testimonials in localStorage
      const storedTestimonials = localStorage.getItem('testimonials');
      if (storedTestimonials) {
        setTestimonials(JSON.parse(storedTestimonials));
      } else {
        // If not, use sample data and save to localStorage
        setTestimonials(sampleTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(sampleTestimonials));
      }
    };

    loadTestimonials();
  }, []);

  // Save testimonials to localStorage
  const saveTestimonials = (updatedTestimonials: Testimonial[]) => {
    setTestimonials(updatedTestimonials);
    localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));

    // Dispatch event for other parts of the app
    const event = new CustomEvent('testimonialsUpdated');
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

  // Open add testimonial dialog
  const openAddDialog = () => {
    setFormData({
      id: `testimonial_${Date.now()}`,
      quote: "",
      author: "",
      role: ""
    });
    setIsAddDialogOpen(true);
  };

  // Open edit testimonial dialog
  const openEditDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      id: testimonial.id,
      quote: testimonial.quote,
      author: testimonial.author,
      role: testimonial.role
    });
    setIsEditDialogOpen(true);
  };

  // Open delete testimonial dialog
  const openDeleteDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  // Add new testimonial
  const handleAddTestimonial = () => {
    if (!formData.quote || !formData.author || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newTestimonial: Testimonial = {
      ...formData
    };

    const updatedTestimonials = [...testimonials, newTestimonial];
    saveTestimonials(updatedTestimonials);

    toast({
      title: "Testimonial Added",
      description: `Testimonial from ${newTestimonial.author} has been added successfully.`
    });

    setIsAddDialogOpen(false);
  };

  // Update existing testimonial
  const handleUpdateTestimonial = () => {
    if (!selectedTestimonial) return;

    if (!formData.quote || !formData.author || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedTestimonials = testimonials.map(testimonial =>
      testimonial.id === selectedTestimonial.id ? { ...formData } : testimonial
    );

    saveTestimonials(updatedTestimonials);

    toast({
      title: "Testimonial Updated",
      description: `Testimonial from ${formData.author} has been updated successfully.`
    });

    setIsEditDialogOpen(false);
  };

  // Delete testimonial
  const handleDeleteTestimonial = () => {
    if (!selectedTestimonial) return;

    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== selectedTestimonial.id);
    saveTestimonials(updatedTestimonials);

    toast({
      title: "Testimonial Deleted",
      description: `Testimonial from ${selectedTestimonial.author} has been deleted successfully.`
    });

    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Testimonial Management</h2>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonials found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium">{testimonial.author}</TableCell>
                  <TableCell>{testimonial.role}</TableCell>
                  <TableCell className="max-w-xs truncate">{testimonial.quote}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => openEditDialog(testimonial)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDeleteDialog(testimonial)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Testimonial Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="author">Author Name</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter role (e.g., Loyal Customer)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quote">Testimonial Quote</Label>
              <Textarea
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                placeholder="Enter testimonial quote"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTestimonial}>Add Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-author">Author Name</Label>
              <Input
                id="edit-author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter role (e.g., Loyal Customer)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-quote">Testimonial Quote</Label>
              <Textarea
                id="edit-quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                placeholder="Enter testimonial quote"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTestimonial}>Update Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Testimonial Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Are you sure you want to delete the testimonial from <strong>{selectedTestimonial?.author}</strong>?</p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTestimonial}>Delete Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialManagement;
