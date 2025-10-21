import express from 'express'
// Import dotenv configuration (assuming you have a setup like this)
import './config/dotenv.js' 
// Import the custom items router
import customItemsRouter from './routes/customItems.js'
import cors from 'cors'

const app = express()

// --------------------------- Middleware ---------------------------

// 1. Enable CORS for all routes
app.use(cors())

// 2. Middleware to parse incoming JSON data in the request body (REQUIRED for POST/PUT)
app.use(express.json())

// --------------------------- Routes ---------------------------

// Set the base path for your CustomItems routes
// All routes defined in customItems.js will now be accessible under /api/customitems
app.use('/api/customitems', customItemsRouter)

// Optional: A simple root route to confirm the server is running
app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">DIY Delight Customizer API</h1>')
})

// --------------------------- Server Initialization ---------------------------

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
    // Confirm the API endpoint is set up
    console.log(`API available at: http://localhost:${PORT}/api/customitems`)
})