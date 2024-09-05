const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI; // Set this in Vercel's environment variables

// MongoDB Client
let client;
let bookCollections;

async function connectToMongo() {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        bookCollections = client.db("BookInventory").collection("Books");
    }
    return bookCollections;
}

// API Routes
app.use('/api', require('./api/upload-book'));
app.use('/api', require('./api/all-books'));
app.use('/api', require('./api/book'));
app.use('/api', require('./api/review'));

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
