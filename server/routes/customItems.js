import express from 'express';
// Import the controller functions you defined in Step 3
import CustomItemsController from '../controllers/customItems.js';

const router = express.Router();

// --------------------------- READ Routes ---------------------------

// Route to get all submitted CustomItems (List View)
// GET /api/customitems
router.get('/', CustomItemsController.getCustomItems);

// Route to get a single CustomItem by ID (Detail View)
// GET /api/customitems/:itemId
router.get('/:itemId', CustomItemsController.getCustomItemById);

// --------------------------- CREATE Route ---------------------------

// Route to create a new CustomItem
// POST /api/customitems
router.post('/', CustomItemsController.createCustomItem);

// --------------------------- UPDATE Route ---------------------------

// Route to edit an existing CustomItem
// PUT /api/customitems/:itemId (or PATCH if only partial updates are allowed)
router.put('/:itemId', CustomItemsController.updateCustomItem);

// --------------------------- DELETE Route ---------------------------

// Route to delete a CustomItem
// DELETE /api/customitems/:itemId
router.delete('/:itemId', CustomItemsController.deleteCustomItem);

export default router;