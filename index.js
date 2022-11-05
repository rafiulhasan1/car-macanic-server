const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// Middle Ware
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('car macanic server is on the way')
})

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dz9vzc2.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const newUser = client.db('mongoCar').collection('user')
        const collection = client.db('mongoCar').collection('orders')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = newUser.find(query)
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await newUser.findOne(query);
            res.send(service);
        });

        app.get('/orders', async(req , res) =>{
            let query = {};

            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            
            const cursor = collection.find(query)
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.post('/orders' , async(req , res) =>{
            const order = req.body;
            const result = await collection.insertOne(order);
            res.send(result);
        });

        app.delete('/orders/:id' , async(req , res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await collection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(error => console.error(error))


app.listen(port, () => {
    console.log(`genius car macanic server is ruaning ${port}`)
})