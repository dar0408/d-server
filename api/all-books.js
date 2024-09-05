import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;

async function connectToMongo() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client.db("BookInventory").collection("Books");
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const bookCollections = await connectToMongo();
        let query = {};
        if (req.query.category) {
            query = { category: req.query.category };
        }
        const result = await bookCollections.find(query).toArray();
        res.status(200).json(result);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
