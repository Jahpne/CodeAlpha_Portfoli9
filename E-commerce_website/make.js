 // Product data
        const products = {
            1: {
                name: "Smartphone X Pro",
                price: 899,
                originalPrice: 999,
                icon: "fas fa-mobile-alt",
                description: "The latest flagship smartphone with advanced camera system, 5G connectivity, and all-day battery life. Features a 6.7-inch OLED display and powerful processor for seamless performance."
            },
            2: {
                name: "Wireless Headphones",
                price: 199,
                originalPrice: null,
                icon: "fas fa-headphones",
                description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and superior sound quality. Comfortable over-ear design perfect for long listening sessions."
            },
            3: {
                name: "Ultrabook Pro",
                price: 1299,
                originalPrice: null,
                icon: "fas fa-laptop",
                description: "Sleek and powerful ultrabook with 13-inch Retina display, latest processor, and all-day battery. Perfect for professionals and creatives on the go."
            },
            4: {
                name: "Smart Watch 3",
                price: 299,
                originalPrice: 349,
                icon: "fas fa-smartwatch",
                description: "Advanced smartwatch with health monitoring, GPS, and smartphone connectivity. Track your workouts, receive notifications, and more with this stylish wearable."
            },
            5: {
                name: "Tablet Mini",
                price: 499,
                originalPrice: null,
                icon: "fas fa-tablet-alt",
                description: "Compact tablet with 8-inch display, perfect for reading, browsing, and light productivity. Features long battery life and responsive touch interface."
            },
            6: {
                name: "DSLR Camera",
                price: 799,
                originalPrice: null,
                icon: "fas fa-camera",
                description: "Professional DSLR camera with 24MP sensor, 4K video recording, and interchangeable lenses. Capture stunning photos and videos with this powerful camera."
            }
        };

        // App state
        let cart = [];
        let currentQuantity = 1;
        let currentUser = null;

        // DOM Elements
        const screens = document.querySelectorAll('.screen');
        const navItems = document.querySelectorAll('.nav-item');
        const productModal = document.getElementById('product-modal');
        const modalClose = document.getElementById('modal-close');
        const cartIcon = document.getElementById('cart-icon');
        const notificationsIcon = document.getElementById('notifications-icon');
        const searchBar = document.getElementById('search-bar');
        const productCards = document.querySelectorAll('.product-card');
        const modalProductName = document.getElementById('modal-product-name');
        const modalProductPrice = document.getElementById('modal-product-price');
        const modalProductIcon = document.getElementById('modal-product-icon');
        const modalProductDescription = document.getElementById('modal-product-description');
        const decreaseQty = document.getElementById('decrease-qty');
        const increaseQty = document.getElementById('increase-qty');
        const quantityValue = document.getElementById('quantity-value');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyCart = document.getElementById('empty-cart');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const logoutBtn = document.getElementById('logout-btn');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const showSignup = document.getElementById('show-signup');
        const showLogin = document.getElementById('show-login');
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');