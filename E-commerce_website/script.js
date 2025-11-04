
        // Event Listeners
        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screenId = item.getAttribute('data-screen');
                showScreen(screenId);
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Search functionality
        searchBar.addEventListener('click', () => {
            showScreen('search-screen');
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            performSearch(query);
        });

        // Product interactions
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-product');
                openProductModal(productId);
            });
        });

        modalClose.addEventListener('click', () => {
            productModal.classList.remove('active');
        });

        cartIcon.addEventListener('click', () => {
            showScreen('cart-screen');
        });

        notificationsIcon.addEventListener('click', () => {
            showScreen('notifications-screen');
        });

        // Close buttons for screens
        document.getElementById('search-close').addEventListener('click', () => {
            showScreen('home-screen');
        });

        document.getElementById('cart-close').addEventListener('click', () => {
            showScreen('home-screen');
        });

        document.getElementById('orders-close').addEventListener('click', () => {
            showScreen('home-screen');
        });

        document.getElementById('notifications-close').addEventListener('click', () => {
            showScreen('home-screen');
        });

        // Quantity controls
        decreaseQty.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                quantityValue.textContent = currentQuantity;
            }
        });

        increaseQty.addEventListener('click', () => {
            currentQuantity++;
            quantityValue.textContent = currentQuantity;
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.closest('.product-card').getAttribute('data-product');
                addToCart(productId, 1);
                showNotification('Product added to cart!');
            });
        });

        // Authentication
        showSignup.addEventListener('click', () => {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        });

        showLogin.addEventListener('click', () => {
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        });

        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                // In a real app, you would validate credentials with a server
                currentUser = {
                    name: "Austin David",
                    email: email
                };
                
                profileName.textContent = currentUser.name;
                profileEmail.textContent = currentUser.email;
                
                showScreen('home-screen');
                showNotification('Welcome back!');
            } else {
                showNotification('Please enter both email and password');
            }
        });

        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            if (name && email && password) {
                // In a real app, you would send this data to a server
                currentUser = {
                    name: name,
                    email: email
                };
                
                profileName.textContent = currentUser.name;
                profileEmail.textContent = currentUser.email;
                
                showScreen('home-screen');
                showNotification('Account created successfully!');
            } else {
                showNotification('Please fill in all fields');
            }
        });

        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            showScreen('auth-screen');
            showNotification('You have been logged out');
        });

        // Functions
        function showScreen(screenId) {
            screens.forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        function openProductModal(productId) {
            const product = products[productId];
            if (product) {
                modalProductName.textContent = product.name;
                modalProductPrice.textContent = `$${product.price}`;
                modalProductIcon.className = product.icon;
                modalProductDescription.textContent = product.description;
                currentQuantity = 1;
                quantityValue.textContent = currentQuantity;
                productModal.classList.add('active');
            }
        }

        function addToCart(productId, quantity) {
            const product = products[productId];
            if (product) {
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        icon: product.icon,
                        quantity: quantity
                    });
                }
                
                updateCartDisplay();
            }
        }
function updateCartDisplay() {
            // Clear cart items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.appendChild(emptyCart);
                cartTotal.textContent = '$0';
                return;
            }
            
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="cart-item-actions">
                            <div class="cart-quantity">
                                <button class="quantity-btn decrease-cart" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn increase-cart" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = `$${total}`;
            
            // Add event listeners to cart buttons
            document.querySelectorAll('.decrease-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    updateCartItemQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.increase-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    updateCartItemQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.closest('.remove-item').getAttribute('data-id');
                    removeFromCart(id);
                });
            });
        }

        function updateCartItemQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    updateCartDisplay();
                }
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay();
        }

        function performSearch(query) {
            searchResults.innerHTML = '';
            
            if (query.length === 0) {
                return;
            }
            
            const results = Object.values(products).filter(product => 
                product.name.toLowerCase().includes(query)
            );
            
            if (results.length === 0) {
                searchResults.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--gray);">No products found</p>';
                return;
            }
            
            results.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-image">
                        <i class="${product.icon}"></i>
                    </div>
                    <div class="search-result-details">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-price">$${product.price}</div>
                    </div>
                `;
                
                resultItem.addEventListener('click', () => {
                    const productId = Object.keys(products).find(key => products[key].name === product.name);
                    openProductModal(productId);
                });
                
                searchResults.appendChild(resultItem);
            });
        }

        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: fadeIn 0.3s, fadeOut 0.3s 2s forwards;
            `;
            
            document.body.appendChild(notification);
            
            // Remove notification after animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 2300);
        }

        // Add CSS for notification animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);