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
import { Pencil, Trash, Plus, Upload, X, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  image: string;
  videoUrl?: string;
  category: string;
  createdAt: string;
}

const RecipeManagement = () => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'createdAt'>>({
    title: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    prepTime: "",
    cookTime: "",
    servings: 1,
    difficulty: "medium",
    image: "",
    videoUrl: "",
    category: "cake"
  });

  // Load recipes from localStorage
  useEffect(() => {
    const loadRecipes = () => {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleRecipes = [
        {
          id: "1",
          title: "Chocolate Truffle Cake",
          description: "A rich and decadent chocolate cake with a smooth ganache frosting.",
          ingredients: [
            "200g dark chocolate",
            "200g butter",
            "200g sugar",
            "4 eggs",
            "150g all-purpose flour",
            "30g cocoa powder"
          ],
          instructions: [
            "Preheat oven to 180°C.",
            "Melt chocolate and butter together.",
            "Whisk in sugar and eggs.",
            "Fold in flour and cocoa powder.",
            "Bake for 25-30 minutes.",
            "Cool and frost with ganache."
          ],
          prepTime: "20 minutes",
          cookTime: "30 minutes",
          servings: 8,
          difficulty: "medium",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
          category: "cake",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          title: "Vanilla Bean Cupcakes",
          description: "Light and fluffy vanilla cupcakes with a creamy buttercream frosting.",
          ingredients: [
            "150g butter",
            "150g sugar",
            "2 eggs",
            "150g all-purpose flour",
            "1 vanilla bean",
            "2 tsp baking powder"
          ],
          instructions: [
            "Preheat oven to 170°C.",
            "Cream butter and sugar together.",
            "Add eggs one at a time.",
            "Fold in flour and baking powder.",
            "Bake for 18-20 minutes.",
            "Cool and frost with buttercream."
          ],
          prepTime: "15 minutes",
          cookTime: "20 minutes",
          servings: 12,
          difficulty: "easy",
          image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000&auto=format&fit=crop",
          category: "cupcake",
          createdAt: new Date().toISOString()
        }
      ];

      // Check if we have recipes in localStorage
      const storedRecipes = localStorage.getItem('recipes');
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      } else {
        // If not, use sample data and save to localStorage
        setRecipes(sampleRecipes);
        localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
      }
    };

    loadRecipes();
  }, []);

  // Save recipes to localStorage
  const saveRecipes = (updatedRecipes: Recipe[]) => {
    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));

    // Dispatch event for other parts of the app
    const event = new CustomEvent('recipesUpdated');
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

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  // Handle ingredients changes
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  // Add new ingredient field
  const addIngredientField = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  // Remove ingredient field
  const removeIngredientField = (index: number) => {
    if (formData.ingredients.length <= 1) return;

    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  // Handle instructions changes
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData(prev => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  // Add new instruction field
  const addInstructionField = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }));
  };

  // Remove instruction field
  const removeInstructionField = (index: number) => {
    if (formData.instructions.length <= 1) return;

    const updatedInstructions = [...formData.instructions];
    updatedInstructions.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      instructions: updatedInstructions
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

  // Open add recipe dialog
  const openAddDialog = () => {
    setFormData({
      title: "",
      description: "",
      ingredients: [""],
      instructions: [""],
      prepTime: "",
      cookTime: "",
      servings: 1,
      difficulty: "medium",
      image: "",
      videoUrl: "",
      category: "cake"
    });
    setIsAddDialogOpen(true);
  };

  // Open edit recipe dialog
  const openEditDialog = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      image: recipe.image,
      videoUrl: recipe.videoUrl || "",
      category: recipe.category
    });
    setIsEditDialogOpen(true);
  };

  // Open delete recipe dialog
  const openDeleteDialog = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteDialogOpen(true);
  };

  // Add new recipe
  const handleAddRecipe = () => {
    if (!formData.title || !formData.description || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newRecipe: Recipe = {
      ...formData,
      id: `recipe_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updatedRecipes = [...recipes, newRecipe];
    saveRecipes(updatedRecipes);

    toast({
      title: "Recipe Added",
      description: `${newRecipe.title} has been added successfully.`
    });

    setIsAddDialogOpen(false);
  };

  // Update existing recipe
  const handleUpdateRecipe = () => {
    if (!selectedRecipe) return;

    if (!formData.title || !formData.description || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedRecipes = recipes.map(recipe =>
      recipe.id === selectedRecipe.id ? {
        ...formData,
        id: selectedRecipe.id,
        createdAt: selectedRecipe.createdAt
      } : recipe
    );

    saveRecipes(updatedRecipes);

    toast({
      title: "Recipe Updated",
      description: `${formData.title} has been updated successfully.`
    });

    setIsEditDialogOpen(false);
  };

  // Delete recipe
  const handleDeleteRecipe = () => {
    if (!selectedRecipe) return;

    const updatedRecipes = recipes.filter(recipe => recipe.id !== selectedRecipe.id);
    saveRecipes(updatedRecipes);

    toast({
      title: "Recipe Deleted",
      description: `${selectedRecipe.title} has been deleted successfully.`
    });

    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Recipe Management</h2>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recipes found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell className="capitalize">{recipe.category}</TableCell>
                  <TableCell className="capitalize">{recipe.difficulty}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => openEditDialog(recipe)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDeleteDialog(recipe)}
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

      {/* Add Recipe Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Recipe</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter recipe title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cake">Cake</SelectItem>
                    <SelectItem value="cupcake">Cupcake</SelectItem>
                    <SelectItem value="cookie">Cookie</SelectItem>
                    <SelectItem value="bread">Bread</SelectItem>
                    <SelectItem value="pastry">Pastry</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter recipe description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prepTime">Preparation Time</Label>
                <Input
                  id="prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 20 minutes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookTime">Cooking Time</Label>
                <Input
                  id="cookTime"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 minutes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  name="servings"
                  type="number"
                  value={formData.servings}
                  onChange={handleNumberChange}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleSelectChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="Enter YouTube or Vimeo URL"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">Recipe Image</Label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Recipe"
                      className="h-40 w-full object-cover rounded-md"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => document.getElementById('image-upload-recipe')?.click()}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a recipe image
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('image-upload-recipe')?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
                <Input
                  id="image-upload-recipe"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Ingredients</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredientField}
                >
                  Add Ingredient
                </Button>
              </div>

              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIngredientField(index)}
                    disabled={formData.ingredients.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Instructions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInstructionField}
                >
                  Add Step
                </Button>
              </div>

              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeInstructionField(index)}
                    disabled={formData.instructions.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRecipe}>Add Recipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Recipe Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Recipe Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter recipe title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cake">Cake</SelectItem>
                    <SelectItem value="cupcake">Cupcake</SelectItem>
                    <SelectItem value="cookie">Cookie</SelectItem>
                    <SelectItem value="bread">Bread</SelectItem>
                    <SelectItem value="pastry">Pastry</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter recipe description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-prepTime">Preparation Time</Label>
                <Input
                  id="edit-prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 20 minutes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cookTime">Cooking Time</Label>
                <Input
                  id="edit-cookTime"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 minutes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-servings">Servings</Label>
                <Input
                  id="edit-servings"
                  name="servings"
                  type="number"
                  value={formData.servings}
                  onChange={handleNumberChange}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleSelectChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-videoUrl">Video URL (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="Enter YouTube or Vimeo URL"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-image">Recipe Image</Label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Recipe"
                      className="h-40 w-full object-cover rounded-md"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => document.getElementById('edit-image-upload-recipe')?.click()}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a recipe image
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('edit-image-upload-recipe')?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
                <Input
                  id="edit-image-upload-recipe"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Ingredients</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredientField}
                >
                  Add Ingredient
                </Button>
              </div>

              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIngredientField(index)}
                    disabled={formData.ingredients.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Instructions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInstructionField}
                >
                  Add Step
                </Button>
              </div>

              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeInstructionField(index)}
                    disabled={formData.instructions.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateRecipe}>Update Recipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Recipe Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedRecipe?.title}</strong>?</p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRecipe}>Delete Recipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeManagement;
