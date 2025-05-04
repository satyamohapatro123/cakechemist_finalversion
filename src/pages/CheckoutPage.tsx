
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your complete address." }),
  city: z.string().min(2, { message: "Please enter your city." }),
  state: z.string().min(2, { message: "Please enter your state." }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code." }),
  paymentMethod: z.enum(["razorpay", "phonepay", "googlepay"], {
    required_error: "Please select a payment method",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "razorpay",
    },
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Load cart items from localStorage
  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const tax = subtotal * 0.18; // 18% GST in India
  const total = subtotal + tax;
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Show payment dialog
    setIsPaymentDialogOpen(true);
    
    // Generate a unique order ID
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    setOrderId(`ORDER-${uniqueId}`);
    
    // Process payment based on selected method
    switch (data.paymentMethod) {
      case "razorpay":
        initializeRazorpay(data, total, uniqueId);
        break;
      case "phonepay":
        initializePhonePe(data, total, uniqueId);
        break;
      case "googlepay":
        initializeGooglePay(data, total, uniqueId);
        break;
      default:
        initializeRazorpay(data, total, uniqueId);
    }
  };
  
  const initializeRazorpay = (customerData: FormValues, amount: number, orderIdRef: string) => {
    // In a real implementation, you would make an API call to your backend to create an order
    // The backend would use Razorpay's API to create the order and return the order ID
    // For this demonstration, we'll simulate the order creation

    // Razorpay checkout options
    const options = {
      key: "rzp_test_XXXXXXXXXXXXXXX", // Replace with your actual Razorpay key
      amount: amount * 100, // Razorpay amount is in paise
      currency: "INR",
      name: "Bakery Name",
      description: "Payment for your bakery order",
      order_id: orderIdRef, // This would come from your backend in a real implementation
      handler: function(response: any) {
        handlePaymentSuccess(response, customerData, orderIdRef, "razorpay");
      },
      prefill: {
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone
      },
      notes: {
        address: customerData.address
      },
      theme: {
        color: "#9f7060"
      }
    };
    
    // Initialize Razorpay
    try {
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      setIsPaymentDialogOpen(false);
    } catch (error) {
      console.error("Razorpay Error:", error);
      // For demo purposes, we'll simulate a successful payment after a delay
      setTimeout(() => {
        handlePaymentSuccess({ razorpay_payment_id: "pay_" + Math.random().toString(36).substring(2) }, customerData, orderIdRef, "razorpay");
      }, 2000);
    }
  };
  
  const initializePhonePe = (customerData: FormValues, amount: number, orderIdRef: string) => {
    // In a real implementation, you would make an API call to your backend
    // The backend would use PhonePe's API to create a payment link and return it
    // For this demonstration, we'll simulate the process
    
    console.log("PhonePe payment initiated", { customerData, amount, orderIdRef });
    
    // Simulate PhonePe API call and redirect
    // In a real implementation, you would redirect to PhonePe's payment page
    setTimeout(() => {
      handlePaymentSuccess(
        { phonepay_payment_id: "ppay_" + Math.random().toString(36).substring(2) }, 
        customerData, 
        orderIdRef,
        "phonepay"
      );
    }, 2000);
  };
  
  const initializeGooglePay = (customerData: FormValues, amount: number, orderIdRef: string) => {
    // In a real implementation, you would integrate Google Pay using their SDK
    // For this demonstration, we'll simulate the process
    
    console.log("Google Pay payment initiated", { customerData, amount, orderIdRef });
    
    // Simulate Google Pay API call
    // In a real implementation, you would use Google Pay's API
    setTimeout(() => {
      handlePaymentSuccess(
        { googlepay_payment_id: "gpay_" + Math.random().toString(36).substring(2) }, 
        customerData, 
        orderIdRef,
        "googlepay"
      );
    }, 2000);
  };
  
  const handlePaymentSuccess = (response: any, customerData: FormValues, orderIdRef: string, paymentMethod: string) => {
    // Create the order object with all details
    const orderDetails = {
      id: orderIdRef,
      customer: customerData,
      items: cartItems,
      subtotal,
      tax,
      total,
      status: "pending",
      paymentId: response.razorpay_payment_id || response.phonepay_payment_id || response.googlepay_payment_id,
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString()
    };
    
    // Store the order in localStorage (in a real app, this would go to a database)
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear the cart
    localStorage.setItem('cartItems', JSON.stringify([]));
    
    // Trigger cart update event
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
    
    // Show success toast
    toast({
      title: "Payment successful!",
      description: `Your order ${orderIdRef} has been placed successfully.`,
    });
    
    // Close the dialog
    setIsPaymentDialogOpen(false);
    
    // Navigate to order confirmation page
    navigate('/order-confirmation', { state: { orderId: orderIdRef } });
  };

  return (
    <main>
      {/* Checkout Banner */}
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="Checkout"
            subtitle="Complete your order with a few simple steps"
            center
          />
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Details Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-md shadow-sm border border-border">
                <h2 className="text-xl font-serif mb-6">Shipping Details</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Your 10-digit phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Your state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PIN Code</FormLabel>
                            <FormControl>
                              <Input placeholder="6-digit PIN code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Payment Methods */}
                    <div className="mt-6">
                      <h3 className="text-lg font-serif mb-4">Select Payment Method</h3>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="razorpay" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex items-center">
                                    <img src="https://cdn.razorpay.com/static/assets/logo/payment-method.svg" 
                                         alt="Razorpay" 
                                         className="h-6 mr-2" />
                                    Razorpay
                                  </FormLabel>
                                </FormItem>
                                
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="phonepay" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex items-center">
                                    <span className="text-purple-600 font-bold mr-1">Phone</span>
                                    <span className="text-blue-600 font-bold">Pe</span>
                                  </FormLabel>
                                </FormItem>
                                
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="googlepay" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    <span className="text-blue-600 font-medium">G</span>
                                    <span className="text-red-500 font-medium">o</span>
                                    <span className="text-yellow-500 font-medium">o</span>
                                    <span className="text-blue-600 font-medium">g</span>
                                    <span className="text-green-500 font-medium">l</span>
                                    <span className="text-red-500 font-medium">e</span>
                                    <span className="ml-1 text-gray-600">Pay</span>
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <Button type="submit" className="w-full md:w-auto" disabled={cartItems.length === 0}>
                        Proceed to Payment
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-secondary p-6 rounded-md">
                <h2 className="text-xl font-serif mb-4">Order Summary</h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity} x {item.name}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 text-sm border-t border-border pt-4 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between font-medium text-lg border-t border-border pt-4">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Processing Payment</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bakery-700 mx-auto"></div>
            <p className="mt-4">Please do not close this window while we process your payment...</p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CheckoutPage;
