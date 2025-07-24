document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle - fixed with proper class names and event handling
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    
    if (menuToggle && navUl) {
        // Use click and touch events for better mobile support
        menuToggle.addEventListener('click', handleMenuToggle);
        menuToggle.addEventListener('touchstart', handleMenuToggle);
        
        function handleMenuToggle(e) {
            e.preventDefault();
            navUl.classList.toggle('active');
            // Toggle aria-expanded for accessibility
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
        }
        
        // Close menu when clicking a link - fixed event listener
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Initialize mobile filters - improved with null checks
    initMobileFilters();
    
    // Load content
    loadEvents('data/events.json', 'events-list');
    loadArchivedEvents('data/archived-events.json');
    updateStreamStats();
    
    // Event filtering - fixed with proper mobile/desktop detection
    function setupEventFilters() {
        if (window.innerWidth < 768) {
            // Mobile filter setup is handled in initMobileFilters()
        } else {
            // Desktop filter buttons
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                // Use both click and touch events
                button.addEventListener('click', handleFilterClick);
                button.addEventListener('touchstart', handleFilterClick);
                
                function handleFilterClick(e) {
                    e.preventDefault();
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const filter = button.getAttribute('data-filter');
                    filterEvents(filter);
                }
            });
        }
    }
    setupEventFilters();
    
    // Form submissions - fixed with proper mobile support
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Use setTimeout to ensure alert shows after any mobile UI changes
            setTimeout(() => {
                alert('Booking request submitted! We will contact you shortly to confirm.');
                this.reset();
            }, 100);
        });
    }
    
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            setTimeout(() => {
                alert('Thanks for subscribing to our newsletter!');
                this.reset();
            }, 100);
        });
    }
    
    // Smooth scrolling - fixed for mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                if (navUl) navUl.classList.remove('active');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Load mobile-specific assets
    loadMobileAssets();
    
    // Handle window resize - debounced for performance
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initMobileFilters();
            setupEventFilters();
            loadMobileAssets();
        }, 250);
    });
});

// Rest of your functions remain the same, but with added null checks
function initMobileFilters() {
    if (window.innerWidth < 768) {
        const filterContainer = document.querySelector('.event-filters');
        if (filterContainer && !filterContainer.querySelector('.mobile-filter')) {
            // Save any existing filter buttons
            const existingButtons = filterContainer.innerHTML;
            filterContainer.innerHTML = `
                <select class="mobile-filter">
                    <option value="all">All Events</option>
                    <option value="tournament">Tournaments</option>
                    <option value="league">Leagues</option>
                    <option value="social">Social Events</option>
                </select>
                <div class="filter-buttons" style="display:none">${existingButtons}</div>
            `;
            
            const mobileFilter = filterContainer.querySelector('.mobile-filter');
            if (mobileFilter) {
                mobileFilter.addEventListener('change', function() {
                    filterEvents(this.value);
                });
            }
        }
    } else {
        // Show desktop filter buttons if hidden
        const hiddenButtons = document.querySelector('.filter-buttons');
        if (hiddenButtons) {
            const filterContainer = hiddenButtons.parentElement;
            filterContainer.innerHTML = hiddenButtons.innerHTML;
            hiddenButtons.remove();
        }
    }
}

// Add touch event support to all button-like elements
function enhanceTouchElements() {
    document.querySelectorAll('.btn, button, [role="button"]').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('active');
        });
        button.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
}

// Call this at the end of your DOMContentLoaded event
enhanceTouchElements();
