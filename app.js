// ===== Configuration =====
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
const RESULTS_PER_CATEGORY = 10;
const WIKI_THUMB_SIZE = 320; // Thumbnail width in pixels

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
    prototype: (model) => `${model} prototype concept`,
    'first-series': (model) => `${model} first generation`,
    facelift: (model) => `${model} facelift`
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
            searchWikipediaImages(model, 'prototype'),
            searchWikipediaImages(model, 'first-series'),
            searchWikipediaImages(model, 'facelift')
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

/**
 * Search Wikipedia for images related to a car model and category
 * Uses Wikipedia's API to search for pages, then extracts images from those pages
 */
async function searchWikipediaImages(model, category) {
    const searchQuery = categoryQueries[category](model);
    const results = [];
    
    try {
        // First, search for Wikipedia pages matching our query
        const searchParams = new URLSearchParams({
            action: 'query',
            list: 'search',
            srsearch: searchQuery,
            format: 'json',
            origin: '*'
        });
        
        const searchResponse = await fetch(`${WIKIPEDIA_API_URL}?${searchParams}`);
        const searchData = await searchResponse.json();
        
        if (!searchData.query || !searchData.query.search) {
            console.log(`No Wikipedia pages found for: ${searchQuery}`);
            return [];
        }
        
        // Get the first few relevant pages
        const pageTitles = searchData.query.search.slice(0, 5).map(page => page.title);
        
        // For each page, get the images
        for (const title of pageTitles) {
            const images = await getImagesFromWikipediaPage(title);
            results.push(...images);
            
            // Stop if we have enough results
            if (results.length >= RESULTS_PER_CATEGORY) {
                break;
            }
        }
        
        // Return only the first RESULTS_PER_CATEGORY images
        return results.slice(0, RESULTS_PER_CATEGORY);
        
    } catch (error) {
        console.error(`Error searching Wikipedia for ${category}:`, error);
        return [];
    }
}

/**
 * Get images from a specific Wikipedia page
 */
async function getImagesFromWikipediaPage(title) {
    const images = [];
    
    try {
        // Get the page content
        const contentParams = new URLSearchParams({
            action: 'query',
            prop: 'images',
            titles: title,
            imlimit: 20,
            format: 'json',
            origin: '*'
        });
        
        const contentResponse = await fetch(`${WIKIPEDIA_API_URL}?${contentParams}`);
        const contentData = await contentResponse.json();
        
        const pages = contentData.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (!pages[pageId].images) {
            return [];
        }
        
        // Get image info for each image on the page
        const imageTitles = pages[pageId].images.map(img => img.title);
        
        // Get details for each image (URL, thumbnail, etc.)
        for (const imageTitle of imageTitles) {
            const imageInfo = await getWikipediaImageInfo(imageTitle);
            if (imageInfo) {
                images.push(imageInfo);
            }
            
            // Limit the number of images per page
            if (images.length >= 5) {
                break;
            }
        }
        
        return images;
        
    } catch (error) {
        console.error(`Error getting images from page ${title}:`, error);
        return [];
    }
}

/**
 * Get information about a specific Wikipedia image
 */
async function getWikipediaImageInfo(imageTitle) {
    try {
        const imageParams = new URLSearchParams({
            action: 'query',
            prop: 'imageinfo',
            titles: imageTitle,
            iiprop: 'url|thumburl|size|mime',
            iiurlwidth: WIKI_THUMB_SIZE,
            format: 'json',
            origin: '*'
        });
        
        const imageResponse = await fetch(`${WIKIPEDIA_API_URL}?${imageParams}`);
        const imageData = await imageResponse.json();
        
        const pages = imageData.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (!pages[pageId].imageinfo) {
            return null;
        }
        
        const imageInfo = pages[pageId].imageinfo[0];
        
        // Only include actual images (not PDFs, SVGs without raster, etc.)
        if (!imageInfo.mime || !imageInfo.mime.startsWith('image/')) {
            return null;
        }
        
        // Prefer thumbnail URL, fall back to full URL
        const imageUrl = imageInfo.thumburl || imageInfo.url;
        
        if (!imageUrl) {
            return null;
        }
        
        return {
            title: imageTitle,
            url: imageUrl,
            fullUrl: imageInfo.url,
            width: imageInfo.thumbwidth || imageInfo.width,
            height: imageInfo.thumbheight || imageInfo.height,
            description: imageTitle.replace(/\.(jpg|jpeg|png|gif|svg)$/i, '').replace(/_/g, ' ')
        };
        
    } catch (error) {
        console.error(`Error getting image info for ${imageTitle}:`, error);
        return null;
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
                    <p>Keine Bilder für <em>${categoryQueries[category](model)}</em> auf Wikipedia gefunden.</p>
                    <p>Versuchen Sie einen anderen Suchbegriff oder eine andere Schreibweise.</p>
                </div>
            `;
        } else {
            imagesContainer.innerHTML = images.map(image => `
                <div class="image-card">
                    <img 
                        src="${image.url}" 
                        alt="${image.description}" 
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >
                    <div class="image-card-info">
                        <p>${truncateText(image.description, 50)}</p>
                        <a href="${image.fullUrl || image.url}" target="_blank" rel="noopener noreferrer">
                            Bild ansehen auf Wikipedia
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
    if (!text) return 'Auto Bild';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ===== Demo Mode =====
// For testing without Wikipedia API (though Wikipedia API doesn't require a key)
function initDemoMode() {
    // Wikipedia API works without a key, but we'll add some demo images for testing
    console.log('Wikipedia API is ready. No API key required.');
}

// Initialize
initDemoMode();
