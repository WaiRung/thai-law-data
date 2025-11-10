// Config loader for categories
let categoriesConfig = null;

/**
 * Load categories configuration from config/categories.json
 * @returns {Promise<Object>} Categories configuration object
 */
async function loadCategoriesConfig() {
    if (categoriesConfig) {
        return categoriesConfig;
    }
    
    try {
        const response = await fetch('config/categories.json');
        if (!response.ok) {
            throw new Error(`Failed to load categories config: ${response.status}`);
        }
        categoriesConfig = await response.json();
        return categoriesConfig;
    } catch (error) {
        console.error('Error loading categories config:', error);
        throw new Error('Failed to load categories configuration. Please ensure config/categories.json exists and is valid.');
    }
}

/**
 * Get all category names
 * @returns {Promise<string[]>} Array of category names
 */
async function getCategoryNames() {
    const config = await loadCategoriesConfig();
    return Object.keys(config);
}

/**
 * Get data IDs for a specific category
 * @param {string} category - Category name
 * @returns {Promise<string[]>} Array of data IDs for the category
 */
async function getDataIdsForCategory(category) {
    const config = await loadCategoriesConfig();
    if (!config[category]) {
        throw new Error(`Category '${category}' not found in configuration`);
    }
    return config[category];
}

/**
 * Get all data IDs across all categories
 * @returns {Promise<string[]>} Array of all unique data IDs
 */
async function getAllDataIds() {
    const config = await loadCategoriesConfig();
    const allIds = new Set();
    Object.values(config).forEach(ids => {
        ids.forEach(id => allIds.add(id));
    });
    return Array.from(allIds);
}

/**
 * Get human-readable name for a data ID
 * @param {string} dataId - Data ID
 * @returns {string} Human-readable name
 */
function getDataIdDisplayName(dataId) {
    return dataId.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
