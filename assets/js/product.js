document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productDetails");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      container.innerHTML = `
  <img src="${product.image}" class="w-72 h-72 object-contain" alt="${product.title}">
  <div>
    <h1 class="text-3xl font-bold mb-4">${product.title}</h1>
    <p class="mb-4">${product.description}</p>
    <p class="text-xl font-semibold mb-4">$${product.price}</p>
    <div class="flex gap-4 flex-wrap">
      <button id="backtoShopebtn" class="bg-purple-800 text-black px-6 py-3 rounded hover:bg-black">Back To Shop</button>
      <button onclick="addToCart(${product.id}, 1)" class="bg-purple-800 text-black px-6 py-3 rounded hover:bg-black">Add to Cart</button>
      <button id="shareBtn" class="bg-purple-800 text-black px-6 py-3 rounded hover:bg-black">🔗 Share</button>
    </div>
  </div>
`;

document.getElementById("shareBtn").addEventListener("click", () => {
  const shareUrl = window.location.href;

  navigator.clipboard.writeText(shareUrl).then(() => {
    showToast("Product link copied to clipboard!");
  }).catch(err => {
    alert("Failed to copy: " + err);
  });
});

      document.getElementById("backtoShopebtn").addEventListener("click", () => {
        window.location.href = "shop.html"; // or your main product listing page
      });
    })
    .catch((error) => {
      console.error("Error loading product:", error);
      container.innerHTML = "<p>Error loading product.</p>";
    });
});
