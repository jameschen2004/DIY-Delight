// client/src/utilities/constants.js

export const BASE_PRICE = 20000; // Base price for the custom item (e.g., Car)

// Define feature options and their respective prices
export const FEATURE_OPTIONS = {
    // Feature 1: Exterior Color
    feature_one: [
        { name: 'Red', price: 1500, type: 'Car' },
        { name: 'Blue', price: 1000, type: 'Car' },
        { name: 'Black', price: 800, type: 'Car' }
    ],
    // Feature 2: Wheel Style
    feature_two: [
        { name: 'Standard', price: 0, type: 'Car' },
        { name: 'Sport', price: 2000, type: 'Car' },
        { name: 'Gold', price: 5000, type: 'Car' } // This is part of the impossible combo
    ]
};

// Define the "Impossible Combo" rules for validation
export const IMPOSSIBLE_COMBOS = [
    {
        item_type: 'Car',
        feature_one: 'Red',
        feature_two: 'Gold',
        error_message: 'Cannot build a Red Car with Gold wheels for safety reasons.'
    }
    // Add other impossible combinations here as needed
];