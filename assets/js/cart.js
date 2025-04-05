document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị giỏ hàng
    displayCart();
    
    // Cập nhật tổng tiền giỏ hàng
    updateCartTotal();
    
    // Xử lý sự kiện xóa sản phẩm khỏi giỏ hàng
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart-remove')) {
            const productId = e.target.getAttribute('data-id');
            removeFromCart(productId);
        }
    });
    
    // Xử lý sự kiện cập nhật số lượng sản phẩm trong giỏ hàng
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('cart-quantity-input')) {
            const productId = e.target.getAttribute('data-id');
            const quantity = parseInt(e.target.value);
            
            if (quantity < 1) {
                e.target.value = 1;
                updateCartItemQuantity(productId, 1);
            } else {
                updateCartItemQuantity(productId, quantity);
            }
        }
    });
    
    // Xử lý sự kiện thanh toán
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart'));
            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng.');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }
    
    // Xử lý sự kiện tiếp tục mua hàng
    const continueShopping = document.querySelector('.continue-shopping');
    if (continueShopping) {
        continueShopping.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
    
    // Xử lý sự kiện hoàn tất đơn hàng trong trang thanh toán
    const orderForm = document.querySelector('.checkout-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Kiểm tra thông tin form
            const name = document.querySelector('input[name="name"]').value;
            const phone = document.querySelector('input[name="phone"]').value;
            const address = document.querySelector('input[name="address"]').value;
            
            if (!name || !phone || !address) {
                alert('Vui lòng điền đầy đủ thông tin giao hàng.');
                return;
            }
            
            // Xử lý đặt hàng
            alert('Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.');
            localStorage.setItem('cart', JSON.stringify([]));
            window.location.href = 'index.html';
        });
    }
    
    // Hiển thị thông tin giỏ hàng trong trang thanh toán
    displayCheckoutSummary();
    
    // Hàm hiển thị giỏ hàng
    function displayCart() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;
        
        const cart = JSON.parse(localStorage.getItem('cart'));
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<tr><td colspan="5" class="text-center">Giỏ hàng của bạn đang trống</td></tr>';
            return;
        }
        
        let html = '';
        cart.forEach(item => {
            html += `
                <tr>
                    <td data-label="Sản phẩm">
                        <div class="cart-product">
                            <img src="${item.image}" alt="${item.name}" class="cart-product-image">
                            <div class="cart-product-name">${item.name}</div>
                        </div>
                    </td>
                    <td data-label="Đơn giá">${formatCurrency(item.price)}</td>
                    <td data-label="Số lượng">
                        <input type="number" value="${item.quantity}" min="1" class="cart-quantity-input form-control" data-id="${item.id}">
                    </td>
                    <td data-label="Thành tiền">${formatCurrency(item.price * item.quantity)}</td>
                    <td data-label="Xóa">
                        <span class="cart-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </span>
                    </td>
                </tr>
            `;
        });
        
        cartContainer.innerHTML = html;
    }
    
    // Hàm hiển thị thông tin giỏ hàng trong trang thanh toán
    function displayCheckoutSummary() {
        const summaryContainer = document.querySelector('.checkout-items');
        if (!summaryContainer) return;
        
        const cart = JSON.parse(localStorage.getItem('cart'));
        
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="checkout-item">
                    <div>${item.name} x ${item.quantity}</div>
                    <div>${formatCurrency(item.price * item.quantity)}</div>
                </div>
            `;
        });
        
        summaryContainer.innerHTML = html;
        
        const totalElement = document.querySelector('.checkout-total span');
        if (totalElement) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalElement.textContent = formatCurrency(total);
        }
    }
    
    // Hàm xóa sản phẩm khỏi giỏ hàng
    function removeFromCart(productId) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const updatedCart = cart.filter(item => item.id !== productId);
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        displayCart();
        updateCartTotal();
        
        // Cập nhật số lượng sản phẩm hiển thị bên cạnh icon giỏ hàng
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    function updateCartItemQuantity(productId, quantity) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Cập nhật thành tiền
            const priceCell = document.querySelector(`input[data-id="${productId}"]`).closest('tr').querySelector('td:nth-child(4)');
            priceCell.textContent = formatCurrency(cart[itemIndex].price * quantity);
            
            updateCartTotal();
            
            // Cập nhật số lượng sản phẩm hiển thị bên cạnh icon giỏ hàng
            const cartCountElement = document.querySelector('.cart-count');
            if (cartCountElement) {
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCountElement.textContent = totalItems;
            }
        }
    }
    
    // Hàm cập nhật tổng tiền giỏ hàng
    function updateCartTotal() {
        const subtotalElement = document.querySelector('.summary-subtotal span');
        const totalElement = document.querySelector('.summary-total span');
        
        if (!subtotalElement || !totalElement) return;
        
        const cart = JSON.parse(localStorage.getItem('cart'));
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        subtotalElement.textContent = formatCurrency(subtotal);
        totalElement.textContent = formatCurrency(subtotal);
    }
    
    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
});