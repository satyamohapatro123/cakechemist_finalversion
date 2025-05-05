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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash, Plus, Image, Tag, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateOrdersWithProduct, removeProductFromOrders, initializeOrders } from "@/services/ProductOrderService";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
}

const ProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "bread", name: "Bread" },
    { id: "pastry", name: "Pastries" },
    { id: "cake", name: "Cakes" },
    { id: "dessert", name: "Desserts" },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: 0,
    image: "",
    category: "",
    categoryId: "",
    description: ""
  });
  const [categoryFormData, setCategoryFormData] = useState({
    id: "",
    name: ""
  });
  const [newCategoryName, setNewCategoryName] = useState("");

  // Load categories from localStorage
  useEffect(() => {
    const loadCategories = () => {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // If no categories in localStorage, save the default ones
        localStorage.setItem('categories', JSON.stringify(categories));
      }
    };

    loadCategories();
  }, []);

  // Save categories to localStorage
  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));

    // Dispatch event for other parts of the app
    const event = new CustomEvent('categoriesUpdated');
    window.dispatchEvent(event);
  };

  // Load products
  useEffect(() => {
    const loadProducts = () => {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleProducts = [
        {
          id: "1",
          name: "Classic Croissant",
          price: 199.50,
          image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
          category: "Pastry",
          categoryId: "pastry",
          description: "A buttery, flaky pastry named for its historical crescent shape."
        },
        {
          id: "2",
          name: "Chocolate Cake",
          price: 1299.00,
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
          category: "Cakes",
          categoryId: "cake",
          description: "Rich, moist chocolate cake with smooth chocolate ganache and chocolate shavings."
        },
        {
          id: "3",
          name: "Sourdough Bread",
          price: 299.00,
          image: "https://images.unsplash.com/photo-1585478259715-4d3f99e36561?q=80&w=1000&auto=format&fit=crop",
          category: "Bread",
          categoryId: "bread",
          description: "Artisan bread made with a fermented dough starter, giving it a slightly sour taste."
        },
        {
          id: "4",
          name: "Fruit Tart",
          price: 249.50,
          image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
          category: "Desserts",
          categoryId: "dessert",
          description: "Buttery pastry crust filled with vanilla custard and topped with fresh seasonal fruits."
        },
        {
          id: "5",
          name: "Baguette",
          price: 169.00,
          image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop",
          category: "Bread",
          categoryId: "bread",
          description: "Traditional French bread known for its long, thin shape and crispy crust."
        },
        {
          id: "6",
          name: "Cinnamon Roll",
          price: 189.00,
          image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1000&auto=format&fit=crop",
          category: "Pastry",
          categoryId: "pastry",
          description: "Sweet roll with a cinnamon-sugar filling and topped with cream cheese frosting."
        },
        {
          id: "7",
          name: "Red Velvet Cake",
          price: 1499.00,
          image: "https://images.unsplash.com/photo-1586788680434-30d324626f4c?q=80&w=1000&auto=format&fit=crop",
          category: "Cakes",
          categoryId: "cake",
          description: "Distinctive red-colored cake with a subtle chocolate flavor and cream cheese frosting."
        },
        {
          id: "8",
          name: "Cheesecake",
          price: 279.00,
          image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
          category: "Desserts",
          categoryId: "dessert",
          description: "Creamy dessert with a graham cracker crust, topped with fresh berries."
        }
      ];

      // Check if we have products in localStorage
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // If not, use sample data and save to localStorage
        setProducts(sampleProducts);
        localStorage.setItem('products', JSON.stringify(sampleProducts));
      }
    };

    loadProducts();
  }, []);

  // Save products to localStorage
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Initialize orders if they don't exist
    initializeOrders(updatedProducts);

    // Dispatch event for other parts of the app
    const event = new CustomEvent('productsUpdated');
    window.dispatchEvent(event);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    const category = categories.find(cat => cat.id === value);
    setFormData(prev => ({
      ...prev,
      categoryId: value,
      category: category ? category.name : ''
    }));
  };

  // Open add product dialog
  const openAddDialog = () => {
    setFormData({
      id: `product_${Date.now()}`,
      name: "",
      price: 0,
      image: "",
      category: "",
      categoryId: "",
      description: ""
    });
    setIsAddDialogOpen(true);
  };

  // Open edit product dialog
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      categoryId: product.categoryId,
      description: product.description || ""
    });
    setIsEditDialogOpen(true);
  };

  // Open delete product dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);

    // Check if product is in any orders
    const ordersJson = localStorage.getItem('orders');
    let hasOrdersWithProduct = false;

    if (ordersJson) {
      const orders = JSON.parse(ordersJson);
      hasOrdersWithProduct = orders.some(order =>
        order.items.some(item => item.productId === product.id)
      );
    }

    // Set a flag on the selected product to indicate if it's in orders
    setSelectedProduct({
      ...product,
      // @ts-ignore - Adding a custom property
      isInOrders: hasOrdersWithProduct
    });

    setIsDeleteDialogOpen(true);
  };

  // Add new product
  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.image || !formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      ...formData
    };

    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);

    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added successfully.`
    });

    setIsAddDialogOpen(false);
  };

  // Update existing product
  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    if (!formData.name || !formData.price || !formData.image || !formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedProduct = { ...formData };
    const updatedProducts = products.map(product =>
      product.id === selectedProduct.id ? updatedProduct : product
    );

    // Save products to localStorage
    saveProducts(updatedProducts);

    // Update orders with the updated product
    updateOrdersWithProduct(updatedProduct);

    toast({
      title: "Product Updated",
      description: `${formData.name} has been updated successfully.`
    });

    setIsEditDialogOpen(false);
  };

  // Delete product
  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    // Check if product is in any orders
    const ordersJson = localStorage.getItem('orders');
    let hasOrdersWithProduct = false;

    if (ordersJson) {
      const orders = JSON.parse(ordersJson);
      hasOrdersWithProduct = orders.some(order =>
        order.items.some(item => item.productId === selectedProduct.id)
      );
    }

    // Remove product from products list
    const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
    saveProducts(updatedProducts);

    // Remove product from orders
    if (hasOrdersWithProduct) {
      removeProductFromOrders(selectedProduct.id);

      toast({
        title: "Product Deleted",
        description: `${selectedProduct.name} has been deleted and removed from existing orders.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Product Deleted",
        description: `${selectedProduct.name} has been deleted successfully.`
      });
    }

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

  // Open category management dialog
  const openCategoryDialog = () => {
    setCategoryFormData({
      id: "",
      name: ""
    });
    setNewCategoryName("");
    setIsCategoryDialogOpen(true);
  };

  // Handle category name input change
  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    // Generate a slug-like ID from the name
    const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');

    // Check if category with this ID already exists
    if (categories.some(cat => cat.id === categoryId)) {
      toast({
        title: "Validation Error",
        description: "A category with this name already exists.",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: categoryId,
      name: newCategoryName
    };

    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);

    toast({
      title: "Category Added",
      description: `${newCategory.name} has been added successfully.`
    });

    setNewCategoryName("");
  };

  // Delete category
  const handleDeleteCategory = (categoryId: string) => {
    // Check if any products are using this category
    const productsUsingCategory = products.filter(product => product.categoryId === categoryId);

    if (productsUsingCategory.length > 0) {
      toast({
        title: "Cannot Delete Category",
        description: `This category is being used by ${productsUsingCategory.length} product(s). Please reassign these products first.`,
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = categories.filter(category => category.id !== categoryId);
    saveCategories(updatedCategories);

    toast({
      title: "Category Deleted",
      description: "Category has been deleted successfully."
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Product Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={openCategoryDialog}>
            <Tag className="h-4 w-4 mr-2" />
            Manage Categories
          </Button>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDeleteDialog(product)}
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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Product Image</Label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Product"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a product image
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price (₹)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image">Product Image</Label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Product"
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => document.getElementById('edit-image-upload')?.click()}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a product image
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('edit-image-upload')?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
              <Input
                id="edit-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            {/* @ts-ignore - Using custom property */}
            {selectedProduct?.isInOrders && (
              <DialogDescription className="text-amber-600">
                This product is used in existing orders
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?</p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>

            {/* @ts-ignore - Using custom property */}
            {selectedProduct?.isInOrders && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 font-medium">Warning: Product in use</p>
                  <p className="text-amber-700 text-sm mt-1">
                    This product is currently used in one or more orders. If you delete it,
                    it will be removed from those orders, which may affect order totals and reporting.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="New category name"
                value={newCategoryName}
                onChange={handleCategoryNameChange}
              />
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Current Categories</Label>
              <div className="border rounded-md p-4 space-y-2">
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No categories found</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge key={category.id} variant="outline" className="flex items-center gap-1 px-3 py-1">
                        {category.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Categories that are in use by products cannot be deleted.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsCategoryDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
