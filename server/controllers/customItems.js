import { pool } from "../config/database.js";

/**
 * READ: Gets all custom items from the CustomItems table.
 */
const getCustomItems = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM CustomItems ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (err) {
        // Use status 409 (Conflict) or 500 (Internal Server Error) for database errors
        res.status(500).json({ error: err.message });
    }
};

// -----------------------------------------------------------------------------

/**
 * READ: Gets a single custom item by its ID.
 */
const getCustomItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId; // Assuming the route parameter is named 'itemId'
        const selectQuery = `
            SELECT id, item_name, item_type, feature_one_selection, feature_two_selection, price, user_notes, submitted_on
            FROM CustomItems
            WHERE id = $1
        `;

        const results = await pool.query(selectQuery, [itemId]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found' });
        }

        res.status(200).json(results.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -----------------------------------------------------------------------------

/**
 * CREATE: Adds a new custom item to the CustomItems table.
 * This includes basic validation to meet the "impossible combo" requirement.
 */
const createCustomItem = async (req, res) => {
    try {
        const { item_name, item_type, feature_one_selection, feature_two_selection, price, user_notes } = req.body;

        // --- Server-Side Validation for "Impossible Combo" (REQUIRED FEATURE) ---
        // This is the place to check for business rules before hitting the database.
        // E.g., You cannot have a 'Car' with 'Red' exterior and 'Gold' wheels.
        if (item_type === 'Car' && feature_one_selection === 'Red' && feature_two_selection === 'Gold') {
            return res.status(400).json({ 
                error: "Impossible combo: Red Car with Gold wheels is disallowed for safety reasons." 
            });
        }
        
        const insertQuery = `
            INSERT INTO CustomItems (item_name, item_type, feature_one_selection, feature_two_selection, price, user_notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *; -- RETURNING * gives back the created row, including the new 'id'
        `;

        const values = [item_name, item_type, feature_one_selection, feature_two_selection, price, user_notes];

        const results = await pool.query(insertQuery, values);
        res.status(201).json(results.rows[0]); // 201 Created

    } catch (err) {
        // If the database-level CHECK constraint is violated, it will throw an error here too.
        res.status(500).json({ error: err.message });
    }
};

// -----------------------------------------------------------------------------

/**
 * UPDATE: Edits an existing custom item based on its ID.
 */
const updateCustomItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { item_name, item_type, feature_one_selection, feature_two_selection, price, user_notes } = req.body;

        // --- Server-Side Validation for "Impossible Combo" on Update ---
        if (item_type === 'Car' && feature_one_selection === 'Red' && feature_two_selection === 'Gold') {
            return res.status(400).json({ 
                error: "Impossible combo: Cannot update to Red Car with Gold wheels." 
            });
        }

        const updateQuery = `
            UPDATE CustomItems
            SET item_name = $1, item_type = $2, feature_one_selection = $3, feature_two_selection = $4, price = $5, user_notes = $6
            WHERE id = $7
            RETURNING *;
        `;

        const values = [item_name, item_type, feature_one_selection, feature_two_selection, price, user_notes, itemId];

        const results = await pool.query(updateQuery, values);
        
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found for update' });
        }
        
        res.status(200).json(results.rows[0]); // 200 OK

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// -----------------------------------------------------------------------------

/**
 * DELETE: Deletes a custom item based on its ID.
 */
const deleteCustomItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        
        const deleteQuery = 'DELETE FROM CustomItems WHERE id = $1 RETURNING *;';

        const results = await pool.query(deleteQuery, [itemId]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found for deletion' });
        }

        res.status(200).json({ message: 'Custom item deleted successfully', deletedItem: results.rows[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// -----------------------------------------------------------------------------

export default {
    getCustomItems,
    getCustomItemById,
    createCustomItem,
    updateCustomItem,
    deleteCustomItem
};