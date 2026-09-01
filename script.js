const products=[
{id:1,name:"Classic Black Tee",cat:"T-Shirts",price:799,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"},
{id:2,name:"Essential White Tee",cat:"T-Shirts",price:799,img:"https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=700&q=80"},
{id:3,name:"Urban Comfort Hoodie",cat:"Hoodies",price:1499,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80"},
{id:4,name:"Minimal Overshirt",cat:"Shirts",price:1299,img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80"},
{id:5,name:"Slim Fit Black Jeans",cat:"Jeans",price:1699,img:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80"},
{id:6,name:"Everyday Denim",cat:"Jeans",price:1599,img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80"},
{id:7,name:"Classic Beige Hoodie",cat:"Hoodies",price:1499,img:"https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=700&q=80"},
{id:8,name:"Premium Cotton Shirt",cat:"Shirts",price:1399,img:"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=80"}];
let cart=JSON.parse(localStorage.getItem("pcCart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("pcWish")||"[]");

function renderProducts(list=products){
 document.getElementById("products").innerHTML=list.map(p=>`<article class="product-card">
 <button class="wish-btn" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
 <img src="${p.img}" alt="${p.name}"><div class="product-info"><h3>${p.name}</h3><p>₹${p.price}</p>
 <div class="product-actions"><button class="small-btn" onclick="addCart(${p.id})">ADD TO CART</button></div></div></article>`).join("")||'<p class="empty">No products found.</p>';
 updateCounts();
}
function filterCategory(cat){
 document.querySelectorAll(".filters button").forEach(b=>b.classList.toggle("selected",b.textContent.trim()===cat));
 renderProducts(cat==="All"?products:products.filter(p=>p.cat===cat));
 document.getElementById("shop").scrollIntoView({behavior:"smooth"});
}
function searchProducts(q){q=q.toLowerCase();renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)))}
function addCart(id){cart.push(id);save();toast("Added to cart ✓");}
function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderProducts(currentVisibleProducts());toast(wishlist.includes(id)?"Added to wishlist ♡":"Removed from wishlist");}
function currentVisibleProducts(){return products.filter(p=>document.getElementById("searchInput").value? p.name.toLowerCase().includes(document.getElementById("searchInput").value.toLowerCase()):true)}
function save(){localStorage.setItem("pcCart",JSON.stringify(cart));localStorage.setItem("pcWish",JSON.stringify(wishlist));updateCounts()}
function updateCounts(){document.getElementById("cartCount").textContent=cart.length;document.getElementById("wishCount").textContent=wishlist.length}
function openCart(){renderCart();openPanel("cartPanel")}
function openWishlist(){let items=wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean);document.getElementById("wishItems").innerHTML=items.length?items.map(p=>`<div class="cart-row"><img src="${p.img}"><div><h4>${p.name}</h4><p>₹${p.price}</p><button class="remove" onclick="toggleWish(${p.id});openWishlist()">Remove</button></div></div>`).join(""):'<p class="empty">Your wishlist is empty.</p>';openPanel("wishPanel")}
function renderCart(){let total=0;let items=cart.map((id,i)=>({p:products.find(x=>x.id===id),i})).filter(x=>x.p);document.getElementById("cartItems").innerHTML=items.length?items.map(({p,i})=>{total+=p.price;return `<div class="cart-row"><img src="${p.img}"><div><h4>${p.name}</h4><p>₹${p.price}</p><button class="remove" onclick="removeCart(${i})">Remove</button></div></div>`}).join(""):'<p class="empty">Your cart is empty.</p>';document.getElementById("cartTotal").textContent="₹"+total}
function removeCart(i){cart.splice(i,1);save();renderCart()}
function openPanel(id){closePanels();document.getElementById("overlay").classList.add("show");document.getElementById(id).classList.add("show")}
function closePanels(){document.getElementById("overlay").classList.remove("show");document.querySelectorAll(".panel").forEach(x=>x.classList.remove("show"))}
function toggleSearch(){document.getElementById("searchBar").classList.toggle("show");document.getElementById("searchInput").focus()}
function checkout(){if(!cart.length)return toast("Your cart is empty");cart=[];save();renderCart();closePanels();toast("Order placed successfully! 🎉")}
function subscribe(e){e.preventDefault();e.target.reset();toast("Thanks for subscribing! ✨")}
function showMessage(m){toast(m)}
function toast(m){let t=document.getElementById("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
renderProducts();

function cartDetails(){return cart.map(id=>products.find(p=>p.id===id)).filter(Boolean)}
function cartAmount(){return cartDetails().reduce((sum,p)=>sum+p.price,0)}
function goCheckout(){if(!cart.length){toast("Your cart is empty");return}location.href="checkout.html"}
function renderCheckout(){const items=cartDetails();const holder=document.getElementById("checkoutItems");if(!holder)return;if(!items.length){holder.innerHTML='<p class="order-empty">Your cart is empty. <a href="index.html#shop">Continue shopping</a></p>';document.getElementById("subtotal").textContent="₹0";document.getElementById("shipping").textContent="₹0";document.getElementById("grandTotal").textContent="₹0";return}const subtotal=cartAmount();const shipping=subtotal>=999?0:99;holder.innerHTML=items.map(p=>`<div class="checkout-item"><span>${p.name}<small> × 1</small></span><strong>₹${p.price}</strong></div>`).join("");document.getElementById("subtotal").textContent="₹"+subtotal;document.getElementById("shipping").textContent=shipping?"₹"+shipping:"FREE";document.getElementById("grandTotal").textContent="₹"+(subtotal+shipping)}
function placeOrder(e){e.preventDefault();if(!cart.length){toast("Your cart is empty");return}const f=e.target;const subtotal=cartAmount();const shipping=subtotal>=999?0:99;const payment=new FormData(f).get("payment");const order={id:"PC"+Date.now().toString().slice(-6),date:new Date().toLocaleDateString("en-IN"),items:cartDetails(),total:subtotal+shipping,payment,status:payment==="COD"?"Confirmed":"Payment Pending",customer:{name:f.name.value,phone:f.phone.value,email:f.email.value,address:f.address.value,city:f.city.value,pincode:f.pincode.value}};const orders=JSON.parse(localStorage.getItem("pcOrders")||"[]");orders.unshift(order);localStorage.setItem("pcOrders",JSON.stringify(orders));cart=[];save();document.querySelector(".checkout-page").innerHTML=`<section class="checkout-card success-box"><p class="eyebrow">ORDER CONFIRMED</p><h2>Thank You! 🎉</h2><p>Your order <strong>#${order.id}</strong> has been placed successfully.</p><p><strong>Total:</strong> ₹${order.total}<br><strong>Payment:</strong> ${order.payment}</p><p>${order.payment==="COD"?"You will pay when your order is delivered.":"Online payment is currently in demo mode."}</p><div class="hero-buttons" style="justify-content:center"><a class="btn dark" href="index.html">CONTINUE SHOPPING</a><a class="btn light" href="account.html">MY ACCOUNT</a></div></section>`;window.scrollTo(0,0)}
