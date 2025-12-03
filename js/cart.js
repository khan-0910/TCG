// Cart functionality for Pokemon Cards Store
// Handles cart display, quantity updates, and checkout

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});

// Load and display cart
function loadCart() {
    const cart = dataManager.getCart();
    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    const cartItemCount = document.getElementById('cart-item-count');
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        cartItemCount.textContent = '0 items';
        return;
    }
    
    cartContent.style.display = 'block';
    emptyCart.style.display = 'none';
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    
    // Build cart HTML
    let cartHTML = '<div class="cart-items">';
    
    cart.forEach(item => {
        const product = dataManager.getProductById(item.productId);
        if (!product) return;
        
        const subtotal = product.price * item.quantity;
        const stockWarning = item.quantity > product.stock ? 
            `<p class="stock-warning">⚠️ Only ${product.stock} available in stock</p>` : '';
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/120?text=No+Image'">
                </div>
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="cart-item-price">₹${product.price.toFixed(2)} each</div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${product.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${product.id}, ${item.quantity + 1})" ${item.quantity >= product.stock ? 'disabled' : ''}>+</button>
                    </div>
                    ${stockWarning}
                </div>
                <div class="cart-item-actions">
                    <div class="item-subtotal">₹${subtotal.toFixed(2)}</div>
                    <button class="btn-remove" onclick="removeFromCart(${product.id})">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    
    // Add cart summary
    const total = dataManager.getCartTotal();
    const tax = total * 0.18; // 18% GST
    const grandTotal = total + tax;
    
    cartHTML += `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span class="summary-label">Subtotal:</span>
                <span>₹${total.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Tax (18% GST):</span>
                <span>₹${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Total:</span>
                <span>₹${grandTotal.toFixed(2)}</span>
            </div>
            <div class="checkout-section">
                <button class="btn-checkout" onclick="checkout()">Proceed to Checkout</button>
                <a href="index.html" class="btn-continue">Continue Shopping</a>
            </div>
        </div>
    `;
    
    cartContent.innerHTML = cartHTML;
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        if (confirm('Remove this item from cart?')) {
            removeFromCart(productId);
        }
        return;
    }
    
    const result = dataManager.updateCartQuantity(productId, newQuantity);
    
    if (result.success) {
        loadCart();
        updateCartCount();
    } else {
        showToast(result.message, 'error');
    }
}

// Remove item from cart
function removeFromCart(productId) {
    dataManager.removeFromCart(productId);
    showToast('Item removed from cart', 'success');
    loadCart();
    updateCartCount();
}

// Proceed to checkout page
function checkout() {
    const cart = dataManager.getCart();
    
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // Check stock availability
    let stockIssue = false;
    cart.forEach(item => {
        const product = dataManager.getProductById(item.productId);
        if (!product || product.stock < item.quantity) {
            stockIssue = true;
        }
    });
    
    if (stockIssue) {
        showToast('Some items in your cart are out of stock. Please update quantities.', 'error');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Update cart count in header
function updateCartCount() {
    const count = dataManager.getCartItemCount();
    document.getElementById('cart-count').textContent = count;
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
