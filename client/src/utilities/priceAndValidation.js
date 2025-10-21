// client/src/utilities/priceAndValidation.js

import { BASE_PRICE, FEATURE_OPTIONS, IMPOSSIBLE_COMBOS } from './constants';

/**
 * Calculates the total price of a custom item based on selected features.
 * @param {object} selections - An object containing feature selections (e.g., { feature_one_selection: 'Red', feature_two_selection: 'Sport' })
 * @returns {number} The total calculated price.
 */
export const calculateTotalPrice = (selections) => {
    // Find the price for Feature One
    const featureOneCost = FEATURE_OPTIONS.feature_one.find(
        f => f.name === selections.feature_one_selection
    )?.price || 0;

    // Find the price for Feature Two
    const featureTwoCost = FEATURE_OPTIONS.feature_two.find(
        f => f.name === selections.feature_two_selection
    )?.price || 0;

    // Calculate total
    return BASE_PRICE + featureOneCost + featureTwoCost;
};


/**
 * Checks if the selected feature combination is impossible (based on IMPOSSIBLE_COMBOS).
 * @param {object} selections - An object containing item type and feature selections.
 * @returns {object|null} An object with { isInvalid: true, message: string } if invalid, otherwise null.
 */
export const checkFeatureCombination = (selections) => {
    // Iterate through all defined impossible combos
    for (const combo of IMPOSSIBLE_COMBOS) {
        if (
            // Check item type match
            selections.item_type === combo.item_type &&
            // Check feature one match
            selections.feature_one_selection === combo.feature_one &&
            // Check feature two match
            selections.feature_two_selection === combo.feature_two
        ) {
            // Combo is impossible
            return {
                isInvalid: true,
                message: combo.error_message
            };
        }
    }

    // Combo is valid
    return null;
};