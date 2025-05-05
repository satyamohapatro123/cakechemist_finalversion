
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, ShoppingBag } from "lucide-react";

// Bakery quotes to display randomly
const bakeryQuotes = [
  "Life is short, make it sweet with CakeChemist.",
  "Where science meets sweetness, CakeChemist creates magic in every bite.",
  "Our secret ingredient? A sprinkle of love and a dash of chemistry.",
  "Baking is chemistry for the soul. Experience the perfect formula at CakeChemist.",
  "Every cake tells a story. Let CakeChemist be part of yours.",
  "We don't just bake cakes, we craft memories.",
  "Precision, passion, and the perfect ingredients - that's the CakeChemist way.",
  "Happiness is homemade, and so are our cakes.",
  "Turning flour, sugar, and butter into art since 2023.",
  "The perfect recipe: quality ingredients, scientific precision, and a whole lot of love."
];

interface OrderDetails {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod?: string;
    gstNumber?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
    customization?: {
      isEggless?: boolean;
      isLactoseFree?: boolean;
      isVegan?: boolean;
      nameOnCake?: string;
      imageOnCake?: boolean;
      uploadedImage?: string | null;
      flavor?: string;
      size?: string;
      shape?: string;
    };
  }>;
  subtotal: number;
  tax: number;
  shipping?: number;
  packagingFee?: number;
  discount?: number;
  couponCode?: string;
  gstNumber?: string;
  businessGstNumber?: string;
  total: number;
  status: string;
  paymentId: string;
  paymentMethod?: string;
  createdAt: string;
  notes?: string;
}

interface PricingConfig {
  dietaryOptions: Array<{
    id: string;
    name: string;
    price: number;
    isActive: boolean;
  }>;
  additionalCharges: Array<{
    id: string;
    name: string;
    type: "fixed" | "percentage";
    value: number;
    isActive: boolean;
  }>;
  deliveryZones: Array<{
    id: string;
    name: string;
    radiusKm: number;
    charge: number;
    isFree: boolean;
    minOrderForFree: number;
  }>;
  coupons: Array<{
    id: string;
    code: string;
    type: "fixed" | "percentage";
    value: number;
    minOrderValue: number;
    maxDiscount: number;
    expiryDate: string;
    isActive: boolean;
  }>;
}

const OrderConfirmationPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [quote, setQuote] = useState("");

  // Get a random quote
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bakeryQuotes.length);
    setQuote(bakeryQuotes[randomIndex]);
  }, []);

  // Celebration effect is shown with styling instead of confetti

  useEffect(() => {
    // Get order ID from URL params
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('id');

    if (orderId) {
      // Fetch order from localStorage
      const orders = localStorage.getItem('orders');
      if (orders) {
        const ordersList = JSON.parse(orders);
        const orderDetails = ordersList.find((o: OrderDetails) => o.id === orderId);
        if (orderDetails) {
          setOrder(orderDetails);
        }
      }
    }

    // Load pricing configuration
    const storedConfig = localStorage.getItem('pricingConfig');
    if (storedConfig) {
      setPricingConfig(JSON.parse(storedConfig));
    }
  }, [location.search]);

  const getPaymentMethodName = (method?: string) => {
    switch (method) {
      case "razorpay": return "Razorpay";
      case "phonepay": return "PhonePe";
      case "googlepay": return "Google Pay";
      default: return "Online Payment";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get charge details
  const getChargeDetails = (chargeId: string) => {
    if (!pricingConfig) return null;
    return pricingConfig.additionalCharges.find(charge => charge.id === chargeId && charge.isActive);
  };

  // Calculate GST
  const getGstCharge = () => {
    if (!order || !pricingConfig) return order?.tax || 0;

    const gstCharge = getChargeDetails('gst');
    if (!gstCharge) return order.tax;

    if (gstCharge.type === 'percentage') {
      return (order.subtotal * gstCharge.value) / 100;
    } else {
      return gstCharge.value;
    }
  };

  // Get packaging fee
  const getPackagingFee = () => {
    if (!order || !pricingConfig) return order?.packagingFee || 0;

    const packagingCharge = getChargeDetails('packagingFee');
    if (!packagingCharge) return order.packagingFee || 0;

    if (packagingCharge.type === 'percentage') {
      return (order.subtotal * packagingCharge.value) / 100;
    } else {
      return packagingCharge.value;
    }
  };

  // Print or download invoice
  const handlePrintInvoice = () => {
    window.print();
  };

  if (!order) {
    return (
      <main>
        <section className="relative py-20 bg-bakery-100">
          <div className="container-custom">
            <SectionHeading
              title="Order Confirmation"
              subtitle="Thank you for your order"
              center
            />
          </div>
        </section>
        <section className="py-12">
          <div className="container-custom text-center">
            <p className="mb-6">No order information available.</p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="print:bg-white">
      <section className="relative py-20 bg-bakery-100 print:py-10 print:bg-white">
        <div className="container-custom">
          <SectionHeading
            title="Order Confirmation"
            subtitle="Thank you for your purchase!"
            center
          />
        </div>
      </section>

      <section className="py-12 print:py-6">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg border border-border shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none">
            <div className="text-center mb-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4 print:w-12 print:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-serif">Order Placed Successfully!</h2>
              <p className="text-muted-foreground mt-2">
                Your order has been placed and will be processed soon. A confirmation
                email has been sent to {order.customer.email}
              </p>
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8 print:mb-4">
              <div>
                <h3 className="text-xl font-serif">CakeChemist</h3>
                <p className="text-sm text-muted-foreground">Where Science Meets Sweetness</p>
                {order.businessGstNumber && (
                  <p className="text-sm mt-1">GST: {order.businessGstNumber}</p>
                )}
              </div>
              <div className="text-right">
                <h4 className="font-medium">INVOICE</h4>
                <p className="text-sm text-muted-foreground">#{order.id.substring(0, 8).toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-medium mb-3 text-lg">Order Information</h3>
                <p className="text-sm">Order ID: <span className="font-medium">{order.id}</span></p>
                <p className="text-sm mt-1">Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span></p>
                <p className="text-sm mt-1">Status: <span className="font-medium uppercase text-amber-600">{order.status}</span></p>
                <p className="text-sm mt-1">Payment Method: <span className="font-medium">{getPaymentMethodName(order.paymentMethod)}</span></p>
                <p className="text-sm mt-1">Payment ID: <span className="font-medium">{order.paymentId}</span></p>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Shipping Address</h3>
                <p className="text-sm">{order.customer.name}</p>
                <p className="text-sm mt-1">{order.customer.address}</p>
                <p className="text-sm mt-1">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                <p className="text-sm mt-1">Phone: {order.customer.phone}</p>
                <p className="text-sm mt-1">Email: {order.customer.email}</p>
                {order.gstNumber && (
                  <p className="text-sm mt-1">GST: {order.gstNumber}</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-medium mb-3 text-lg">Order Summary</h3>
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
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.customization && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.customization.isEggless && <span className="inline-block mr-2">Eggless</span>}
                              {item.customization.isLactoseFree && <span className="inline-block mr-2">Lactose-Free</span>}
                              {item.customization.isVegan && <span className="inline-block mr-2">Vegan</span>}
                              {item.customization.size && <span className="inline-block mr-2">Size: {item.customization.size}</span>}
                              {item.customization.flavor && <span className="inline-block mr-2">Flavor: {item.customization.flavor}</span>}
                              {item.customization.shape && <span className="inline-block mr-2">Shape: {item.customization.shape}</span>}
                              {item.customization.nameOnCake && <span className="inline-block mr-2">Name: "{item.customization.nameOnCake}"</span>}
                              {item.customization.imageOnCake && <span className="inline-block">Custom Image</span>}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-secondary p-6 rounded-md mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-muted-foreground">Subtotal:</div>
                <div className="text-right">{formatCurrency(order.subtotal)}</div>

                {/* GST */}
                {getGstCharge() > 0 && (
                  <>
                    <div className="text-muted-foreground">
                      {pricingConfig?.additionalCharges.find(c => c.id === 'gst')?.name || 'GST'}
                      {pricingConfig?.additionalCharges.find(c => c.id === 'gst')?.type === 'percentage' &&
                        ` (${pricingConfig?.additionalCharges.find(c => c.id === 'gst')?.value}%)`}:
                    </div>
                    <div className="text-right">{formatCurrency(getGstCharge())}</div>
                  </>
                )}

                {/* Packaging Fee */}
                {getPackagingFee() > 0 && (
                  <>
                    <div className="text-muted-foreground">
                      {pricingConfig?.additionalCharges.find(c => c.id === 'packagingFee')?.name || 'Packaging Fee'}:
                    </div>
                    <div className="text-right">{formatCurrency(getPackagingFee())}</div>
                  </>
                )}

                {/* Delivery Charge */}
                {order.shipping !== undefined && order.shipping > 0 && (
                  <>
                    <div className="text-muted-foreground">Delivery Charge:</div>
                    <div className="text-right">{formatCurrency(order.shipping)}</div>
                  </>
                )}

                {/* Coupon Discount */}
                {order.discount !== undefined && order.discount > 0 && (
                  <>
                    <div className="text-muted-foreground">
                      Discount {order.couponCode && `(${order.couponCode})`}:
                    </div>
                    <div className="text-right text-green-600">-{formatCurrency(order.discount)}</div>
                  </>
                )}

                <Separator className="col-span-2 my-2" />

                <div className="font-medium text-base">Total:</div>
                <div className="text-right font-medium text-base">{formatCurrency(order.total)}</div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-lg">Order Notes</h3>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}

            {/* Quote */}
            <div className="bg-bakery-50 p-6 rounded-md mb-8 text-center italic">
              <p className="text-bakery-800">{quote}</p>
            </div>

            <div className="flex justify-between items-center mt-8 print:hidden">
              <Button variant="outline" onClick={handlePrintInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <Button asChild>
                <Link to="/shop">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-center hidden print:block">
              <p className="text-sm text-muted-foreground">Thank you for choosing CakeChemist!</p>
              <p className="text-xs text-muted-foreground mt-1">For any queries, please contact us at support@cakechemist.com</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderConfirmationPage;
