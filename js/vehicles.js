// js/vehicles.js
let filteredVehicles = [];
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'default';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚗 Vehicles page loaded");
    
    AOS.init({ duration: 800, once: true });
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Load vehicles
    await fetchVehiclesFromSheet();
    
    // Initialize page
    initFilters();
    initSearch();
    initSort();
    checkUrlParams();
    renderVehicles();
});

// Initialize mobile menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Initialize filters
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            applyFilters();
        });
    });
}

// Initialize search
function initSearch() {
    const searchInput = document.getElementById('live-search');
    const clearBtn = document.getElementById('clear-search');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        clearBtn.style.display = currentSearch ? 'block' : 'none';
        applyFilters();
    });
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearch = '';
            clearBtn.style.display = 'none';
            applyFilters();
        });
    }
}

// Initialize sort
function initSort() {
    const sortSelect = document.getElementById('sort-price');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters();
    });
}

// Apply filters and sort
function applyFilters() {
    let results = [...window.allVehicles];
    
    // Apply type filter
    if (currentFilter !== 'all') {
        results = results.filter(v => v.type === currentFilter);
    }
    
    // Apply search
    if (currentSearch) {
        results = results.filter(v => 
            v.name.toLowerCase().includes(currentSearch) ||
            v.year.toString().includes(currentSearch)
        );
    }
    
    // Apply sort
    switch(currentSort) {
        case 'low-high':
            results.sort((a, b) => a.price - b.price);
            break;
        case 'high-low':
            results.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            results.sort((a, b) => b.year - a.year);
            break;
        case 'oldest':
            results.sort((a, b) => a.year - b.year);
            break;
    }
    
    filteredVehicles = results;
    renderVehicles();
}

// Render vehicles
function renderVehicles() {
    const grid = document.getElementById('vehicles-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const spinner = document.getElementById('loading-spinner');
    
    if (!grid) return;
    
    if (filteredVehicles.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        resultsCount.innerHTML = 'Showing <span>0</span> vehicles';
        return;
    }
    
    noResults.style.display = 'none';
    resultsCount.innerHTML = `Showing <span>${filteredVehicles.length}</span> vehicles`;
    
    grid.innerHTML = filteredVehicles.map(vehicle => `
        <div class="vehicle-card" onclick="openVehicleModal(${vehicle.id})">
            <div class="vehicle-image">
                <img src="${vehicle.image}" alt="${vehicle.name}" loading="lazy">
                <span class="vehicle-badge ${vehicle.status.toLowerCase()}">${vehicle.status}</span>
            </div>
            <div class="vehicle-info">
                <h3 class="vehicle-name">${vehicle.name}</h3>
                <p class="vehicle-year">${vehicle.year}</p>
                <p class="vehicle-price">${formatPrice(vehicle.price)}</p>
            </div>
        </div>
    `).join('');
}

// Check URL parameters
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    
    if (type === 'Car' || type === 'Bike') {
        const tab = document.querySelector(`[data-filter="${type}"]`);
        if (tab) {
            tab.click();
        }
    }
}

// Reset all filters
window.resetAllFilters = function() {
    const searchInput = document.getElementById('live-search');
    const clearBtn = document.getElementById('clear-search');
    const sortSelect = document.getElementById('sort-price');
    
    if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    if (sortSelect) {
        sortSelect.value = 'default';
        currentSort = 'default';
    }
    
    const allTab = document.querySelector('[data-filter="all"]');
    if (allTab) {
        allTab.click();
    }
    
    filteredVehicles = [...window.allVehicles];
    renderVehicles();
};