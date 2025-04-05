document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo giỏ hàng nếu chưa tồn tại
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartCount();
    
    // Xử lý sự kiện tìm kiếm
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.trim();
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // Xử lý sự kiện thêm sản phẩm vào giỏ hàng từ trang chủ và trang danh sách sản phẩm
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCategory = this.getAttribute('data-category');
            
            // Lấy thông tin sản phẩm
            fetch(`data/${productCategory === 'hat-giong' ? 'seeds' : 'fertilizers'}.json`)
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        addToCart(product, 1);
                        showNotification('Đã thêm sản phẩm vào giỏ hàng');
                    }
                });
        });
    });
    
    // Xử lý sự kiện thêm sản phẩm vào giỏ hàng từ trang chi tiết sản phẩm
    const addToCartDetail = document.querySelector('.add-to-cart-btn');
    if (addToCartDetail) {
        addToCartDetail.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCategory = this.getAttribute('data-category');
            const quantity = parseInt(document.querySelector('.quantity-input input').value);
            
            // Lấy thông tin sản phẩm
            fetch(`data/${productCategory === 'hat-giong' ? 'seeds' : 'fertilizers'}.json`)
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        addToCart(product, quantity);
                        showNotification('Đã thêm sản phẩm vào giỏ hàng');
                    }
                });
        });
    }
    
    // Xử lý sự kiện tăng giảm số lượng sản phẩm trong trang chi tiết
    const quantityButtons = document.querySelectorAll('.quantity-input button');
    if (quantityButtons.length > 0) {
        quantityButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.closest('.quantity-input').querySelector('input');
                let value = parseInt(input.value);
                
                if (this.classList.contains('minus')) {
                    value = value > 1 ? value - 1 : 1;
                } else {
                    value += 1;
                }
                
                input.value = value;
            });
        });
    }
    
    // Lấy tham số từ URL
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // Hàm thêm sản phẩm vào giỏ hàng
    function addToCart(product, quantity) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            cart.push({
                id: product.id,
                name: product.name,
                price: product.sale_price || product.price,
                image: product.image,
                category: product.category,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Hàm hiển thị thông báo
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }
});