import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Coupon, CouponUsage } from "@/models/Coupon";
import { CalendarIcon, Plus, Trash, Edit, Copy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const CouponManagement = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponUsages, setCouponUsages] = useState<CouponUsage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 500,
    maxDiscount: 200,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    maxUsage: 100,
    maxUsagePerUser: 1,
    isActive: true,
    categories: [],
    products: []
  });

  // Load coupons from localStorage
  useEffect(() => {
    const storedCoupons = localStorage.getItem("coupons");
    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons));
    }

    const storedUsages = localStorage.getItem("couponUsages");
    if (storedUsages) {
      setCouponUsages(JSON.parse(storedUsages));
    }
  }, []);

  // Save coupons to localStorage
  const saveCoupons = (updatedCoupons: Coupon[]) => {
    localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
    setCoupons(updatedCoupons);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setNewCoupon({ ...newCoupon, [name]: parseFloat(value) });
    } else {
      setNewCoupon({ ...newCoupon, [name]: value });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewCoupon({ ...newCoupon, [name]: value });
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setNewCoupon({ ...newCoupon, [name]: checked });
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setNewCoupon({ ...newCoupon, [name]: date.toISOString() });
    }
  };

  // Add or update coupon
  const handleSaveCoupon = () => {
    if (!newCoupon.code || !newCoupon.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate dates
    const startDate = new Date(newCoupon.startDate || "");
    const endDate = new Date(newCoupon.endDate || "");
    
    if (endDate <= startDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && selectedCoupon) {
      // Update existing coupon
      const updatedCoupons = coupons.map(coupon => 
        coupon.id === selectedCoupon.id 
          ? { ...selectedCoupon, ...newCoupon, updatedAt: new Date().toISOString() } 
          : coupon
      );
      
      saveCoupons(updatedCoupons);
      toast({
        title: "Coupon Updated",
        description: `Coupon ${newCoupon.code} has been updated.`
      });
    } else {
      // Add new coupon
      const newCouponWithId: Coupon = {
        id: `coupon_${Date.now()}`,
        code: newCoupon.code || "",
        description: newCoupon.description || "",
        discountType: newCoupon.discountType as 'percentage' | 'fixed',
        discountValue: newCoupon.discountValue || 0,
        minOrderValue: newCoupon.minOrderValue || 0,
        maxDiscount: newCoupon.maxDiscount,
        startDate: newCoupon.startDate || new Date().toISOString(),
        endDate: newCoupon.endDate || new Date().toISOString(),
        maxUsage: newCoupon.maxUsage || 0,
        maxUsagePerUser: newCoupon.maxUsagePerUser || 0,
        isActive: newCoupon.isActive || false,
        categories: newCoupon.categories || [],
        products: newCoupon.products || [],
        createdAt: new Date().toISOString()
      };
      
      saveCoupons([...coupons, newCouponWithId]);
      toast({
        title: "Coupon Created",
        description: `Coupon ${newCoupon.code} has been created.`
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  // Edit coupon
  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setNewCoupon(coupon);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Delete coupon
  const handleDeleteCoupon = (couponId: string) => {
    const updatedCoupons = coupons.filter(coupon => coupon.id !== couponId);
    saveCoupons(updatedCoupons);
    
    toast({
      title: "Coupon Deleted",
      description: "The coupon has been deleted."
    });
  };

  // Toggle coupon active status
  const handleToggleActive = (coupon: Coupon) => {
    const updatedCoupons = coupons.map(c => 
      c.id === coupon.id 
        ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } 
        : c
    );
    
    saveCoupons(updatedCoupons);
    
    toast({
      title: coupon.isActive ? "Coupon Deactivated" : "Coupon Activated",
      description: `Coupon ${coupon.code} has been ${coupon.isActive ? "deactivated" : "activated"}.`
    });
  };

  // Copy coupon code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    
    toast({
      title: "Copied to Clipboard",
      description: `Coupon code ${code} has been copied to clipboard.`
    });
  };

  // Reset form
  const resetForm = () => {
    setNewCoupon({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 500,
      maxDiscount: 200,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      maxUsage: 100,
      maxUsagePerUser: 1,
      isActive: true,
      categories: [],
      products: []
    });
    setSelectedCoupon(null);
    setIsEditMode(false);
  };

  // Get usage count for a coupon
  const getCouponUsageCount = (couponId: string) => {
    return couponUsages.filter(usage => usage.couponId === couponId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No coupons found</p>
              <Button onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Coupon
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Active Coupons</CardTitle>
            <CardDescription>
              Manage your discount coupons and track their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map(coupon => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{coupon.code}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleCopyCode(coupon.code)}
                            className="h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{coupon.description}</TableCell>
                      <TableCell>
                        {coupon.discountType === "percentage" 
                          ? `${coupon.discountValue}%${coupon.maxDiscount ? ` (up to ₹${coupon.maxDiscount})` : ""}` 
                          : `₹${coupon.discountValue}`
                        }
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>From: {new Date(coupon.startDate).toLocaleDateString()}</div>
                          <div>To: {new Date(coupon.endDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{getCouponUsageCount(coupon.id)} / {coupon.maxUsage}</div>
                          <div className="text-muted-foreground">Max per user: {coupon.maxUsagePerUser}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={coupon.isActive ? "default" : "secondary"}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleToggleActive(coupon)}
                          >
                            <Switch checked={coupon.isActive} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditCoupon(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update the details of your existing coupon" 
                : "Create a new discount coupon for your customers"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleInputChange}
                  placeholder="WELCOME10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={newCoupon.isActive}
                    onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {newCoupon.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newCoupon.description}
                onChange={handleInputChange}
                placeholder="10% off on your first order"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={newCoupon.discountType}
                  onValueChange={(value) => handleSelectChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  {newCoupon.discountType === "percentage" ? "Discount %" : "Discount Amount (₹)"}
                </Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Minimum Order Value (₹)</Label>
                <Input
                  id="minOrderValue"
                  name="minOrderValue"
                  type="number"
                  value={newCoupon.minOrderValue}
                  onChange={handleInputChange}
                />
              </div>
              
              {newCoupon.discountType === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Maximum Discount (₹)</Label>
                  <Input
                    id="maxDiscount"
                    name="maxDiscount"
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCoupon.startDate ? (
                        format(new Date(newCoupon.startDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newCoupon.startDate ? new Date(newCoupon.startDate) : undefined}
                      onSelect={(date) => handleDateChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCoupon.endDate ? (
                        format(new Date(newCoupon.endDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newCoupon.endDate ? new Date(newCoupon.endDate) : undefined}
                      onSelect={(date) => handleDateChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUsage">Maximum Total Usage</Label>
                <Input
                  id="maxUsage"
                  name="maxUsage"
                  type="number"
                  value={newCoupon.maxUsage}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxUsagePerUser">Maximum Usage Per User</Label>
                <Input
                  id="maxUsagePerUser"
                  name="maxUsagePerUser"
                  type="number"
                  value={newCoupon.maxUsagePerUser}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCoupon}>
              {isEditMode ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponManagement;
