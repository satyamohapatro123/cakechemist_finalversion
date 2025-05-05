// Script to create sample orders with different statuses
(function() {
  // Get existing orders from localStorage
  const existingOrders = localStorage.getItem('orders');
  let orders = existingOrders ? JSON.parse(existingOrders) : [];
  
  // Get products from localStorage for reference
  const storedProducts = localStorage.getItem('products');
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  
  if (products.length === 0) {
    console.error("No products found in localStorage. Please ensure products are available.");
    return;
  }
  
  // Sample customer data
  const customers = [
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      address: "123 Park Street, Mumbai, Maharashtra 400001"
    },
    {
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 87654 32109",
      address: "456 MG Road, Bangalore, Karnataka 560001"
    },
    {
      name: "Amit Singh",
      email: "amit.singh@example.com",
      phone: "+91 76543 21098",
      address: "789 Connaught Place, New Delhi, Delhi 110001"
    },
    {
      name: "Neha Gupta",
      email: "neha.gupta@example.com",
      phone: "+91 65432 10987",
      address: "321 Salt Lake, Kolkata, West Bengal 700001"
    },
    {
      name: "Vikram Reddy",
      email: "vikram.reddy@example.com",
      phone: "+91 54321 09876",
      address: "654 Jubilee Hills, Hyderabad, Telangana 500001"
    }
  ];
  
  // Order statuses
  const statuses = ["pending", "accepted", "completed", "rejected"];
  
  // Generate a random order
  const generateOrder = (status, daysAgo) => {
    // Select random customer
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Select 1-3 random products
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let subtotal = 0;
    
    for (let i = 0; i < numProducts; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemTotal = product.price * quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        total: itemTotal
      });
    }
    
    // Calculate order totals
    const tax = subtotal * 0.18; // 18% GST
    const shipping = 100; // Fixed shipping cost
    const total = subtotal + tax + shipping;
    
    // Generate order date (X days ago)
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);
    
    // Generate rejection reason if status is rejected
    const rejectionReason = status === "rejected" ? 
      "Unfortunately, we are unable to fulfill this order due to " + 
      ["ingredient unavailability", "delivery area constraints", "capacity limitations"][Math.floor(Math.random() * 3)] : 
      null;
    
    // Generate order notes for some orders
    const hasNotes = Math.random() > 0.5;
    const orderNotes = hasNotes ? 
      ["Please deliver in the evening", "Birthday surprise, please be discreet", "Extra napkins please", "Call before delivery"][Math.floor(Math.random() * 4)] : 
      "";
    
    return {
      id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      customer: customer,
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      status: status,
      rejectionReason: rejectionReason,
      notes: orderNotes,
      createdAt: orderDate.toISOString()
    };
  };
  
  // Create sample orders with different statuses and dates
  const newOrders = [
    generateOrder("pending", 0), // Today
    generateOrder("pending", 1), // Yesterday
    generateOrder("accepted", 2), // 2 days ago
    generateOrder("accepted", 3), // 3 days ago
    generateOrder("completed", 5), // 5 days ago
    generateOrder("completed", 7), // 1 week ago
    generateOrder("rejected", 2), // 2 days ago
    generateOrder("rejected", 4)  // 4 days ago
  ];
  
  // Add new orders to existing orders
  orders = [...newOrders, ...orders];
  
  // Save to localStorage
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Dispatch event to notify the app of the update
  const event = new CustomEvent('ordersUpdated');
  window.dispatchEvent(event);
  
  console.log(`${newOrders.length} sample orders created successfully!`);
})();
