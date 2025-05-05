
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
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, Tag, MapPin, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getCurrentLocation,
  getDefaultStoreLocation,
  calculateDistance,
  calculateDeliveryCharge,
  Coordinates
} from "@/services/GeolocationService";

// Define form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your complete address." }),
  city: z.string().min(2, { message: "Please enter your city." }),
  state: z.string().min(2, { message: "Please enter your state." }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code." }),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  gstNumber: z.string().optional(),
  paymentMethod: z.enum(["razorpay", "phonepay", "googlepay"], {
    required_error: "Please select a payment method",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Define interfaces for pricing configuration
interface AdditionalCharge {
  id: string;
  name: string;
  type: "fixed" | "percentage";
  value: number;
  isActive: boolean;
}

interface DeliveryZone {
  id: string;
  name: string;
  radiusKm: number;
  charge: number;
  isFree: boolean;
  minOrderForFree: number;
}

interface Coupon {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  expiryDate: string;
  isActive: boolean;
}

interface PricingConfig {
  dietaryOptions: any[];
  additionalCharges: AdditionalCharge[];
  deliveryZones: DeliveryZone[];
  coupons: Coupon[];
}

const CheckoutPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);

  // Location-based delivery states
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [storeLocation, setStoreLocation] = useState(getDefaultStoreLocation());
  const [distance, setDistance] = useState<number | null>(null);
  const [deliverySettings, setDeliverySettings] = useState({
    baseDeliveryCharge: 50,
    freeDeliveryThreshold: 1000,
    maxDeliveryDistance: 15,
    chargePerKm: 10,
    enableLocationBasedDelivery: true
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

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
      notes: "",
      couponCode: "",
      gstNumber: "",
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

  // Load cart items, pricing configuration, and detect location
  useEffect(() => {
    // Load cart items
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }

    // Load pricing configuration
    const storedConfig = localStorage.getItem('pricingConfig');
    if (storedConfig) {
      setPricingConfig(JSON.parse(storedConfig));
    }

    // Load delivery settings
    const storedDeliverySettings = localStorage.getItem('deliverySettings');
    if (storedDeliverySettings) {
      setDeliverySettings(JSON.parse(storedDeliverySettings));
    }

    // Load store location
    const storedLocation = localStorage.getItem('storeLocation');
    if (storedLocation) {
      setStoreLocation(JSON.parse(storedLocation));
    }

    // Detect user location
    detectUserLocation();

    // Listen for store location updates
    const handleStoreLocationUpdated = () => {
      const updatedLocation = localStorage.getItem('storeLocation');
      if (updatedLocation) {
        setStoreLocation(JSON.parse(updatedLocation));
        // Recalculate distance if user location is available
        if (userLocation) {
          const storeCoords = JSON.parse(updatedLocation).coordinates;
          const newDistance = calculateDistance(userLocation, storeCoords);
          setDistance(newDistance);
        }
      }
    };

    window.addEventListener('storeLocationUpdated', handleStoreLocationUpdated);

    return () => {
      window.removeEventListener('storeLocationUpdated', handleStoreLocationUpdated);
    };
  }, [userLocation]);

  // Function to detect user location
  const detectUserLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError("");

    try {
      const result = await getCurrentLocation();

      if (result.success && result.coordinates) {
        setUserLocation(result.coordinates);

        // Calculate distance from store
        const newDistance = calculateDistance(result.coordinates, storeLocation.coordinates);
        setDistance(newDistance);

        toast({
          title: "Location Detected",
          description: `Your location is approximately ${newDistance} km from our store.`
        });
      } else {
        setLocationError(result.error || "Could not detect your location");
        toast({
          title: "Location Error",
          description: result.error || "Could not detect your location",
          variant: "destructive"
        });
      }
    } catch (error) {
      setLocationError("An unexpected error occurred");
      toast({
        title: "Location Error",
        description: "An unexpected error occurred while detecting your location",
        variant: "destructive"
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Get GST charge
  const getGstCharge = () => {
    if (!pricingConfig) return subtotal * 0.18; // Default 18% GST

    const gstCharge = pricingConfig.additionalCharges.find(
      charge => charge.id === 'gst' && charge.isActive
    );

    if (!gstCharge) return subtotal * 0.18;

    if (gstCharge.type === 'percentage') {
      return (subtotal * gstCharge.value) / 100;
    } else {
      return gstCharge.value;
    }
  };

  // Get packaging fee
  const getPackagingFee = () => {
    if (!pricingConfig) return 0;

    const packagingCharge = pricingConfig.additionalCharges.find(
      charge => charge.id === 'packagingFee' && charge.isActive
    );

    if (!packagingCharge) return 0;

    if (packagingCharge.type === 'percentage') {
      return (subtotal * packagingCharge.value) / 100;
    } else {
      return packagingCharge.value;
    }
  };

  // Get delivery charge based on location
  const getDeliveryCharge = () => {
    // If location-based delivery is not enabled, use base charge
    if (!deliverySettings.enableLocationBasedDelivery) {
      // Check if free delivery applies based on order value
      if (subtotal >= deliverySettings.freeDeliveryThreshold) {
        return 0;
      }
      return deliverySettings.baseDeliveryCharge;
    }

    // If we don't have distance information, use base charge
    if (distance === null) {
      // Check if free delivery applies based on order value
      if (subtotal >= deliverySettings.freeDeliveryThreshold) {
        return 0;
      }
      return deliverySettings.baseDeliveryCharge;
    }

    // Calculate charge based on distance
    const result = calculateDeliveryCharge(
      distance,
      {
        baseDeliveryCharge: deliverySettings.baseDeliveryCharge,
        chargePerKm: deliverySettings.chargePerKm,
        maxDeliveryDistance: deliverySettings.maxDeliveryDistance,
        freeDeliveryThreshold: deliverySettings.freeDeliveryThreshold
      },
      subtotal
    );

    return result.isDeliverable ? result.charge : 0;
  };

  // Check if delivery is available based on distance
  const isDeliveryAvailable = () => {
    if (!deliverySettings.enableLocationBasedDelivery) {
      return true;
    }

    if (distance === null) {
      return true; // Assume deliverable if we can't determine distance
    }

    return distance <= deliverySettings.maxDeliveryDistance;
  };

  // Apply coupon code
  const applyCoupon = () => {
    const couponCode = form.getValues("couponCode");
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (!pricingConfig) {
      setCouponError("Unable to apply coupon at this time");
      return;
    }

    // Find the coupon in the configuration
    const coupon = pricingConfig.coupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
    );

    if (!coupon) {
      setCouponError("Invalid or expired coupon code");
      return;
    }

    // Check minimum order value
    if (subtotal < coupon.minOrderValue) {
      setCouponError(`This coupon requires a minimum order of ₹${coupon.minOrderValue.toFixed(2)}`);
      return;
    }

    // Check expiry date
    const expiryDate = new Date(coupon.expiryDate);
    if (expiryDate < new Date()) {
      setCouponError("This coupon has expired");
      return;
    }

    // Calculate discount
    let calculatedDiscount = 0;
    if (coupon.type === 'percentage') {
      calculatedDiscount = (subtotal * coupon.value) / 100;

      // Apply maximum discount if applicable
      if (coupon.maxDiscount > 0 && calculatedDiscount > coupon.maxDiscount) {
        calculatedDiscount = coupon.maxDiscount;
      }
    } else {
      calculatedDiscount = coupon.value;
    }

    // Apply the discount
    setDiscount(calculatedDiscount);
    setCouponApplied(true);
    setCouponError("");

    toast({
      title: "Coupon Applied!",
      description: `Discount of ₹${calculatedDiscount.toFixed(2)} has been applied to your order.`,
    });
  };

  // Remove coupon
  const removeCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
    form.setValue("couponCode", "");
  };

  // Calculate tax (GST)
  const tax = getGstCharge();

  // Calculate packaging fee
  const packagingFee = getPackagingFee();

  // Calculate delivery charge
  const deliveryCharge = getDeliveryCharge();

  // Calculate total
  const total = subtotal + tax + packagingFee + deliveryCharge - discount;

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
      packagingFee,
      shipping: {
        charge: deliveryCharge,
        distance: distance,
        isDeliverable: isDeliveryAvailable(),
        userLocation: userLocation,
        storeLocation: storeLocation.coordinates,
        storeAddress: storeLocation.address
      },
      discount: discount > 0 ? discount : undefined,
      couponCode: couponApplied ? customerData.couponCode : undefined,
      gstNumber: customerData.gstNumber || undefined,
      businessGstNumber: pricingConfig?.businessInfo?.gstNumber || undefined,
      total,
      status: "pending",
      paymentId: response.razorpay_payment_id || response.phonepay_payment_id || response.googlepay_payment_id,
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
      notes: customerData.notes || undefined
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
    navigate(`/order-confirmation?id=${orderIdRef}`);
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
                      <Button
                        type="submit"
                        className="w-full md:w-auto"
                        disabled={
                          cartItems.length === 0 ||
                          (deliverySettings.enableLocationBasedDelivery && !isDeliveryAvailable())
                        }
                      >
                        Proceed to Payment
                      </Button>
                      {deliverySettings.enableLocationBasedDelivery &&
                       distance !== null &&
                       !isDeliveryAvailable() && (
                        <p className="text-xs text-destructive mt-2">
                          Sorry, we can't deliver to your location. Maximum delivery distance is {deliverySettings.maxDeliveryDistance} km.
                        </p>
                      )}
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
                          <div>
                            <span>{item.quantity} x {item.name}</span>
                            {item.customization && (
                              <div className="text-xs text-muted-foreground">
                                {item.customization.isEggless && <span className="inline-block mr-1">Eggless</span>}
                                {item.customization.isLactoseFree && <span className="inline-block mr-1">Lactose-Free</span>}
                                {item.customization.isVegan && <span className="inline-block mr-1">Vegan</span>}
                                {item.customization.size && <span className="inline-block mr-1">{item.customization.size}</span>}
                              </div>
                            )}
                          </div>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Location-Based Delivery Information */}
                    <div className="mb-4 border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Delivery Information</h3>
                        {!isLoadingLocation && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={detectUserLocation}
                            className="h-8 text-xs"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {userLocation ? "Update Location" : "Detect Location"}
                          </Button>
                        )}
                      </div>

                      {isLoadingLocation ? (
                        <div className="flex items-center justify-center p-4 border rounded-md">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm">Detecting your location...</span>
                        </div>
                      ) : locationError ? (
                        <Alert variant="destructive" className="mb-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs ml-2">
                            {locationError}
                            <p className="mt-1">
                              We'll use standard delivery charges. Please allow location access for accurate delivery fees.
                            </p>
                          </AlertDescription>
                        </Alert>
                      ) : userLocation && distance !== null ? (
                        <div className="p-3 border rounded-md">
                          <div className="flex items-start mb-2">
                            <MapPin className="h-4 w-4 mt-0.5 mr-2 text-bakery-600" />
                            <div>
                              <p className="text-sm font-medium">Your location is {distance} km from our store</p>
                              <p className="text-xs text-muted-foreground">
                                {isDeliveryAvailable()
                                  ? `Maximum delivery distance: ${deliverySettings.maxDeliveryDistance} km`
                                  : "Sorry, you're outside our delivery area"}
                              </p>
                            </div>
                          </div>

                          {isDeliveryAvailable() ? (
                            <div className="mt-2 pt-2 border-t border-border">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Delivery Fee:</span>
                                {subtotal >= deliverySettings.freeDeliveryThreshold ? (
                                  <span className="text-sm text-green-600 font-medium">Free Delivery</span>
                                ) : (
                                  <span className="text-sm">₹{getDeliveryCharge().toFixed(2)}</span>
                                )}
                              </div>
                              {subtotal < deliverySettings.freeDeliveryThreshold && (
                                <p className="text-xs text-green-600 mt-1">
                                  Free delivery on orders above ₹{deliverySettings.freeDeliveryThreshold.toFixed(2)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <Alert className="mt-2 py-2 bg-amber-50 border-amber-200">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-xs ml-2 text-amber-800">
                                You're outside our delivery area. Please contact us for special arrangements.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 border rounded-md border-dashed text-center">
                          <p className="text-sm text-muted-foreground">
                            Click "Detect Location" to calculate accurate delivery charges
                          </p>
                        </div>
                      )}

                      {subtotal >= deliverySettings.freeDeliveryThreshold && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-green-600 mr-2" />
                            <p className="text-sm text-green-800">
                              Your order qualifies for free delivery!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Coupon Code */}
                    <div className="mb-4 border-t border-border pt-4">
                      <h3 className="text-sm font-medium mb-2">Coupon Code</h3>
                      {couponApplied ? (
                        <div className="flex items-center justify-between bg-green-50 p-2 rounded-md border border-green-200">
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-green-600 mr-2" />
                            <div>
                              <p className="text-sm font-medium">{form.getValues("couponCode")}</p>
                              <p className="text-xs text-green-600">₹{discount.toFixed(2)} discount applied</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeCoupon}
                            className="text-xs h-8"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter coupon code"
                              {...form.register("couponCode")}
                              className="text-sm h-9"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={applyCoupon}
                              className="whitespace-nowrap h-9"
                            >
                              Apply
                            </Button>
                          </div>
                          {couponError && (
                            <Alert variant="destructive" className="mt-2 py-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-xs ml-2">
                                {couponError}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>

                    {/* GST Number for Large Orders */}
                    {subtotal >= (pricingConfig?.businessInfo?.largeOrderThreshold || 10000) && (
                      <div className="mb-4 border-t border-border pt-4">
                        <h3 className="text-sm font-medium mb-2">GST Number</h3>
                        <Input
                          placeholder="Enter your GST number for input tax credit"
                          {...form.register("gstNumber")}
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          For orders above ₹{(pricingConfig?.businessInfo?.largeOrderThreshold || 10000).toFixed(2)},
                          you can provide your GST number for input tax credit.
                        </p>
                      </div>
                    )}

                    {/* Order Notes */}
                    <div className="mb-4 border-t border-border pt-4">
                      <h3 className="text-sm font-medium mb-2">Order Notes (Optional)</h3>
                      <Input
                        placeholder="Special instructions for your order"
                        {...form.register("notes")}
                        className="text-sm"
                      />
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 text-sm border-t border-border pt-4 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>

                      {/* GST */}
                      <div className="flex justify-between">
                        <span>
                          {pricingConfig?.additionalCharges.find(c => c.id === 'gst')?.name || 'GST'}
                          {pricingConfig?.additionalCharges.find(c => c.id === 'gst')?.type === 'percentage' &&
                            ` (${pricingConfig?.additionalCharges.find(c => c.id === 'gst')?.value}%)`}:
                        </span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>

                      {/* Packaging Fee */}
                      {packagingFee > 0 && (
                        <div className="flex justify-between">
                          <span>{pricingConfig?.additionalCharges.find(c => c.id === 'packagingFee')?.name || 'Packaging Fee'}:</span>
                          <span>₹{packagingFee.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Delivery Charge */}
                      <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        {!isDeliveryAvailable() ? (
                          <span className="text-amber-600">Not Available</span>
                        ) : deliveryCharge > 0 ? (
                          <span>₹{deliveryCharge.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">Free</span>
                        )}
                      </div>

                      {/* Discount */}
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
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
