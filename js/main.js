document.addEventListener('DOMContentLoaded', function() {
    // Load upcoming events
    loadEvents('data/events.json', 'events-list');
    
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

function loadEvents(url, targetElementId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            localStorage.setItem('ynot-events', JSON.stringify(events));
            displayEvents(events, targetElementId);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            const storedEvents = localStorage.getItem('ynot-events');
            if (storedEvents) {
                displayEvents(JSON.parse(storedEvents), targetElementId;
            } else {
                document.getElementById(targetElementId).innerHTML = 
                    '<p class="error">Unable to load events at this time. Please check back later.</p>';
            }
        });
}

function loadArchivedEvents(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            displayArchivedEvents(events);
        })
        .catch(error => {
            console.error('Error loading archived events:', error);
            document.querySelector('.archived-events').innerHTML = 
                '<p class="error">Unable to load previous events. Please try again later.</p>';
        });
}

function displayEvents(events, targetElementId) {
    const eventsList = document.getElementById(targetElementId);
    if (!eventsList) {
        console.error('Events list container not found');
        return;
    }
    
    eventsList.innerHTML = '';
    
    if (!events || events.length === 0) {
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

function displayArchivedEvents(events) {
    const container = document.querySelector('.archived-events');
    if (!container) {
        console.error('Archived events container not found');
        return;
    }
    
    container.innerHTML = '';
    
    if (!events || events.length === 0) {
        container.innerHTML = '<p>No archived events available.</p>';
        return;
    }
    
    events.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = 'archived-event';
        eventEl.innerHTML = `
            <div class="archived-event-thumbnail">
                <img src="${event.thumbnail}" alt="${event.title}" onerror="this.src='images/placeholder.jpg'">
                <a href="${event.url}" target="_blank" class="play-btn">
                    <i class="fas fa-play"></i>
                </a>
            </div>
            <div class="archived-event-info">
                <h4>${event.title}</h4>
                <div class="archived-event-meta">
                    <span>${new Date(event.date).toLocaleDateString('en-GB')}</span>
                    <span>${event.duration}</span>
                </div>
            </div>
        `;
        container.appendChild(eventEl);
    });
}

function filterEvents(filter) {
    const storedEvents = JSON.parse(localStorage.getItem('ynot-events'));
    if (!storedEvents) return;
    
    if (filter === 'all') {
        displayEvents(storedEvents, 'events-list');
    } else {
        const filteredEvents = storedEvents.filter(event => event.type === filter);
        displayEvents(filteredEvents, 'events-list');
    }
}

function updateStreamStats() {
    // Only run if we're on the live events page
    if (!document.getElementById('viewer-count')) return;
    
    // Simulate updating viewer count
    setInterval(() => {
        const viewerCount = document.getElementById('viewer-count');
        const current = parseInt(viewerCount.textContent.replace(/,/g, '')) || 1000;
        const change = Math.floor(Math.random() * 20) - 5; // Random change between -5 and +15
        const newCount = Math.max(1000, current + change); // Don't go below 1000
        viewerCount.textContent = newCount.toLocaleString();
    }, 5000);
    
    // Simulate updating comment count
    setInterval(() => {
        const commentCount = document.getElementById('comment-count');
        const current = parseInt(commentCount.textContent) || 0;
        const change = Math.floor(Math.random() * 5) + 1; // Random change between 1 and 5
        commentCount.textContent = current + change;
    }, 8000);
}
