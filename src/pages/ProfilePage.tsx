import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  customization?: any;
}

interface Order {
  id: string;
  customer: any;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentId: string;
  createdAt: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Load orders from localStorage
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        const allOrders = JSON.parse(storedOrders);
        // Filter orders for current user
        const userOrders = allOrders.filter((order: Order) => 
          order.customer.email === user.email
        );
        setOrders(userOrders);
      }
    };
    
    loadOrders();
  }, [user, navigate]);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <main>
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="My Account"
            subtitle="Manage your profile and view your orders"
            center
          />
        </div>
      </section>
      
      <section className="py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-medium">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <Button variant="outline" className="w-full mb-2" onClick={() => navigate("/profile/edit")}>
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full text-destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="orders">
                <TabsList className="mb-6">
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders">
                  <div className="bg-card rounded-lg border border-border">
                    <div className="p-6 border-b border-border">
                      <h3 className="text-lg font-medium">Your Orders</h3>
                    </div>
                    
                    {orders.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                        <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {orders.map((order) => (
                          <div key={order.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                  order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center">
                                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-4 flex-grow">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.quantity} × ₹{item.price.toFixed(2)}
                                    </p>
                                    {item.customization && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {item.customization.isEggless && <span>Eggless • </span>}
                                        {item.customization.nameOnCake && <span>Custom text • </span>}
                                        {item.customization.imageOnCake && <span>Custom image</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between border-t border-border pt-4">
                              <span>Total</span>
                              <span className="font-medium">₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="addresses">
                  <div className="bg-card rounded-lg border border-border p-6 text-center">
                    <p className="text-muted-foreground mb-4">You haven't added any addresses yet.</p>
                    <Button>Add New Address</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites">
                  <div className="bg-card rounded-lg border border-border p-6 text-center">
                    <p className="text-muted-foreground mb-4">You haven't added any favorites yet.</p>
                    <Button onClick={() => navigate("/shop")}>Browse Products</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
