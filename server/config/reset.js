import { pool } from "./database.js";

// You can create a small dummy data file if you want to initially populate the table, 
// but for a customization app, starting empty or with one example is often more realistic.
// Let's assume you have a 'data/initialItems.js' file for demonstration.
// For now, we will focus on the table structure and the create function.

const createCustomItemsTable = async () => {
    // Define the structure for your customizable item.
    // 'item_type' could be 'Car', 'Shoe', 'Pet Costume'.
    // 'feature_one' and 'feature_two' represent customizable attributes (e.g., 'Color', 'Wheels').
    // 'price' will store the final price.
    // 'user_notes' for any extra customization detail.
    // 'is_valid' is a conceptual column for the 'impossible combo' logic, though
    // the actual constraint is better handled in your API/frontend logic.
    // I'll add a 'CHECK' constraint to demonstrate a database-level restriction.
    const createTableQuery = `
        DROP TABLE IF EXISTS CustomItems;

        CREATE TABLE IF NOT EXISTS CustomItems (
            id SERIAL PRIMARY KEY,
            item_name VARCHAR(255) NOT NULL,
            item_type VARCHAR(50) NOT NULL,
            feature_one_selection VARCHAR(100) NOT NULL,
            feature_two_selection VARCHAR(100) NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            user_notes TEXT,
            submitted_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Example of a database-level "impossible combo" constraint:
            -- Disallow a 'Car' that has 'Red' as Feature One AND 'Gold' as Feature Two.
            -- Your main validation should be in your server-side POST/PUT handlers, 
            -- but this shows a database constraint.
            CHECK (NOT (item_type = 'Car' AND feature_one_selection = 'Red' AND feature_two_selection = 'Gold'))
        );
    `;

    try {
        const res = await pool.query(createTableQuery);
        console.log('🎉 CustomItems table created successfully');
    } catch (err) {
        console.error('⚠️ error creating CustomItems table', err);
    }
};

/*
    -- Optional: If you want to seed the table with initial data, you'd implement this function:
    
    const seedCustomItemsTable = async () => {
        // You would import an initial data array here, e.g., import initialData from '../data/initialItems.js'
        // For this project, you may choose to start with an empty table.
    
        // await createCustomItemsTable(); 
        
        // Loop through data and insert
    }
*/

const runInitialSetup = async () => {
    // Start by creating the main table
    await createCustomItemsTable(); 
    
    // If you had a seed function, you would call it here:
    // await seedCustomItemsTable(); 
}

runInitialSetup();