// Header scroll behavior
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});

// Action buttons functionality
const actionButtons = document.querySelectorAll('.header__action-btn');

actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Add your functionality here
        console.log(`${button.classList[1]} clicked`);
    });
});

// Featured Products Data
const featuredProducts = [
    {
        id: 1,
        name: 'Château Margaux 2015',
        category: 'Red Wine',
        price: 599.99,
        rating: 4.9,
        image: 'https://placehold.co/300x400/8B0000/FFF?text=Wine+1'
    },
    {
        id: 2,
        name: 'Dom Pérignon Vintage',
        category: 'Champagne',
        price: 249.99,
        rating: 4.8,
        image: 'https://placehold.co/300x400/8B0000/FFF?text=Wine+2'
    },
    {
        id: 3,
        name: 'Cloudy Bay Sauvignon Blanc',
        category: 'White Wine',
        price: 89.99,
        rating: 4.7,
        image: 'https://placehold.co/300x400/8B0000/FFF?text=Wine+3'
    },
    {
        id: 4,
        name: 'Barolo Riserva DOCG',
        category: 'Red Wine',
        price: 129.99,
        rating: 4.6,
        image: 'https://placehold.co/300x400/8B0000/FFF?text=Wine+4'
    }
];

// Get unique categories from products
const getUniqueCategories = () => {
    const categories = featuredProducts.map(product => product.category);
    return ['All', ...new Set(categories)];
};

// Create category filters
const createCategoryFilters = () => {
    const categories = getUniqueCategories();
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'products__filters';
    
    categories.forEach(category => {
        const filterBtn = document.createElement('button');
        filterBtn.className = category === 'All' ? 
            'products__filter-btn products__filter-btn--active' : 
            'products__filter-btn';
        filterBtn.textContent = category;
        filterBtn.dataset.category = category;
        
        filterBtn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.products__filter-btn').forEach(btn => {
                btn.classList.remove('products__filter-btn--active');
            });
            
            // Add active class to clicked button
            filterBtn.classList.add('products__filter-btn--active');
            
            // Filter products
            filterProducts(category);
        });
        
        filtersContainer.appendChild(filterBtn);
    });
    
    // Insert filters before the products grid
    const productsSection = document.querySelector('.products');
    const productsHeading = document.querySelector('.products__heading');
    productsSection.insertBefore(filtersContainer, productsHeading.nextSibling);
};

// Filter products by category
const filterProducts = (category) => {
    const productsGrid = document.querySelector('.products__grid');
    productsGrid.innerHTML = ''; // Clear current products
    
    const filteredProducts = category === 'All' ? 
        featuredProducts : 
        featuredProducts.filter(product => product.category === category);
    
    if (filteredProducts.length === 0) {
        const noProducts = document.createElement('div');
        noProducts.className = 'products__no-results';
        noProducts.textContent = 'No products found in this category.';
        productsGrid.appendChild(noProducts);
    } else {
        renderProducts(filteredProducts);
    }
};

// Render Featured Products
const renderProducts = (products = featuredProducts) => {
    const productsGrid = document.querySelector('.products__grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Generate star rating HTML
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(product.rating)) {
                starsHTML += '<span class="product-card__star product-card__star--filled">★</span>';
            } else if (i - 0.5 <= product.rating) {
                starsHTML += '<span class="product-card__star product-card__star--half">★</span>';
            } else {
                starsHTML += '<span class="product-card__star">☆</span>';
            }
        }
        
        productCard.innerHTML = `
            <div class="product-card__image-container">
                <img src="${product.image}" alt="${product.name}" class="product-card__image">
                <button class="product-card__favorite-btn">
                    <svg class="icon icon--heart" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 21C12 21 3 16 3 9C3 5.5 5.5 3 9 3C10.5 3 11.5 4 12 5C12.5 4 13.5 3 15 3C18.5 3 21 5.5 21 9C21 16 12 21 12 21Z"/>
                    </svg>
                </button>
            </div>
            <div class="product-card__content">
                <span class="product-card__category">${product.category}</span>
                <h3 class="product-card__title">${product.name}</h3>
                <div class="product-card__rating">
                    ${starsHTML}
                    <span class="product-card__rating-text">${product.rating}</span>
                </div>
                <div class="product-card__price-row">
                    <span class="product-card__price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn--small btn--primary product-card__add-btn">Add to Cart</button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
};

// Initialize product rendering when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create category filters first
    createCategoryFilters();
    
    // Then render all products (default)
    renderProducts();
    
    // Add event listeners for product card buttons
    const setupProductCardListeners = () => {
        const favoriteButtons = document.querySelectorAll('.product-card__favorite-btn');
        const addToCartButtons = document.querySelectorAll('.product-card__add-btn');
        
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                button.classList.toggle('product-card__favorite-btn--active');
            });
        });
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                const productTitle = productCard.querySelector('.product-card__title').textContent;
                console.log(`Added ${productTitle} to cart`);
                
                // Animation effect
                button.textContent = 'Added!';
                setTimeout(() => {
                    button.textContent = 'Add to Cart';
                }, 1500);
            });
        });
    };
    
    // Initial setup of listeners
    setTimeout(setupProductCardListeners, 100);
    
    // Create a MutationObserver to watch for changes in the products grid
    // This ensures event listeners are added even after filtering
    const productsGrid = document.querySelector('.products__grid');
    const observer = new MutationObserver(() => {
        setupProductCardListeners();
    });
    
    // Start observing the products grid for changes
    observer.observe(productsGrid, { childList: true });
});

<script>
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.header__nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
</script>
