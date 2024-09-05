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

    if (req.method === 'POST') {
        const review = req.body;
        const updateDoc = {
            $push: { reviews: review }
        };
        const result = await bookCollections.updateOne(filter, updateDoc);
        res.status(200).json(result);
    } else if (req.method === 'GET') {
        const book = await bookCollections.findOne(filter);
        res.status(200).json(book ? book.reviews || [] : []);
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
