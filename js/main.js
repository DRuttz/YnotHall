document.addEventListener('DOMContentLoaded', function() {
    // Load events from JSON
    loadEvents();

    // Load archived events
    loadArchivedEvents('data/archived-events.json');
    
    // Simulate live stream stats updates
    updateStreamStats();
    
    // Event filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            filterEvents(filter);
        });
    });
    
    // Form submissions
    document.getElementById('booking-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Booking request submitted! We will contact you shortly to confirm.');
        this.reset();
    });
    
    document.getElementById('newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thanks for subscribing to our newsletter!');
        this.reset();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

function displayEvents(events, targetElementId) {
    const eventsList = document.getElementById(targetElementId);
    eventsList.innerHTML = '';
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p>No events found.</p>';
        return;
    }

function loadEvents() {
    fetch('events.json')
        .then(response => response.json())
        .then(events => {
            // Store events in localStorage for demo purposes
            localStorage.setItem('ynot-events', JSON.stringify(events));
            displayEvents(events);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            // Try to load from localStorage if available
            const storedEvents = localStorage.getItem('ynot-events');
            if (storedEvents) {
                displayEvents(JSON.parse(storedEvents));
            } else {
                document.getElementById('events-list').innerHTML = 
                    '<p>Unable to load events at this time. Please check back later.</p>';
            }
        });
}

function displayEvents(events) {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p>No upcoming events at this time. Check back soon!</p>';
        return;
    }
    
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = `event-card ${event.type}`;
        eventCard.innerHTML = `
            <div class="event-header">
                <h3>${event.title}</h3>
                <div class="event-date">
                    <i class="far fa-calendar-alt"></i>
                    ${new Date(event.date).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
            <div class="event-body">
                <span class="event-type ${event.type}">${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                <p class="event-description">${event.description}</p>
                <div class="event-actions">
                    <span><i class="fas fa-users"></i> ${event.capacity} spots available</span>
                    <button class="btn">Book Now</button>
                </div>
            </div>
        `;
        eventsList.appendChild(eventCard);
    });
}

function filterEvents(filter) {
    const storedEvents = JSON.parse(localStorage.getItem('ynot-events'));
    if (!storedEvents) return;
    
    if (filter === 'all') {
        displayEvents(storedEvents);
    } else {
        const filteredEvents = storedEvents.filter(event => event.type === filter);
        displayEvents(filteredEvents);
    }
}

