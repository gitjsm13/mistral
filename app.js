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
// More specific queries that focus on the exact model
const categoryQueries = {
    prototype: (model) => `${model} prototype concept car`,
    'first-series': (model) => `${model} first generation original model`,
    facelift: (model) => `${model} facelift model update`
};

// Common car model name mappings for better search results
const modelMappings = {
    // German to English mappings
    'VW': 'Volkswagen',
    'VW Golf': 'Volkswagen Golf',
    'VW Passat': 'Volkswagen Passat',
    'VW Polo': 'Volkswagen Polo',
    'BMW 3er': 'BMW 3 Series',
    'BMW 5er': 'BMW 5 Series',
    'BMW 7er': 'BMW 7 Series',
    'Mercedes C-Klasse': 'Mercedes-Benz C-Class',
    'Mercedes E-Klasse': 'Mercedes-Benz E-Class',
    'Mercedes S-Klasse': 'Mercedes-Benz S-Class',
    'Audi A3': 'Audi A3',
    'Audi A4': 'Audi A4',
    'Audi A6': 'Audi A6',
    'Audi A8': 'Audi A8',
    'Opel Astra': 'Opel Astra',
    'Opel Corsa': 'Opel Corsa',
    'Opel Insignia': 'Opel Insignia',
    // Add more mappings as needed
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

    // Map the model name if needed
    const mappedModel = modelMappings[model] || model;

    // Clear previous results and errors
    clearResults();
    hideError();
    showLoading();
    
    try {
        // Search for all categories in parallel
        const [prototypeResults, firstSeriesResults, faceliftResults] = await Promise.all([
            searchWikipediaImages(mappedModel, 'prototype'),
            searchWikipediaImages(mappedModel, 'first-series'),
            searchWikipediaImages(mappedModel, 'facelift')
        ]);
        
        // Display results
        displayResults(mappedModel, {
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
 * Search Wikipedia for images related to a specific car model and category
 * This version is more specific and tries to find the exact model page
 */
async function searchWikipediaImages(model, category) {
    const results = [];
    
    try {
        // First, try to find the exact model page
        const exactPageTitle = await findExactModelPage(model);
        
        if (exactPageTitle) {
            // If we found an exact page, get images from it with category-specific filtering
            const categoryImages = await getImagesFromWikipediaPageWithFilter(
                exactPageTitle, 
                category,
                model
            );
            results.push(...categoryImages);
        }
        
        // If we don't have enough results, try a broader search
        if (results.length < RESULTS_PER_CATEGORY) {
            const searchQuery = categoryQueries[category](model);
            const additionalImages = await searchWikipediaWithQuery(searchQuery, model);
            results.push(...additionalImages);
        }
        
        // Return only the first RESULTS_PER_CATEGORY images
        return results.slice(0, RESULTS_PER_CATEGORY);
        
    } catch (error) {
        console.error(`Error searching Wikipedia for ${category}:`, error);
        return [];
    }
}

/**
 * Try to find the exact Wikipedia page for a car model
 */
async function findExactModelPage(model) {
    try {
        // Try different variations of the model name
        const variations = generateModelVariations(model);
        
        for (const variation of variations) {
            const page = await checkWikipediaPageExists(variation);
            if (page) {
                return page;
            }
        }
        
        return null;
        
    } catch (error) {
        console.error('Error finding exact model page:', error);
        return null;
    }
}

/**
 * Generate different variations of a model name for searching
 */
function generateModelVariations(model) {
    const variations = [model];
    
    // Add "(car)" suffix
    variations.push(`${model} (car)`);
    
    // Add "automobile" suffix
    variations.push(`${model} automobile`);
    
    // Replace spaces with underscores
    variations.push(model.replace(/\s+/g, '_'));
    
    // Add "model" suffix
    variations.push(`${model} model`);
    
    // For German models, try English versions
    if (model.includes('er')) {
        variations.push(model.replace(/er$/, ' Series'));
    }
    
    if (model.includes('Klasse')) {
        variations.push(model.replace(/Klasse/, 'Class'));
    }
    
    return [...new Set(variations)]; // Remove duplicates
}

/**
 * Check if a Wikipedia page exists
 */
async function checkWikipediaPageExists(title) {
    try {
        const params = new URLSearchParams({
            action: 'query',
            titles: title,
            format: 'json',
            origin: '*'
        });
        
        const response = await fetch(`${WIKIPEDIA_API_URL}?${params}`);
        const data = await response.json();
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        // If page exists and is not missing
        if (pageId !== '-1' && !pages[pageId].missing) {
            return title;
        }
        
        return null;
        
    } catch (error) {
        console.error(`Error checking page ${title}:`, error);
        return null;
    }
}

/**
 * Get images from a Wikipedia page with filtering for the specific model
 */
async function getImagesFromWikipediaPageWithFilter(pageTitle, category, model) {
    const images = [];
    
    try {
        // Get the page content
        const contentParams = new URLSearchParams({
            action: 'query',
            prop: 'images',
            titles: pageTitle,
            imlimit: 50,
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
        
        // Filter and get details for relevant images
        for (const imageTitle of imageTitles) {
            // Skip non-image files
            if (!isRelevantImage(imageTitle, model, category)) {
                continue;
            }
            
            const imageInfo = await getWikipediaImageInfo(imageTitle);
            if (imageInfo) {
                images.push(imageInfo);
            }
            
            // Limit the number of images per page
            if (images.length >= RESULTS_PER_CATEGORY) {
                break;
            }
        }
        
        return images;
        
    } catch (error) {
        console.error(`Error getting images from page ${pageTitle}:`, error);
        return [];
    }
}

/**
 * Check if an image title is relevant for our search
 */
function isRelevantImage(imageTitle, model, category) {
    const lowerImageTitle = imageTitle.toLowerCase();
    const lowerModel = model.toLowerCase();
    
    // Skip non-image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const hasImageExtension = imageExtensions.some(ext => lowerImageTitle.endsWith(ext));
    
    if (!hasImageExtension) {
        return false;
    }
    
    // Check if the image title contains the model name
    const modelKeywords = lowerModel.split(/[\s\-\_]/);
    const hasModelKeyword = modelKeywords.some(keyword => 
        lowerImageTitle.includes(keyword) && keyword.length > 2
    );
    
    // For category-specific filtering
    const categoryKeywords = {
        prototype: ['prototype', 'concept', 'show car', 'motor show', 'auto show'],
        'first-series': ['first', 'original', 'debut', 'launch', 'introduction'],
        facelift: ['facelift', 'refresh', 'update', 'restyle', 'mid-cycle']
    };
    
    const categoryTerms = categoryKeywords[category] || [];
    const hasCategoryTerm = categoryTerms.some(term => 
        lowerImageTitle.includes(term)
    );
    
    // Image is relevant if it contains model name or category term
    return hasModelKeyword || hasCategoryTerm;
}

/**
 * Search Wikipedia with a specific query and filter for the model
 */
async function searchWikipediaWithQuery(query, model) {
    const results = [];
    
    try {
        const searchParams = new URLSearchParams({
            action: 'query',
            list: 'search',
            srsearch: query,
            srlimit: 10,
            format: 'json',
            origin: '*'
        });
        
        const searchResponse = await fetch(`${WIKIPEDIA_API_URL}?${searchParams}`);
        const searchData = await searchResponse.json();
        
        if (!searchData.query || !searchData.query.search) {
            return [];
        }
        
        // Get the first few relevant pages
        const pageTitles = searchData.query.search.slice(0, 3).map(page => page.title);
        
        // For each page, get images that are relevant to our model
        for (const title of pageTitles) {
            const images = await getImagesFromWikipediaPageWithFilter(title, 'prototype', model);
            results.push(...images);
            
            if (results.length >= RESULTS_PER_CATEGORY) {
                break;
            }
        }
        
        return results;
        
    } catch (error) {
        console.error(`Error searching Wikipedia with query ${query}:`, error);
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
        
        // Only include actual images (not PDFs, etc.)
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
            description: cleanImageDescription(imageTitle)
        };
        
    } catch (error) {
        console.error(`Error getting image info for ${imageTitle}:`, error);
        return null;
    }
}

/**
 * Clean up image description for display
 */
function cleanImageDescription(title) {
    // Remove file extension
    let description = title.replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '');
    
    // Replace underscores with spaces
    description = description.replace(/_/g, ' ');
    
    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);
    
    return description;
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
                    <p>Keine spezifischen Bilder für <em>${model} (${categoryQueries[category](model)})</em> auf Wikipedia gefunden.</p>
                    <p>Versuchen Sie einen anderen Suchbegriff oder eine genauere Modellbezeichnung.</p>
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

// Initialize
console.log('Auto Bildersuche mit Wikipedia API - bereit!');
