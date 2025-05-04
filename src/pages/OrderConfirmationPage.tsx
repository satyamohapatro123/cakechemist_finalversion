
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentId: string;
  paymentMethod?: string;
  createdAt: string;
}

const OrderConfirmationPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  
  useEffect(() => {
    if (location.state?.orderId) {
      const orderId = location.state.orderId;
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
  }, [location.state]);

  const getPaymentMethodName = (method?: string) => {
    switch (method) {
      case "razorpay": return "Razorpay";
      case "phonepay": return "PhonePe";
      case "googlepay": return "Google Pay";
      default: return "Online Payment";
    }
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
    <main>
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="Order Confirmation"
            subtitle="Thank you for your purchase!"
            center
          />
        </div>
      </section>
      
      <section className="py-12">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg border border-border shadow-sm max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-serif">Order Placed Successfully!</h2>
              <p className="text-muted-foreground mt-2">
                Your order has been placed and will be processed soon. A confirmation 
                email has been sent to {order.customer.email}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-medium mb-3 text-lg">Order Information</h3>
                <p className="text-sm">Order ID: <span className="font-medium">{order.id}</span></p>
                <p className="text-sm mt-1">Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                <p className="text-sm mt-1">Status: <span className="font-medium uppercase text-amber-600">{order.status}</span></p>
                <p className="text-sm mt-1">Payment Method: <span className="font-medium">{getPaymentMethodName(order.paymentMethod)}</span></p>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-lg">Shipping Address</h3>
                <p className="text-sm">{order.customer.name}</p>
                <p className="text-sm mt-1">{order.customer.address}</p>
                <p className="text-sm mt-1">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                <p className="text-sm mt-1">Phone: {order.customer.phone}</p>
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
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-secondary p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-muted-foreground">Subtotal:</div>
                <div className="text-right">₹{order.subtotal.toFixed(2)}</div>
                <div className="text-muted-foreground">GST (18%):</div>
                <div className="text-right">₹{order.tax.toFixed(2)}</div>
                <div className="font-medium text-base">Total:</div>
                <div className="text-right font-medium text-base">₹{order.total.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Thank you for shopping with us!</p>
              <Button asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderConfirmationPage;
