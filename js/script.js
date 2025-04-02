const header = document.querySelector("header"),
  cardList=document.getElementById("cardList"),
  cartView = document.querySelector(".cartListView"),
  searchProduct=document.getElementById("searchIcon"),
  searchInput = document.querySelector(".searchInput"),
  closeSearchInput=document.getElementById("clearIcon"),
  category=document.getElementById("category"),
  limit=document.getElementById("limit"),
  cartListView=document.querySelector(".cartListView"),
  cartTableData=document.querySelector(".cartTableData tbody"),
  cartQtyCount=document.getElementById("cartQtyCount"),
  totalQuantity=document.getElementById("totalQuantity"),
  totalNetPrice=document.getElementById("totalNetPrice")

  fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar').innerHTML = data;
            });

            
  let cartData=[];

  searchProduct.addEventListener("click", () => {
    searchInput.classList.remove("hidden"); // Toggles visibility of the search input
  });

  closeSearchInput.addEventListener("click",()=>{
    searchInput.classList.add("hidden");
  });

  const APIUrl="https://fakestoreapi.com/products/";
  window.addEventListener("load",()=>{
    fetch(APIUrl+"/categories").then((response)=>response.json()).then((data)=>{
      

      data.forEach(item => {
        let categories=document.createElement("option");
        categories.value=item;
        categories.text=item;
        category.append(categories);
      });
    });
    loadProducts();
  });

  function loadProducts(){
    fetch(APIUrl)
    .then((response)=>response.json())
    .then((data)=>{
      console.log(data);

      data.forEach((product) => {
       console.log(product);

       let cartItem =`
       <div class="singleProduct">
         <div class="images">
          <img src="${product.image}"/>
         </div>
         <div class="productDetails">
              <h5>${product.title}</h5>
              <div class="productPrice">
                <span class="price">$${product.price}</span>
                <div>
                  <i class="fa-regular fa-heart"></i>
                 <i class="fa-solid fa-plus" onclick="addToCart(${product.id}, 1)"></i>

                </div>
              </div>
         </div>
       </div>
       `;
         cardList.innerHTML+=cartItem;
      });
    });
  }

  function addToCart(Id,Quantity){
    console.log(Id,Quantity)
    let productArr = {Id:Id,Quantity:Quantity};
    let IsProductExist=true;

    cartData.forEach((el)=>{
if(el.Id==Id){
  el.Quantity++;
  IsProductExist=false;
}
    });
    if(IsProductExist){
      cartData.push(productArr);
    }
   

    let totalQty = 0;
    cartData.forEach((el)=>{
      totalQty+=el.Quantity;
    });
    cartQtyCount.innerText=totalQty;

  }

  function viewcartDetails(){
    if(cartData.length>0){
      cartTableData.innerHTML="";
      cartListView.classList.remove("hidden");

      let totalCartPrice=0,
      totalCartQuantity=0;

      cartData.forEach(arr => {
        fetch(APIUrl+"/"+arr.Id)
        .then((response)=>response.json())
        .then((data)=>{
      
       totalCartPrice+=data.price*arr.Quantity;
       totalCartQuantity+=arr.Quantity;

       let tableList=
       `
       <td>
        <div class="productName">
          <img src="${data.image}"/>
          <h5>${data.title}</h5>
        </div>
       </td>
       <td>${data.price}</td>
       <td>${arr.Quantity}</td>
       <td>${data.price*arr.Quantity}</td>

       `;
       let tr= document.createElement("tr");
       tr.innerHTML= tableList;
       cartTableData.appendChild(tr);

       totalQuantity.innerText=totalCartQuantity;
       totalNetPrice.innerText=totalCartPrice;
        });
      });
    }
  }

 function closeCartDetails(){
   cartListView.classList.add("hidden");
 } 
