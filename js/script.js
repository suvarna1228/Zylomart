const header = document.querySelector("header"),
  cardList = document.getElementById("cardList"),
  cartTableData = document.querySelector(".cartTableData tbody"),
  cartQtyCount = document.getElementById("cartQtyCount"),
  totalQuantity = document.getElementById("totalQuantity"),
  totalNetPrice = document.getElementById("totalNetPrice"),
  category = document.getElementById("category"),
  limit = document.getElementById("limit"),
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
    document.getElementById("navbar").innerHTML = data;
    attachCartIconEvent();
    updateCartIcon(); // Call AFTER navbar loads
  });

  
  document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("hidden"); // Show/hide the menu
    });
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

  if (cartData.length === 0) {
    cartContainer.style.display = "block"; // Show the container
    cartTable.style.display = "none"; // Hide the cart table
    emptyMessage.style.display = "block"; // Show the empty cart message
    return;
  } else {
    cartContainer.style.display = "block"; // Show the cart table
    cartTable.style.display = "table"; 
    emptyMessage.style.display = "none"; // Hide empty cart message
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
                <img src="${data.image}" alt="${data.title}" class="w-12 h-12"/>
                <h5>${data.title}</h5>
              </div>
            </td>
            <td>$${data.price.toFixed(2)}</td>
            <td>
              <button onclick="decreaseQuantity(${cartItem.Id})" class="px-2 py-1 bg-black    text-white">-</button>
              <span class="px-3">${cartItem.Quantity}</span>
              <button onclick="increaseQuantity(${cartItem.Id})" class="px-2 py-1 bg-black text-white">+</button>
            </td>
            <td>$${(data.price * cartItem.Quantity).toFixed(2)}</td>
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

 
