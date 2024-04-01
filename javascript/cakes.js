// Global variables
var currentQuantity = 1;
var currentCakeName = ""; // To hold the name of the currently selected cake

document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('userName'); // Retrieve the name from localStorage
    if (name) { // If a name was saved
        document.getElementById('welcomeMessage').textContent = `Welcome ${name}!`;
    }
    updateCartCount();
});

document.getElementById('checkout').addEventListener('click', function() {
    const completeOrderBtn = document.getElementById('complete-order');
    completeOrderBtn.classList.remove('hidden'); // Remove the class that hides the button
    // Optional: Checkout logic here
});

// Function to open modal with a specific message
function openModal(message) {
    document.getElementById('modal-text').textContent = message;
    document.getElementById('modal').style.display = "block";
}

// Function to close modal
document.getElementsByClassName('close-button')[0].onclick = function() {
    document.getElementById('modal').style.display = "none";
}

// Replace alert calls with openModal in your existing code
// For example, replace alert('Added to cart!'); with openModal('Added to cart!');

// Function to show the popup for a cake
function showPopup(cakeName) {
    currentCakeName = cakeName; // Set the current cake name
    document.getElementById("popup").style.display = "flex";
    document.getElementById("popup-image").src = "assets/" + cakeName.toLowerCase().split(' ').join('-') + ".png";
    document.getElementById("popup-image").alt = cakeName;
}

// Function to hide the popup
function hidePopup() {
    document.getElementById("popup").style.display = "none";
    resetQuantity();
}

// Function to change the quantity in the popup
function changeQuantity(change) {
    currentQuantity = Math.max(currentQuantity + change, 1);
    document.getElementById("quantity").innerText = currentQuantity;
}

// Function to reset the quantity to 1
function resetQuantity() {
    currentQuantity = 1;
    document.getElementById("quantity").innerText = currentQuantity;
}

// Function to get the cart from local storage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Function to save the cart to local storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount()
}

function updateCartCount(forceClear = false) {
    if (forceClear) {
        document.getElementById('cart-count').textContent = '0'; // Directly set to 0 if forced
        return;
    }
    const cart = getCart();
    const totalCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0; // Compute total count or set to 0 if cart is null
    document.getElementById('cart-count').textContent = totalCount; // Update the badge with this count
}

// Function to add the current item to the cart
function addToCart() {
    let cakeName = currentCakeName; // Use the global variable for the cake name
    let quantity = currentQuantity; // Use the global variable for the quantity
    let cart = getCart(); // Get the current cart
    let itemIndex = cart.findIndex(item => item.cakeName === cakeName);

    // Update the cart with the new item or quantity
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += quantity;
    } else {
        cart.push({ cakeName, quantity, complimentary: ["Fruit Bowl", "Cookie", "Water"] });
    }

    saveCart(cart); // Save the updated cart to local storage
    updateCartCount();
    hidePopup(); // Close the popup
    openModal('Added to cart!'); // Provide feedback to the user
}

// Function to show the cart popup
function showCartPopup() {
    document.getElementById("cart-popup").style.display = "flex";
    updateCartPopup();
}

// Function to hide the cart popup
function hideCartPopup() {
    document.getElementById("cart-popup").style.display = "none";
}

// Function to update and display the cart items in the popup
function updateCartPopup() {
    let cart = getCart(); // Fetch the current cart
    let cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ''; // Clear current contents

    // Check if the cart is empty and update the UI accordingly
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    // Otherwise, loop through the cart items and display them
    cart.forEach(item => {
        let itemElement = document.createElement("div");
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${item.cakeName} x ${item.quantity}</p>
            <p><span style="color: #FECDDC;">Complimentary: Fruit Bowl, Cookie, Water</span></p>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

function clearCart() {
    localStorage.removeItem('cart'); // Remove the cart from local storage
    updateCartPopup(); // Update the cart popup to reflect the empty cart
    openModal('Cart has been cleared.'); // Provide feedback to the user
    updateCartCount(true); // Force update cart count after clearing
}

function completeCheckout() {
    // Your existing confetti and alert logic here
    confetti({
        particleCount: 2000,
        spread: 70,
        origin: { y: 0.6 }
    });
    openModal('Your order has been saved, Complete Order to SEND:)');;

    // Schedule the popup to close after 2 seconds (2000 milliseconds)
    setTimeout(function() {
        hideCartPopup(); // Assuming hideCartPopup is the function to close your popup
    }, 2000);
}

function completeOrder() {
    let userName = localStorage.getItem('userName');
    let cart = getCart();
    if (!userName) {
        console.log("User name is missing.");
        return;
    }
    if (!cart || cart.length === 0) {
        console.log("Your cart is empty.");
        return;
    }
    
    let cartData = JSON.stringify(cart.map(item => ({
        cakeName: item.cakeName,
        quantity: item.quantity
    })));

    console.log(`Sending data - fullName: ${userName}, cartData: ${cartData}`);

    fetch('http://localhost/CAKE%20SALE/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `fullName=${encodeURIComponent(userName)}&cartData=${encodeURIComponent(cartData)}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Order data sent to server:", data);
        clearCart();
        window.location.href = 'http://localhost/CAKE%20SALE/lastpage.html';
    })
    .catch((error) => {
        console.error('Error sending order:', error);
    });
}

