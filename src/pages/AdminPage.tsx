
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SectionHeading } from "@/components/ui/section-heading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProductManagement from "@/components/admin/ProductManagement";
import TeamManagement from "@/components/admin/TeamManagement";
import TestimonialManagement from "@/components/admin/TestimonialManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import RecipeManagement from "@/components/admin/RecipeManagement";
import GalleryManagement from "@/components/admin/GalleryManagement";
import PricingManagement from "@/components/admin/PricingManagement";
import FinancialDashboard from "@/components/admin/FinancialDashboard";
import CouponManagement from "@/components/admin/CouponManagement";
import AboutPageManagement from "@/components/admin/AboutPageManagement";

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentId: string;
  createdAt: string;
  rejectionReason?: string;
  notes?: string;
  updatedAt?: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orderNotes, setOrderNotes] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  // Check if user is admin - strict access control
  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive"
      });
      navigate('/login?redirect=admin');
      return;
    }

    // If user is not an admin, redirect to home
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "This area is restricted to administrators only.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    // Log admin access for security purposes
    console.log(`Admin panel accessed by: ${currentUser.email} at ${new Date().toLocaleString()}`);

    // In a real app, you would log this access to a secure server
  }, [currentUser, isAdmin, navigate, toast]);

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      console.log("AdminPage: Loading orders from localStorage");
      const storedOrders = localStorage.getItem('orders');
      console.log("AdminPage: storedOrders exists:", !!storedOrders);

      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          console.log("AdminPage: Number of orders:", parsedOrders.length);
          console.log("AdminPage: First order:", parsedOrders[0]);
          setOrders(parsedOrders);
        } catch (e) {
          console.error("AdminPage: Error parsing orders:", e);
        }
      }
    };

    loadOrders();
    // Listen for order updates
    window.addEventListener('ordersUpdated', loadOrders);

    return () => {
      window.removeEventListener('ordersUpdated', loadOrders);
    };
  }, []);

  // Filter orders based on selected status
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  // Debug logging for filtered orders
  console.log("AdminPage: Orders state:", orders.length);
  console.log("AdminPage: Filtered orders:", filteredOrders.length);

  // Order actions
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderNotes(order.notes || "");
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    saveOrders(updatedOrders);
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    });
  };

  const handleRejectOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsRejectOpen(true);
  };

  const confirmReject = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: "rejected",
          rejectionReason,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    saveOrders(updatedOrders);
    setIsRejectOpen(false);
    toast({
      title: "Order Rejected",
      description: `Order ${selectedOrder.id} has been rejected.`,
    });
  };

  const handleSaveNotes = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          notes: orderNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    saveOrders(updatedOrders);
    toast({
      title: "Notes Saved",
      description: "Order notes have been updated successfully.",
    });
  };

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Dispatch event for other parts of the app
    const event = new CustomEvent('ordersUpdated');
    window.dispatchEvent(event);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative py-10 bg-red-50 border-b-4 border-red-500">
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white py-1 text-center text-sm font-medium">
          ADMIN MODE - Restricted Access
        </div>
        <div className="container-custom pt-4">
          <SectionHeading
            title="Admin Panel"
            subtitle="Manage your products, orders, team, and testimonials"
            center
          />
          {currentUser && (
            <div className="mt-4 text-center">
              <p className="text-red-700 mb-2">
                Welcome, <span className="font-medium">{currentUser.name}</span>! You are logged in as an administrator.
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  View Website
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    toast({
                      title: "Logged out",
                      description: "You have been successfully logged out."
                    });
                    navigate('/login');
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-8">
        <div className="container-custom">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-11 w-full">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif">Order Management</h2>

                  <Menubar className="border-none">
                    <MenubarMenu>
                      <MenubarTrigger className="font-medium">
                        Status: {statusFilter === 'all' ? 'All Orders' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem onClick={() => setStatusFilter('all')}>All Orders</MenubarItem>
                        <MenubarItem onClick={() => setStatusFilter('pending')}>Pending</MenubarItem>
                        <MenubarItem onClick={() => setStatusFilter('accepted')}>Accepted</MenubarItem>
                        <MenubarItem onClick={() => setStatusFilter('completed')}>Completed</MenubarItem>
                        <MenubarItem onClick={() => setStatusFilter('rejected')}>Rejected</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                            <TableCell>{order.customer.name}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>₹{order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewDetails(order)}>
                                View
                              </Button>

                              {order.status === 'pending' && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => handleUpdateStatus(order.id, 'accepted')}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRejectOrder(order)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}

                              {order.status === 'accepted' && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(order.id, 'completed')}
                                >
                                  Complete
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="products">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="recipes">
              <RecipeManagement />
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryManagement />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingManagement />
            </TabsContent>

            <TabsContent value="coupons">
              <CouponManagement />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialDashboard />
            </TabsContent>

            <TabsContent value="team">
              <TeamManagement />
            </TabsContent>

            <TabsContent value="testimonials">
              <TestimonialManagement />
            </TabsContent>

            <TabsContent value="contact">
              <ContactManagement />
            </TabsContent>

            <TabsContent value="about">
              <AboutPageManagement />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="mt-4">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Order Information</h3>
                  <p className="text-sm">Order ID: {selectedOrder.id}</p>
                  <p className="text-sm mt-1">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="text-sm mt-1">
                    Status:
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      selectedOrder.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </p>

                  {selectedOrder.rejectionReason && (
                    <div className="mt-1 text-sm text-red-600">
                      <p className="font-medium">Reason for rejection:</p>
                      <p>{selectedOrder.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Customer Information</h3>
                  <p className="text-sm">{selectedOrder.customer.name}</p>
                  <p className="text-sm mt-1">{selectedOrder.customer.email}</p>
                  <p className="text-sm mt-1">{selectedOrder.customer.phone}</p>
                  <p className="text-sm mt-1">
                    {selectedOrder.customer.address}, {selectedOrder.customer.city},
                    <br />{selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-4">
                  <div className="w-64">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>GST (18%):</span>
                      <span>₹{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-border pt-2 mt-2">
                      <span>Total:</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Order Notes</h3>
                <div className="flex gap-4">
                  <Input
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add notes about this order..."
                    className="flex-1"
                  />
                  <Button onClick={handleSaveNotes}>Save Notes</Button>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center mt-4">
                <div>
                  {selectedOrder.updatedAt && (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(selectedOrder.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button
                        variant="default"
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, 'accepted');
                          setIsDetailsOpen(false);
                        }}
                      >
                        Accept Order
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsDetailsOpen(false);
                          handleRejectOrder(selectedOrder);
                        }}
                      >
                        Reject Order
                      </Button>
                    </>
                  )}

                  {selectedOrder.status === 'accepted' && (
                    <Button
                      variant="default"
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, 'completed');
                        setIsDetailsOpen(false);
                      }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Order</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4">Please provide a reason for rejecting this order:</p>
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection"
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!rejectionReason.trim()}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminPage;
