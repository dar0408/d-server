import { MongoClient, ObjectId } from 'mongodb';

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
    const { id } = req.query;

    const bookCollections = await connectToMongo();
    const filter = { _id: new ObjectId(id) };

    if (req.method === 'GET') {
        const result = await bookCollections.findOne(filter);
        res.status(200).json(result);
    } else if (req.method === 'PATCH') {
        const updateBookData = req.body;
        const updatedDoc = {
            $set: updateBookData
        };
        const options = { upsert: true };
        const result = await bookCollections.updateOne(filter, updatedDoc, options);
        res.status(200).json(result);
    } else if (req.method === 'DELETE') {
        const result = await bookCollections.deleteOne(filter);
        res.status(200).json(result);
    } else {
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
