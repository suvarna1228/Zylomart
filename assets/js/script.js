const header = document.querySelector("header"),
  cardList = document.getElementById("cardList"),
  cartTableData = document.querySelector(".cartTableData tbody"),
  cartQtyCount = document.getElementById("cartQtyCount"),
  totalQuantity = document.getElementById("totalQuantity"),
  totalNetPrice = document.getElementById("totalNetPrice"),
  category = document.getElementById("category"),
  searchBtn = document.getElementById('searchBtn'),
  searchProduct = document.getElementById("searchIcon"),
  searchInput = document.querySelector(".searchInput"),
  closeSearchInput = document.getElementById("clearIcon"),
  cartIcon = document.getElementById("cartIcon");

const APIUrl = "https://fakestoreapi.com/products/";
let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

// Load Navbar
fetch("navbar.html")
  .then(response => response.text())
  .then(data => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      navbar.innerHTML = data;
      attachCartIconEvent();
      updateCartIcon();
    }
  });

  
  document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    
    if (menuToggle && navMenu){
      menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("hidden"); // Show/hide the menu
    });
    }

});

function attachCartIconEvent() {
  const cartIcon = document.getElementById("cartIcon");
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }
}

// Fetch Categories
window.addEventListener("load", () => {
  fetch(APIUrl + "/categories")
    .then(response => response.json())
    .then(data => {
      if (!category) return;
      data.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.text = item;
        category.append(option);
      });
    });
  loadProducts();
  updateCartIcon();
  if (window.location.pathname.includes("cart.html")) {
    viewCartDetails();
  }
});

// Load Products
function loadProducts() {
  fetch(APIUrl)
    .then(response => response.json())
    .then(data => {
      if (!cardList) return;
      cardList.innerHTML = "";
      data.forEach(product => {
        let cartItem = `
          <div class="singleProduct">
            <div class="images">
              <img src="${product.image}" alt="${product.title}"/>
            </div>
            <div class="productDetails">
              <h5>${product.title}</h5>
              <div class="productPrice">
                <span class="price">$${product.price.toFixed(2)}</span>
                <div>
                  <i class="fa-regular fa-heart"></i>
                  <i class="fa-solid fa-plus" onclick="addToCart(${product.id}, 1)"></i>
                </div>
              </div>
            </div>
          </div>`;
        cardList.innerHTML += cartItem;
      });
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("searchBtn");
  const category = document.getElementById("category");
  const cardList = document.getElementById("cardList"); 
  const APIUrl = "https://fakestoreapi.com/products"; // replace with your real API if different

  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      const selectedCategory = category.value;

      if (selectedCategory === "") {
        alert("Please select a category first.");
        return;
      }

      // Fetch products based on the selected category
      fetch(`${APIUrl}/category/${selectedCategory}`)
        .then(response => response.json())
        .then(filteredProducts => {
          cardList.innerHTML = ""; // Clear current list
          if (filteredProducts.length === 0) {
            cardList.innerHTML = "<p>No products found for the selected category.</p>";
          } else {
            filteredProducts.forEach(product => {
              let cartItem = `
                <div class="singleProduct">
                  <div class="images">
                    <img src="${product.image}" alt="${product.title}" />
                  </div>
                  <div class="productDetails">
                    <h5>${product.title}</h5>
                    <div class="productPrice">
                      <span class="price">$${product.price.toFixed(2)}</span>
                      <div>
                        <i class="fa-regular fa-heart"></i>
                        <i class="fa-solid fa-plus" onclick="addToCart(${product.id}, 1)"></i>
                      </div>
                    </div>
                  </div>
                </div>`;
              cardList.innerHTML += cartItem;
            });
          }
        })
        .catch(error => {
          console.error("Error fetching category:", error);
        });
    });
  } else {
    console.warn("hi");
  }
});


// Add to Cart
function addToCart(Id, Quantity) {
  let productExists = cartData.find(item => item.Id === Id);

  if (productExists) {
    productExists.Quantity += Quantity;
  } else {
    cartData.push({ Id, Quantity });
  }

  localStorage.setItem("cartData", JSON.stringify(cartData)); 
  updateCartIcon();
}

// Update Cart Icon
function updateCartIcon() {
  setTimeout(() => {
    const cartQtyCount = document.getElementById("cartQtyCount"); // Get the element after navbar loads
    if (!cartQtyCount) return; 

    let totalQty = cartData.reduce((sum, item) => sum + item.Quantity, 0);
    cartQtyCount.innerText = totalQty;
  }, 500); // Delay to allow navbar loading
}


// View Cart Details
function viewCartDetails() {
  const cartContainer = document.querySelector(".cartListView");
  const cartTable = document.querySelector(".cartTableData");
  const emptyMessage = document.getElementById("emptyMessage");
  const checkoutSection = document.getElementById("checkoutSection");

  if (cartData.length === 0) {
    cartContainer.style.display = "block"; // Show the container
    cartTable.style.display = "none"; // Hide the cart table
    emptyMessage.style.display = "block"; // Show the empty cart message
    checkoutSection.classList.add("hidden");
    return;
  } else {
    cartContainer.style.display = "block"; // Show the cart table
    cartTable.style.display = "table"; 
    emptyMessage.style.display = "none";
    checkoutSection.classList.remove("hidden");
  }

  cartTableData.innerHTML = "";
  let totalCartPrice = 0, totalCartQuantity = 0;

  cartData.forEach(cartItem => {
    fetch(`${APIUrl}/${cartItem.Id}`)
      .then(response => response.json())
      .then(data => {
        totalCartPrice += data.price * cartItem.Quantity;
        totalCartQuantity += cartItem.Quantity;

        let tableRow = `
          <tr>
            <td>
              <div class="productName flex items-center gap-2">
                <img src="${data.image}" alt="${data.title}" onerror="this.onerror=null; this.src='fallback.jpeg'"  class="w-12 h-12  print:hidden"/>
                <h5>${data.title}</h5>
              </div>
            </td>
            <td class="text-lg print:text-sm">$${data.price.toFixed(2)}</td>
            <td class="text-lg print:text-sm">
              <button onclick="decreaseQuantity(${cartItem.Id})" class="px-2 py-1 bg-black    text-white print:hidden">-</button>
              <span class="px-3 ">${cartItem.Quantity}</span>
              <button onclick="increaseQuantity(${cartItem.Id})" class="px-2 py-1 bg-black text-white print:hidden ">+</button>
            </td>
            <td class="text-lg print:text-sm">$${(data.price * cartItem.Quantity).toFixed(2)}</td>
          </tr>`;

        let tr = document.createElement("tr");
        tr.innerHTML = tableRow;
        cartTableData.appendChild(tr);

        totalQuantity.innerText = totalCartQuantity;
        totalNetPrice.innerText = `$${totalCartPrice.toFixed(2)}`;
      });
  });
}

function increaseQuantity(Id) {
  let product = cartData.find(item => item.Id === Id);
  if (product) {
    product.Quantity += 1;
  }
  localStorage.setItem("cartData", JSON.stringify(cartData));
  updateCartIcon();
  viewCartDetails(); // Refresh cart view
}
function decreaseQuantity(Id) {
  let productIndex = cartData.findIndex(item => item.Id === Id);
  if (productIndex !== -1) {
    if (cartData[productIndex].Quantity > 1) {
      cartData[productIndex].Quantity -= 1;
    } else {
      cartData.splice(productIndex, 1); // Remove item if quantity is 1
    }
  }
  localStorage.setItem("cartData", JSON.stringify(cartData));
  updateCartIcon();
  viewCartDetails(); // Refresh cart view
}
document.addEventListener("DOMContentLoaded", function () {
  const checkoutBtn = document.querySelector("#checkoutSection button");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      console.log("Cart Contents:", cartData);
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const printContents = document.getElementById("printBill").innerHTML;
      const originalContents = document.body.innerHTML;

      // Replace the body content with only the bill
      document.body.innerHTML = printContents;

      // Print
      window.print();

      // Restore original content
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to re-bind events
    });
  }
});

 
