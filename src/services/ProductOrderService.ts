/**
 * Service to handle synchronization between products and orders
 */

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId: string;
  description?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId?: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  rejectionReason?: string;
}

/**
 * Updates order items when a product is updated
 * @param updatedProduct - The updated product
 */
export const updateOrdersWithProduct = (updatedProduct: Product): void => {
  try {
    // Get orders from localStorage
    const ordersJson = localStorage.getItem('orders');
    if (!ordersJson) return;

    const orders: Order[] = JSON.parse(ordersJson);
    let hasChanges = false;

    // Update each order that contains the product
    const updatedOrders = orders.map(order => {
      const updatedItems = order.items.map(item => {
        // Check if this item is the updated product
        if (item.productId === updatedProduct.id) {
          hasChanges = true;
          return {
            ...item,
            name: updatedProduct.name,
            price: updatedProduct.price
          };
        }
        return item;
      });

      // Recalculate order totals if items were updated
      if (updatedItems.some(item => item.productId === updatedProduct.id)) {
        const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.18; // Assuming 18% GST
        const total = subtotal + tax;

        return {
          ...order,
          items: updatedItems,
          subtotal,
          tax,
          total,
          updatedAt: new Date().toISOString()
        };
      }

      return order;
    });

    // Save updated orders back to localStorage if changes were made
    if (hasChanges) {
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Dispatch event to notify the app of the update
      const event = new CustomEvent('ordersUpdated');
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error updating orders with product:', error);
  }
};

/**
 * Removes a product from all orders
 * @param productId - The ID of the product to remove
 */
export const removeProductFromOrders = (productId: string): void => {
  try {
    // Get orders from localStorage
    const ordersJson = localStorage.getItem('orders');
    if (!ordersJson) return;

    const orders: Order[] = JSON.parse(ordersJson);
    let hasChanges = false;

    // Update each order that contains the product
    const updatedOrders = orders.map(order => {
      // Check if order contains the product
      const hasProduct = order.items.some(item => item.productId === productId);
      
      if (!hasProduct) return order;
      
      hasChanges = true;
      
      // Remove the product from items
      const updatedItems = order.items.filter(item => item.productId !== productId);
      
      // If no items left, mark order as rejected
      if (updatedItems.length === 0) {
        return {
          ...order,
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          status: 'rejected',
          rejectionReason: 'Product no longer available',
          updatedAt: new Date().toISOString()
        };
      }
      
      // Recalculate order totals
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18; // Assuming 18% GST
      const total = subtotal + tax;
      
      return {
        ...order,
        items: updatedItems,
        subtotal,
        tax,
        total,
        updatedAt: new Date().toISOString(),
        notes: order.notes ? `${order.notes}\nProduct removed: Product ID ${productId}` : `Product removed: Product ID ${productId}`
      };
    });

    // Save updated orders back to localStorage if changes were made
    if (hasChanges) {
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Dispatch event to notify the app of the update
      const event = new CustomEvent('ordersUpdated');
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error removing product from orders:', error);
  }
};

/**
 * Initializes sample orders if none exist
 * @param products - The products to use for sample orders
 */
export const initializeOrders = (products: Product[]): void => {
  try {
    // Check if orders already exist
    const ordersJson = localStorage.getItem('orders');
    if (ordersJson) return;
    
    // Create sample orders if products exist
    if (products.length === 0) return;
    
    const sampleOrders: Order[] = [
      {
        id: `order_${Date.now()}_1`,
        customer: {
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          phone: '9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [
          {
            id: `item_${Date.now()}_1`,
            productId: products[0].id,
            name: products[0].name,
            price: products[0].price,
            quantity: 2,
            image: products[0].image
          },
          {
            id: `item_${Date.now()}_2`,
            productId: products[1].id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            image: products[1].image
          }
        ],
        subtotal: (products[0].price * 2) + products[1].price,
        tax: ((products[0].price * 2) + products[1].price) * 0.18,
        total: ((products[0].price * 2) + products[1].price) * 1.18,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    
    // Save sample orders to localStorage
    localStorage.setItem('orders', JSON.stringify(sampleOrders));
  } catch (error) {
    console.error('Error initializing orders:', error);
  }
};
