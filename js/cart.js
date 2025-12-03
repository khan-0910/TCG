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
        
        // If product doesn't exist, show error message but allow removal
        if (!product) {
            cartHTML += `
                <div class="cart-item" style="background: #fff3cd; border-left: 4px solid #ffc107;">
                    <div class="cart-item-image">
                        <img src="https://via.placeholder.com/120?text=Product+Not+Found" alt="Product Not Found">
                    </div>
                    <div class="cart-item-details">
                        <h3>Product Not Found</h3>
                        <p style="color: #856404;">This product may have been deleted.</p>
                        <p style="color: #856404; font-weight: 600;">Please remove it from your cart.</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn-remove" onclick="removeFromCart(${item.productId})">Remove</button>
                    </div>
                </div>
            `;
            return;
        }
        
        const subtotal = product.price * item.quantity;
        
        // Check stock status
        let stockWarning = '';
        let outOfStockMessage = '';
        
        if (product.stock === 0) {
            outOfStockMessage = `<p class="stock-warning" style="color: #e74c3c; font-weight: 600;">❌ OUT OF STOCK - Please remove this item to proceed</p>`;
        } else if (item.quantity > product.stock) {
            stockWarning = `<p class="stock-warning">⚠️ Only ${product.stock} available in stock</p>`;
        }
        
        cartHTML += `
            <div class="cart-item" ${product.stock === 0 ? 'style="background: #ffebee; border-left: 4px solid #e74c3c;"' : ''}>
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/120?text=No+Image'">
                    ${product.stock === 0 ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(231, 76, 60, 0.9); color: white; padding: 0.5rem; border-radius: 5px; font-weight: 600; font-size: 0.9rem;">OUT OF STOCK</div>' : ''}
                </div>
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="cart-item-price">₹${product.price.toFixed(2)} each</div>
                    ${product.stock > 0 ? `
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${product.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${product.id}, ${item.quantity + 1})" ${item.quantity >= product.stock ? 'disabled' : ''}>+</button>
                    </div>
                    ` : ''}
                    ${stockWarning}
                    ${outOfStockMessage}
                </div>
                <div class="cart-item-actions">
                    ${product.stock > 0 ? `<div class="item-subtotal">₹${subtotal.toFixed(2)}</div>` : ''}
                    <button class="btn-remove" onclick="removeFromCart(${product.id})" style="${product.stock === 0 ? 'background: #e74c3c; font-size: 1.1rem; padding: 0.8rem 1.5rem;' : ''}">
                        ${product.stock === 0 ? '🗑️ Remove from Cart' : 'Remove'}
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    
    // Add cart summary
    const total = dataManager.getCartTotal();
    const tax = total * 0.18; // 18% GST
    const grandTotal = total + tax;
    
    // Check if any items are out of stock
    const hasOutOfStock = cart.some(item => {
        const product = dataManager.getProductById(item.productId);
        return !product || product.stock === 0 || product.stock < item.quantity;
    });
    
    cartHTML += `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            ${hasOutOfStock ? `
            <div style="background: #ffebee; padding: 1rem; border-radius: 5px; margin-bottom: 1rem; border-left: 4px solid #e74c3c;">
                <p style="color: #c62828; font-weight: 600; margin: 0;">
                    ⚠️ Some items are out of stock or have insufficient quantity. Please remove them or update quantities to proceed.
                </p>
            </div>
            ` : ''}
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
                <button class="btn-checkout" onclick="checkout()" ${hasOutOfStock ? 'disabled style="background: #95a5a6; cursor: not-allowed;"' : ''}>
                    ${hasOutOfStock ? '⚠️ Fix Cart Issues to Checkout' : 'Proceed to Checkout'}
                </button>
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
    let stockIssues = [];
    cart.forEach(item => {
        const product = dataManager.getProductById(item.productId);
        if (!product) {
            stockIssues.push(`Product ID ${item.productId} not found`);
        } else if (product.stock === 0) {
            stockIssues.push(`${product.name} is out of stock`);
        } else if (product.stock < item.quantity) {
            stockIssues.push(`${product.name}: Only ${product.stock} available (you have ${item.quantity} in cart)`);
        }
    });
    
    if (stockIssues.length > 0) {
        alert('Cannot proceed to checkout:\n\n' + stockIssues.join('\n') + '\n\nPlease remove out-of-stock items or update quantities.');
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
