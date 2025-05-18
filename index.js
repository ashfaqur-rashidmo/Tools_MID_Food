let allProducts = []; 

const searchProduct = () => {
  fetch("https://ashfaqur-rashidmo.github.io/API/Foods.json")
    .then(res => res.json())
    .then(data => {
      allProducts = data; 
      showDetails(data);
    });
};


searchProduct();

// For product image details
const showDetails = (FoodDelivery) => {
  const details = document.getElementById("display-card");

  FoodDelivery.map(Element => {
    console.log(Element)
    const ratingStar = ratings(Element.Rating)

    const div = document.createElement("div");

    // Unique ID for icon group
    const iconGroupId = `icon-group-${Element.id}`;

    div.innerHTML = `
    
      <div class="flex flex-wrap justify-start gap-2 pr-4">
  <div class="bg-white shadow-lg rounded-2xl w-72 p-4 relative">
    <img alt="Food" class="w-full h-40 object-cover rounded-t-lg" src="${Element.image}" />

    <!-- Add Button -->
    <a class="absolute top-32 right-4 text-white p-2 rounded-full cursor-pointer">
      <img 
        src="./assets/add_icon_white.png" 
        alt="Add" 
        class="w-[35px]" 
        onclick="toggleIconGroup('${iconGroupId}', ${Element.id}, ${Element.price})"
      />
    </a>

    <div id="${iconGroupId}" class="absolute top-44 right-4 flex gap-2 hidden">
      <img 
        src="./assets/add_icon_green.png" 
        alt="Green Plus" 
        class="w-8 h-8 cursor-pointer"
        onclick="addToCart(${Element.id}, ${Element.price})"
      />
      <img 
        src="./assets/remove_icon_red.png" 
        alt="Green Minus" 
        class="w-8 h-8 cursor-pointer"
        onclick="removeFromCart(${Element.id}, ${Element.price})"
      />
    </div>

    <div class="mt-4 space-y-2">
      <div class="flex justify-between items-start">
        <h2 class="text-lg font-semibold text-gray-800">${Element.name}</h2>
        <div class="flex items-center space-x-1">
          <p>${ratingStar}</p> 
        </div>
      </div>
      <p class="text-sm text-gray-500 leading-tight">${Element.description}</p>
      <div class="flex justify-between items-center pt-2">
        <span class="font-bold text-lg text-gray-800">$${Element.price}</span>
      </div>
    </div>
  </div>
</div>

    `;

    details.appendChild(div);
  });
};

// for add cart
let count = 0;
let cartItems = {};
const addToCart = (id, price) => {
  count++;
  
    cartItems[id] = (cartItems[id] || 0) + 1;
  document.getElementById("Total-Product").innerHTML = count;
  
  updatePrice(price)
  ShippingCost()
  total()
  updateCartView()
  total()
  updateCartBadge()
};




// mobile menu
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
}



const toggleIconGroup = (groupId, id, price) => {
  const group = document.getElementById(groupId);
  group.classList.toggle("hidden");
};

// For adding price
const updatePrice = (price) => {
  price = parseFloat(price); 
  const oldPrice = document.getElementById("price").innerText;
  const oldPriceFloat = parseFloat(oldPrice);
  const newPrice = price + oldPriceFloat;
  document.getElementById("price").innerText = newPrice.toFixed(2);
  

  DeliveryCharge(newPrice);
};

// cart badge
const updateCartBadge = ()=> {
  const badge = document.getElementById("cart-badge");

  if (count > 0) {
    badge.textContent = count; 
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}




const removeFromCart = (id, price) => {
  if (cartItems[id] && cartItems[id] > 0) {
    cartItems[id]--;
    count--;

    document.getElementById("Total-Product").innerText = count;

    const oldPrice = parseFloat(document.getElementById("price").innerText);
    const newPrice = oldPrice - price;
    document.getElementById("price").innerText = newPrice.toFixed(2);

    DeliveryCharge(newPrice);
    total();

    if (cartItems[id] === 0) {
      delete cartItems[id];
    }

    updateCartBadge(); 
  } else {
    alert("This item is not in the cart.");
  }
};


// Delivery Charge
const DeliveryCharge = (newPrice) => {
  if (newPrice >= 1000) {
    document.getElementById("delivery-charge").innerText = "$200";
  } else if (newPrice >= 500) {
    document.getElementById("delivery-charge").innerText = "$100";
  } else {
    document.getElementById("delivery-charge").innerText = "$50";
  }
};

// Rating
const ratings = (rate) => {
  const fullStars = Math.floor(rate);
  const halfStar = rate % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHtml = '<h3 class="flex items-center gap-1 text-yellow-500">';
  
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fa-solid fa-star"></i>';
  }

  if (halfStar) {
    starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="fa-regular fa-star"></i>';
  }

  starsHtml += ` <span class="text-sm text-gray-700">(${rate})</span></h3>`;
  return starsHtml;
};



// Shipping cost calculation
const ShippingCost = () => {
  let itemCount = 0;

  
  for (const id in cartItems) {
    itemCount += cartItems[id];
  }

 
  const shippingCost = itemCount * 2;

 
  const shippingCostElement = document.getElementById("shipping-cost");
  if (shippingCostElement) {
    shippingCostElement.innerText = `$${shippingCost.toFixed(2)}`;
  }

  return shippingCost;
};



const total = () => {
  
  const subtotalText = document.getElementById("price").innerText;
  const deliveryChargeText = document.getElementById("delivery-charge").innerText;
  const shippingCostText = document.getElementById("shipping-cost").innerText;
  
  
 
  const subtotal = parseFloat(subtotalText.replace('$', '').trim());
  const deliveryCharge = parseFloat(deliveryChargeText.replace('$', '').trim());
  const shippingCost = parseFloat(shippingCostText.replace('$', '').trim());



  const totalAmount = subtotal + deliveryCharge + shippingCost;

  
  document.getElementById("total").innerText = `$${totalAmount.toFixed(2)}`;
};



// order info
const orderProducts = () => {
  const details = document.getElementById("details");
  details.textContent = '';

  const totalPriceText = document.getElementById("total").innerText;
  const totalAmount = parseFloat(totalPriceText.replace('$',''));

  if (totalAmount <= 0) {
    details.innerHTML = `<p class="text-red-600 font-semibold">❗ Your cart is empty. Please add items.</p>`;
    return;
  }

  
  const orderedContainer = document.getElementById("ordered-products");
  orderedContainer.innerHTML = '';

  // Show order summary
  const div = document.createElement('div');
  div.classList.add("shopping");

  div.innerHTML = `
    <h4 class="text-lg font-bold mb-2">🛒 Order Summary</h4>
    <h4 class="text-lg font-bold">Total Shopping: ${totalPriceText}</h4>
    <p class="text-green-600 font-semibold">✅ Thanks For Shopping With Us!</p>
  `;

  details.appendChild(div);
};



// ordered cart view
function updateCartView() {
  const orderedContainer = document.getElementById("ordered-products");
  orderedContainer.innerHTML = ''; 

  for (const id in cartItems) {
    const product = allProducts.find(p => p.id == id);
    const quantity = cartItems[id];

    if (product) {
      const itemDiv = document.createElement("div");
      itemDiv.className = "flex items-center gap-4 bg-gray-100 p-2 rounded";

      itemDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
        <div>
          <h5 class="font-semibold">${product.name}</h5>
          <p>Quantity: ${quantity}</p>
          <p class="text-sm text-gray-600">Price: $${(product.price * quantity).toFixed(2)}</p>
        </div>
      `;
      orderedContainer.appendChild(itemDiv);
    }
  }
}


// For order details show
const orderDetails = () => {
  const orderDetail = document.getElementById("orderDetails");

  
  if (orderDetail.style.display === "none" || orderDetail.style.display === "") {
    orderDetail.style.display = "block";
  } else {
    orderDetail.style.display = "none";
    return; 
  }

};




// For offer or discount
const Discount = () => {
  const TotalElement = document.getElementById("total");
  let Total = parseFloat(TotalElement.innerText.replace('$', ''));

  if (Total >= 1000) {
    const discount = Total * 0.1;
    Total -= discount;
    TotalElement.innerText = `$${Total.toFixed(2)}`;

    document.getElementById("details").innerHTML = `
      <p class="text-green-600 font-semibold">🎉 Congrats! You got a 10% discount.</p>
      <p>New Total: $${Total.toFixed(2)}</p>
    `;
  } else {
    document.getElementById("details").innerHTML = `
      <p class="text-red-600">❗ Spend $1000 or more to unlock 10% discount.</p>
    `;
  }
};

