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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash, Plus, Image } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

const TeamManagement = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "",
    image: ""
  });

  // Load team members
  useEffect(() => {
    const loadTeamMembers = () => {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleTeamMembers = [
        {
          id: "1",
          name: "Dr. Priya Sharma",
          role: "Founder & Food Scientist",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
        },
        {
          id: "2",
          name: "Arjun Patel",
          role: "Molecular Gastronomy Specialist",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop"
        },
        {
          id: "3",
          name: "Meera Kapoor",
          role: "Cake Design Artist",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
        }
      ];

      // Check if we have team members in localStorage
      const storedTeamMembers = localStorage.getItem('teamMembers');
      if (storedTeamMembers) {
        setTeamMembers(JSON.parse(storedTeamMembers));
      } else {
        // If not, use sample data and save to localStorage
        setTeamMembers(sampleTeamMembers);
        localStorage.setItem('teamMembers', JSON.stringify(sampleTeamMembers));
      }
    };

    loadTeamMembers();
  }, []);

  // Save team members to localStorage
  const saveTeamMembers = (updatedTeamMembers: TeamMember[]) => {
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));

    // Dispatch event for other parts of the app
    const event = new CustomEvent('teamMembersUpdated');
    window.dispatchEvent(event);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open add team member dialog
  const openAddDialog = () => {
    setFormData({
      id: `member_${Date.now()}`,
      name: "",
      role: "",
      image: ""
    });
    setIsAddDialogOpen(true);
  };

  // Open edit team member dialog
  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      id: member.id,
      name: member.name,
      role: member.role,
      image: member.image
    });
    setIsEditDialogOpen(true);
  };

  // Open delete team member dialog
  const openDeleteDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  // Add new team member
  const handleAddTeamMember = () => {
    if (!formData.name || !formData.role || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newTeamMember: TeamMember = {
      ...formData
    };

    const updatedTeamMembers = [...teamMembers, newTeamMember];
    saveTeamMembers(updatedTeamMembers);

    toast({
      title: "Team Member Added",
      description: `${newTeamMember.name} has been added successfully.`
    });

    setIsAddDialogOpen(false);
  };

  // Update existing team member
  const handleUpdateTeamMember = () => {
    if (!selectedMember) return;

    if (!formData.name || !formData.role || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedTeamMembers = teamMembers.map(member =>
      member.id === selectedMember.id ? { ...formData } : member
    );

    saveTeamMembers(updatedTeamMembers);

    toast({
      title: "Team Member Updated",
      description: `${formData.name} has been updated successfully.`
    });

    setIsEditDialogOpen(false);
  };

  // Delete team member
  const handleDeleteTeamMember = () => {
    if (!selectedMember) return;

    const updatedTeamMembers = teamMembers.filter(member => member.id !== selectedMember.id);
    saveTeamMembers(updatedTeamMembers);

    toast({
      title: "Team Member Deleted",
      description: `${selectedMember.name} has been deleted successfully.`
    });

    setIsDeleteDialogOpen(false);
  };

  // Handle image upload (in a real app, this would upload to a server)
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Team Management</h2>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No team members found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-12 w-12 object-cover rounded-full"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => openEditDialog(member)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDeleteDialog(member)}
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

      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter role or position"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Profile Photo</Label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Team Member"
                    className="h-40 w-40 object-cover rounded-full mx-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-1/2 transform translate-x-1/2"
                    onClick={() => document.getElementById('image-upload-team')?.click()}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a profile photo
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image-upload-team')?.click()}
                  >
                    Select Photo
                  </Button>
                </div>
              )}
              <Input
                id="image-upload-team"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTeamMember}>Add Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Input
                id="edit-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter role or position"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image">Profile Photo</Label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Team Member"
                    className="h-40 w-40 object-cover rounded-full mx-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-1/2 transform translate-x-1/2"
                    onClick={() => document.getElementById('edit-image-upload-team')?.click()}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a profile photo
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('edit-image-upload-team')?.click()}
                  >
                    Select Photo
                  </Button>
                </div>
              )}
              <Input
                id="edit-image-upload-team"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTeamMember}>Update Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Member Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedMember?.name}</strong>?</p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTeamMember}>Delete Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
