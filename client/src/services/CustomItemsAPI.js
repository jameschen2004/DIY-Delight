// Base URL for the API endpoint defined in server.js
// Use your deployed Render URL here when you deploy your backend!
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/customitems';

/**
 * Helper function for making API calls.
 * @param {string} endpoint - The specific path after the base URL.
 * @param {object} options - Request options (method, headers, body, etc.).
 * @returns {Promise<object>} The JSON response data.
 */
const apiCall = async (endpoint = '', options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        
        if (!response.ok) {
            // Attempt to parse JSON error message if available
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.error || errorData.message || 'API request failed');
        }

        // Handle successful response with JSON body
        return response.json();

    } catch (error) {
        console.error("API Call Error:", error);
        throw error; // Re-throw to be caught by the component
    }
};

// -----------------------------------------------------------------------------

/**
 * READ: Fetches all custom items.
 * Corresponds to: GET /api/customitems
 */
export const getAllCustomItems = async () => {
    return apiCall();
};

// -----------------------------------------------------------------------------

/**
 * READ: Fetches a single custom item by ID.
 * Corresponds to: GET /api/customitems/:id
 * @param {number} id - The ID of the custom item.
 */
export const getCustomItemById = async (id) => {
    return apiCall(`/${id}`);
};

// -----------------------------------------------------------------------------

/**
 * CREATE: Creates a new custom item.
 * Corresponds to: POST /api/customitems
 * @param {object} itemData - The data for the new custom item.
 */
export const createCustomItem = async (itemData) => {
    return apiCall('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
};

// -----------------------------------------------------------------------------

/**
 * UPDATE: Edits an existing custom item.
 * Corresponds to: PUT /api/customitems/:id
 * @param {number} id - The ID of the item to update.
 * @param {object} itemData - The updated data for the custom item.
 */
export const updateCustomItem = async (id, itemData) => {
    return apiCall(`/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
};

// -----------------------------------------------------------------------------

/**
 * DELETE: Deletes a custom item by ID.
 * Corresponds to: DELETE /api/customitems/:id
 * @param {number} id - The ID of the item to delete.
 */
export const deleteCustomItem = async (id) => {
    return apiCall(`/${id}`, {
        method: 'DELETE',
    });
};