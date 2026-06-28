// ===== Configuration =====
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash API key
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const RESULTS_PER_CATEGORY = 10;

// ===== DOM Elements =====
const carModelInput = document.getElementById('carModel');
const searchBtn = document.getElementById('searchBtn');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const resultsElement = document.getElementById('results');
const searchTermElement = document.getElementById('searchTerm');
const navButtons = document.querySelectorAll('.nav-btn');
const categoryGalleries = document.querySelectorAll('.category-gallery');

// ===== Search Queries =====
const categoryQueries = {
    prototype: (model) => `${model} prototype concept car`,
    'first-series': (model) => `${model} first generation original series production`,
    facelift: (model) => `${model} facelift refresh redesign update`
};

// ===== Event Listeners =====
searchBtn.addEventListener('click', handleSearch);
carModelInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Navigation between categories
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active button
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active gallery
        categoryGalleries.forEach(gallery => {
            gallery.classList.remove('active');
            if (gallery.id === category) {
                gallery.classList.add('active');
            }
        });
    });
});

// ===== Main Functions =====
async function handleSearch() {
    const model = carModelInput.value.trim();
    
    if (!model) {
        showError('Bitte geben Sie ein Automodell ein.');
        return;
    }

    // Clear previous results and errors
    clearResults();
    hideError();
    showLoading();
    
    try {
        // Search for all categories in parallel
        const [prototypeResults, firstSeriesResults, faceliftResults] = await Promise.all([
            searchImages(model, 'prototype'),
            searchImages(model, 'first-series'),
            searchImages(model, 'facelift')
        ]);
        
        // Display results
        displayResults(model, {
            prototype: prototypeResults,
            'first-series': firstSeriesResults,
            facelift: faceliftResults
        });
        
    } catch (error) {
        console.error('Error searching images:', error);
        showError('Es ist ein Fehler bei der Suche aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
        hideLoading();
    }
}

async function searchImages(model, category) {
    const query = categoryQueries[category](model);
    const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=${RESULTS_PER_CATEGORY}&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
        
    } catch (error) {
        console.error(`Error searching ${category}:`, error);
        return [];
    }
}

function displayResults(model, results) {
    searchTermElement.textContent = model;
    resultsElement.classList.remove('hidden');
    
    // Display results for each category
    for (const [category, images] of Object.entries(results)) {
        const gallery = document.getElementById(category);
        const imagesContainer = document.getElementById(`${category}-images`);
        
        if (images.length === 0) {
            imagesContainer.innerHTML = `
                <div class="empty-state">
                    <p>Keine Bilder für <em>${categoryQueries[category](model)}</em> gefunden.</p>
                    <p>Versuchen Sie einen anderen Suchbegriff.</p>
                </div>
            `;
        } else {
            imagesContainer.innerHTML = images.map(image => `
                <div class="image-card">
                    <img 
                        src="${image.urls.small}" 
                        alt="${image.alt_description || 'Auto Bild'}" 
                        loading="lazy"
                    >
                    <div class="image-card-info">
                        <p>${truncateText(image.alt_description || 'Auto Bild', 50)}</p>
                        <a href="${image.links.html}?utm_source=auto_bildersuche&utm_medium=referral" target="_blank">
                            Foto ansehen auf Unsplash
                        </a>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Show first category by default
    categoryGalleries.forEach(gallery => {
        gallery.classList.remove('active');
    });
    document.getElementById('prototype').classList.add('active');
    
    // Update nav buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.nav-btn[data-category="prototype"]').classList.add('active');
}

// ===== Helper Functions =====
function showLoading() {
    loadingElement.classList.remove('hidden');
}

function hideLoading() {
    loadingElement.classList.add('hidden');
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError() {
    errorElement.classList.add('hidden');
}

function clearResults() {
    resultsElement.classList.add('hidden');
    // Clear all image containers
    document.querySelectorAll('.images-grid').forEach(container => {
        container.innerHTML = '';
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ===== Demo Mode (for testing without API key) =====
// If no API key is provided, use demo mode with placeholder images
function initDemoMode() {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
        console.log('Running in demo mode. Add your Unsplash API key to enable real searches.');
        
        // Override search function for demo mode
        window.searchImages = async function(model, category) {
            // Return mock data for demo
            const mockImages = [
                {
                    urls: { small: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400' },
                    alt_description: `${model} ${category} view 1`,
                    links: { html: 'https://unsplash.com/photos/example1' }
                },
                {
                    urls: { small: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' },
                    alt_description: `${model} ${category} view 2`,
                    links: { html: 'https://unsplash.com/photos/example2' }
                },
                {
                    urls: { small: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400' },
                    alt_description: `${model} ${category} view 3`,
                    links: { html: 'https://unsplash.com/photos/example3' }
                }
            ];
            
            // Return different number of images for each category to simulate real results
            const count = Math.min(3 + Math.floor(Math.random() * 4), 10);
            return mockImages.slice(0, count);
        };
    }
}

// Initialize demo mode
initDemoMode();
