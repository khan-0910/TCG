// Order Management functionality
// Handles order display, status updates, and tracking

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Check if logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'admin.html';
        return;
    }
    
    loadOrders();
    updateStatistics();
    updateCartCount();
});

// Load and display orders
function loadOrders() {
    const orders = dataManager.getOrders();
    const grid = document.getElementById('orders-grid');
    const noOrders = document.getElementById('no-orders');
    
    if (orders.length === 0) {
        grid.style.display = 'none';
        noOrders.style.display = 'block';
        return;
    }
    
    // Filter orders
    let filteredOrders = orders;
    if (currentFilter !== 'all') {
        filteredOrders = orders.filter(order => order.status === currentFilter);
    }
    
    if (filteredOrders.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No orders with this status</p>';
        return;
    }
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    grid.style.display = 'grid';
    noOrders.style.display = 'none';
    grid.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const card = createOrderCard(order);
        grid.appendChild(card);
    });
}

// Create order card
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = `order-card ${order.status}`;
    
    const date = new Date(order.date);
    const formattedDate = date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const statusClass = `status-${order.status}`;
    const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    
    // Calculate total items
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Get delivery type
    const deliveryType = order.customer.deliveryType === 'premium' ? 'Premium' : 'Regular';
    const deliveryCharge = order.customer.deliveryCharge || 0;
    
    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">Order #${order.id}</div>
                <div class="order-date">${formattedDate}</div>
            </div>
            <div class="order-status ${statusClass}">${statusText}</div>
        </div>
        
        <div class="order-details">
            <div class="detail-group">
                <div class="detail-label">Customer Name</div>
                <div class="detail-value">${order.customer.name}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Phone</div>
                <div class="detail-value">${order.customer.phone}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Email</div>
                <div class="detail-value">${order.customer.email}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Payment ID</div>
                <div class="detail-value">${order.customer.paymentId}</div>
            </div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Shipping Address</div>
            <div class="detail-value">
                ${order.customer.address.line1}<br>
                ${order.customer.address.line2 ? order.customer.address.line2 + '<br>' : ''}
                ${order.customer.address.landmark ? 'Near ' + order.customer.address.landmark + '<br>' : ''}
                ${order.customer.address.city}, ${order.customer.address.state} - ${order.customer.address.pincode}
            </div>
        </div>
        
        <div class="order-items">
            <div class="detail-label">Items (${totalItems})</div>
            ${order.items.map(item => `
                <div class="order-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="order-details">
            <div class="detail-group">
                <div class="detail-label">Delivery Type</div>
                <div class="detail-value">${deliveryType} (₹${deliveryCharge})</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Total Amount</div>
                <div class="detail-value" style="font-size: 1.2rem; font-weight: bold; color: var(--primary-color);">₹${order.total.toFixed(2)}</div>
            </div>
        </div>
        
        <div class="order-actions">
            ${getActionButtons(order)}
            <button class="btn-action btn-view" onclick="viewOrderDetails(${order.id})">View Full Details</button>
        </div>
    `;
    
    return card;
}

// Get action buttons based on status
function getActionButtons(order) {
    switch(order.status) {
        case 'pending':
            return `<button class="btn-action btn-pack" onclick="updateOrderStatus(${order.id}, 'packed')">✓ Mark as Packed</button>`;
        case 'packed':
            return `<button class="btn-action btn-ship" onclick="updateOrderStatus(${order.id}, 'shipped')">✓ Mark as Shipped</button>`;
        case 'shipped':
            return `<button class="btn-action btn-deliver" onclick="updateOrderStatus(${order.id}, 'delivered')">✓ Mark as Delivered</button>`;
        case 'delivered':
            return `<span style="color: #27ae60; font-weight: 600;">✓ Completed</span>`;
        default:
            return '';
    }
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const statusNames = {
        'packed': 'Packed',
        'shipped': 'Shipped',
        'delivered': 'Delivered'
    };
    
    if (!confirm(`Mark this order as ${statusNames[newStatus]}?`)) {
        return;
    }
    
    const result = dataManager.updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
        showToast(`Order marked as ${statusNames[newStatus]}!`, 'success');
        loadOrders();
        updateStatistics();
    } else {
        showToast('Failed to update order status', 'error');
    }
}

// Filter orders
function filterOrders(status) {
    currentFilter = status;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadOrders();
}

// View order details in modal
function viewOrderDetails(orderId) {
    const order = dataManager.getOrderById(orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-modal');
    const details = document.getElementById('modal-order-details');
    
    const date = new Date(order.date);
    const formattedDate = date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const statusClass = `status-${order.status}`;
    const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    
    const deliveryType = order.customer.deliveryType === 'premium' ? 'Premium Delivery' : 'Regular Delivery';
    const deliveryCharge = order.customer.deliveryCharge || 0;
    
    // Calculate subtotal and tax
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    
    details.innerHTML = `
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 1rem;">Order #${order.id}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <strong>Date:</strong> ${formattedDate}
                </div>
                <div>
                    <strong>Status:</strong> <span class="order-status ${statusClass}">${statusText}</span>
                </div>
                <div>
                    <strong>Payment ID:</strong> ${order.customer.paymentId}
                </div>
                <div>
                    <strong>Payment Method:</strong> ${order.customer.paymentMethod}
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h4>Customer Information</h4>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-top: 0.5rem;">
                <p><strong>Name:</strong> ${order.customer.name}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h4>Shipping Address</h4>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-top: 0.5rem;">
                ${order.customer.address.line1}<br>
                ${order.customer.address.line2 ? order.customer.address.line2 + '<br>' : ''}
                ${order.customer.address.landmark ? 'Near ' + order.customer.address.landmark + '<br>' : ''}
                ${order.customer.address.city}, ${order.customer.address.state} - ${order.customer.address.pincode}
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h4>Order Items</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                        <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
                        <th style="padding: 0.75rem; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                        <th style="padding: 0.75rem; text-align: right; border-bottom: 2px solid #dee2e6;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td style="padding: 0.75rem; border-bottom: 1px solid #dee2e6;">${item.name}</td>
                            <td style="padding: 0.75rem; text-align: center; border-bottom: 1px solid #dee2e6;">${item.quantity}</td>
                            <td style="padding: 0.75rem; text-align: right; border-bottom: 1px solid #dee2e6;">₹${item.price.toFixed(2)}</td>
                            <td style="padding: 0.75rem; text-align: right; border-bottom: 1px solid #dee2e6;">₹${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px;">
            <h4 style="margin-bottom: 1rem;">Order Summary</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal:</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Tax (18% GST):</span>
                <span>₹${tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${deliveryType}:</span>
                <span>₹${deliveryCharge.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 1rem; border-top: 2px solid #dee2e6; font-size: 1.2rem; font-weight: bold;">
                <span>Total:</span>
                <span style="color: var(--primary-color);">₹${order.total.toFixed(2)}</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; text-align: center;">
            <button class="btn-action btn-view" onclick="printOrder(${order.id})" style="margin-right: 0.5rem;">🖨️ Print Order</button>
            <button class="btn-action btn-view" onclick="closeModal()">Close</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
}

// Print order
function printOrder(orderId) {
    const order = dataManager.getOrderById(orderId);
    if (!order) return;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    
    const date = new Date(order.date);
    const formattedDate = date.toLocaleString('en-IN');
    
    const deliveryType = order.customer.deliveryType === 'premium' ? 'Premium Delivery' : 'Regular Delivery';
    const deliveryCharge = order.customer.deliveryCharge || 0;
    
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Order #${order.id} - Froakie_TCG's Store</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #e74c3c; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background: #f8f9fa; }
                .total { font-size: 1.2rem; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>🐸 Froakie_TCG's Store</h1>
            <h2>Order #${order.id}</h2>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Payment ID:</strong> ${order.customer.paymentId}</p>
            
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            
            <h3>Shipping Address</h3>
            <p>
                ${order.customer.address.line1}<br>
                ${order.customer.address.line2 ? order.customer.address.line2 + '<br>' : ''}
                ${order.customer.address.landmark ? 'Near ' + order.customer.address.landmark + '<br>' : ''}
                ${order.customer.address.city}, ${order.customer.address.state} - ${order.customer.address.pincode}
            </p>
            
            <h3>Order Items</h3>
            <table>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                </tr>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                        <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>
            
            <table>
                <tr>
                    <td>Subtotal:</td>
                    <td style="text-align: right;">₹${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Tax (18% GST):</td>
                    <td style="text-align: right;">₹${tax.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>${deliveryType}:</td>
                    <td style="text-align: right;">₹${deliveryCharge.toFixed(2)}</td>
                </tr>
                <tr class="total">
                    <td>Total:</td>
                    <td style="text-align: right;">₹${order.total.toFixed(2)}</td>
                </tr>
            </table>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Update statistics
function updateStatistics() {
    const orders = dataManager.getOrders();
    
    document.getElementById('stat-total-orders').textContent = orders.length;
    document.getElementById('stat-pending').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('stat-packed').textContent = orders.filter(o => o.status === 'packed').length;
    document.getElementById('stat-shipped').textContent = orders.filter(o => o.status === 'shipped').length;
    document.getElementById('stat-delivered').textContent = orders.filter(o => o.status === 'delivered').length;
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin.html';
    }
}

// Update cart count
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('order-modal');
    if (event.target === modal) {
        closeModal();
    }
}
