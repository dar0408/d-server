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
    if (req.method === 'POST') {
        const bookCollections = await connectToMongo();
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.status(200).json(result);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
