// Script to update the Sourdough Bread image in localStorage
(function() {
  // Get products from localStorage
  const storedProducts = localStorage.getItem('products');
  
  if (storedProducts) {
    const products = JSON.parse(storedProducts);
    
    // Find the Sourdough Bread product (id: 3)
    const sourdoughIndex = products.findIndex(product => product.id === "3");
    
    if (sourdoughIndex !== -1) {
      // Update the image URL to a better quality sourdough bread image
      products[sourdoughIndex].image = "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=1000&auto=format&fit=crop";
      
      // Save back to localStorage
      localStorage.setItem('products', JSON.stringify(products));
      
      // Dispatch event to notify the app of the update
      const event = new CustomEvent('productsUpdated');
      window.dispatchEvent(event);
      
      console.log("Sourdough Bread image updated successfully!");
    } else {
      console.error("Sourdough Bread product not found!");
    }
  } else {
    console.error("No products found in localStorage!");
  }
})();
