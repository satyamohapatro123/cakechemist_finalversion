// Debug script for orders
(function() {
  // Check if localStorage is working
  console.log("Testing localStorage...");
  
  try {
    // Test localStorage
    localStorage.setItem('test', 'test');
    const testValue = localStorage.getItem('test');
    console.log("localStorage test:", testValue === 'test' ? "PASSED" : "FAILED");
    localStorage.removeItem('test');
    
    // Check existing orders
    const existingOrders = localStorage.getItem('orders');
    console.log("Existing orders:", existingOrders ? "Found" : "Not found");
    if (existingOrders) {
      try {
        const parsedOrders = JSON.parse(existingOrders);
        console.log("Number of existing orders:", parsedOrders.length);
        console.log("First order sample:", parsedOrders[0]);
      } catch (e) {
        console.error("Error parsing existing orders:", e);
      }
    }
    
    // Create a simple order that exactly matches the interface
    const simpleOrder = {
      id: "order_simple_" + Date.now(),
      customer: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "+91 12345 67890",
        address: "123 Test Street",
        city: "Test City",
        state: "Test State",
        pincode: "123456"
      },
      items: [
        {
          id: "1",
          name: "Test Product",
          price: 100,
          quantity: 1,
          image: "https://via.placeholder.com/150",
          category: "Test Category"
        }
      ],
      subtotal: 100,
      tax: 18,
      total: 118,
      status: "pending",
      paymentId: "pay_test123",
      createdAt: new Date().toISOString(),
      notes: "Test order"
    };
    
    // Save the simple order
    localStorage.setItem('orders', JSON.stringify([simpleOrder]));
    console.log("Simple order saved to localStorage");
    
    // Verify the order was saved
    const savedOrders = localStorage.getItem('orders');
    console.log("Saved orders:", savedOrders ? "Found" : "Not found");
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        console.log("Number of saved orders:", parsedOrders.length);
        console.log("Saved order:", parsedOrders[0]);
      } catch (e) {
        console.error("Error parsing saved orders:", e);
      }
    }
    
    console.log("IMPORTANT: Please refresh the page to see if the order appears in the admin panel");
    
  } catch (e) {
    console.error("localStorage error:", e);
  }
})();
