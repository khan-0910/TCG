// Checkout functionality for Pokemon Cards Store
// Handles checkout form, delivery options, and payment processing

let selectedDelivery = 'regular';
const deliveryCharges = {
    regular: 100,
    premium: 200
};

document.addEventListener('DOMContentLoaded', function() {
    // Check if cart is empty
    const cart = dataManager.getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'index.html';
        return;
    }
    
    loadCartPreview();
    updateOrderSummary();
    updateCartCount();
});

// Load cart items preview
function loadCartPreview() {
    const cart = dataManager.getCart();
    const preview = document.getElementById('cart-items-preview');
    
    let html = '';
    cart.forEach(item => {
        const product = dataManager.getProductById(item.productId);
        if (!product) return;
        
        const subtotal = product.price * item.quantity;
        
        html += `
            <div class="cart-item-mini">
                <div class="item-mini-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
                </div>
                <div class="item-mini-details">
                    <div class="item-mini-name">${product.name}</div>
                    <div class="item-mini-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="item-mini-price">₹${subtotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    preview.innerHTML = html;
}

// Update order summary
function updateOrderSummary() {
    const subtotal = dataManager.getCartTotal();
    const tax = subtotal * 0.18; // 18% GST
    const delivery = deliveryCharges[selectedDelivery];
    const total = subtotal + tax + delivery;
    
    document.getElementById('summary-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('summary-tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('summary-delivery').textContent = `₹${delivery.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `₹${total.toFixed(2)}`;
}

// Select delivery option
function selectDelivery(type) {
    selectedDelivery = type;
    
    // Update UI
    document.querySelectorAll('.delivery-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Update summary
    updateOrderSummary();
}

// Place order
function placeOrder() {
    // Validate form
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Check stock availability
    const cart = dataManager.getCart();
    let stockIssue = false;
    cart.forEach(item => {
        const product = dataManager.getProductById(item.productId);
        if (!product || product.stock < item.quantity) {
            stockIssue = true;
        }
    });
    
    if (stockIssue) {
        showToast('Some items in your cart are out of stock. Please update your cart.', 'error');
        return;
    }
    
    // Collect customer information
    const customerInfo = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        address: {
            line1: document.getElementById('address-line1').value,
            line2: document.getElementById('address-line2').value,
            landmark: document.getElementById('address-landmark').value,
            pincode: document.getElementById('address-pincode').value,
            city: document.getElementById('address-city').value,
            state: document.getElementById('address-state').value
        },
        deliveryType: selectedDelivery,
        deliveryCharge: deliveryCharges[selectedDelivery]
    };
    
    // Calculate total
    const subtotal = dataManager.getCartTotal();
    const tax = subtotal * 0.18;
    const delivery = deliveryCharges[selectedDelivery];
    const total = subtotal + tax + delivery;
    
    // Convert to paise for Razorpay
    const amountInPaise = Math.round(total * 100);
    
    // Initialize Razorpay payment
    initializeRazorpayPayment(customerInfo, amountInPaise, total);
}

// Initialize Razorpay Payment
function initializeRazorpayPayment(customerInfo, amountInPaise, totalAmount) {
    const options = {
        key: getRazorpayKeyId(),
        amount: amountInPaise, // Amount in paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.storeName,
        description: RAZORPAY_CONFIG.storeDescription,
        image: RAZORPAY_CONFIG.storeLogo,
        handler: function (response) {
            // Payment successful
            handlePaymentSuccess(response, customerInfo, totalAmount);
        },
        prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone
        },
        notes: {
            store: 'PokéCards Store',
            purchase_type: 'Pokemon Cards',
            delivery_type: customerInfo.deliveryType,
            address: `${customerInfo.address.line1}, ${customerInfo.address.city}, ${customerInfo.address.state} - ${customerInfo.address.pincode}`
        },
        theme: {
            color: RAZORPAY_CONFIG.themeColor
        },
        modal: {
            ondismiss: function() {
                showToast('Payment cancelled', 'error');
            }
        },
        config: {
            display: {
                blocks: {
                    banks: {
                        name: 'Pay via UPI or Cards',
                        instruments: [
                            {
                                method: 'upi'
                            },
                            {
                                method: 'card'
                            },
                            {
                                method: 'netbanking'
                            },
                            {
                                method: 'wallet'
                            }
                        ]
                    }
                },
                sequence: ['block.banks'],
                preferences: {
                    show_default_blocks: true
                }
            }
        }
    };
    
    const razorpay = new Razorpay(options);
    
    razorpay.on('payment.failed', function (response) {
        handlePaymentFailure(response);
    });
    
    razorpay.open();
}

// Handle successful payment
function handlePaymentSuccess(response, customerInfo, totalAmount) {
    // Add payment details to customer info
    customerInfo.date = new Date().toISOString();
    customerInfo.paymentId = response.razorpay_payment_id;
    customerInfo.paymentMethod = 'Razorpay';
    customerInfo.totalAmount = totalAmount;
    
    const result = dataManager.createOrder(customerInfo);
    
    if (result.success) {
        showToast('Payment successful! Order placed.', 'success');
        
        // Show success message
        setTimeout(() => {
            const deliveryType = customerInfo.deliveryType === 'regular' ? 'Regular (5-7 days)' : 'Premium (2-3 days)';
            const successMessage = `
🎉 Payment Successful!

Order ID: #${result.order.id}
Payment ID: ${response.razorpay_payment_id}
Amount Paid: ₹${totalAmount.toFixed(2)}

Delivery Type: ${deliveryType}
Delivery Charge: ₹${customerInfo.deliveryCharge}

Shipping Address:
${customerInfo.address.line1}
${customerInfo.address.line2 ? customerInfo.address.line2 + '\n' : ''}${customerInfo.address.landmark ? 'Near ' + customerInfo.address.landmark + '\n' : ''}${customerInfo.address.city}, ${customerInfo.address.state} - ${customerInfo.address.pincode}

Thank you, ${customerInfo.name}!
Your Pokemon cards will be shipped soon.
            `;
            
            alert(successMessage);
            
            // Redirect to store
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showToast('Order creation failed: ' + result.message, 'error');
    }
}

// Handle payment failure
function handlePaymentFailure(response) {
    console.error('Payment failed:', response.error);
    
    const errorMessage = `
Payment Failed!

Error Code: ${response.error.code}
Description: ${response.error.description}
Reason: ${response.error.reason}

Please try again or contact support.
    `;
    
    alert(errorMessage);
    showToast('Payment failed. Please try again.', 'error');
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
