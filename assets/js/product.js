document.addEventListener("DOMContentLoaded", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const container = document.getElementById("productDetails");
  
    if (!product) {
      container.innerHTML = "<p>Product not found.</p>";
      return;
    }
  
    container.innerHTML = `
    
      <img src="${product.image}" class="w-72 h-72 object-contain" alt="${product.title}">
      <div>
        <h1 class="text-3xl font-bold mb-4">${product.title}</h1>
        <p class="mb-4">${product.description}</p>
        <p class="text-xl font-semibold mb-4">$${product.price}</p>
       <button id="backtoShopebtn" class="bg-purple-800 text-white px-6 py-3 rounded hover:bg-black">Back To Shop</button>

      </div>
    `;
    document.getElementById("backtoShopebtn").addEventListener("click", () => {
        // Replace 'shop.html' with your actual shop page URL
        window.location.href = "shop.html";
      });
      
  

  })
  