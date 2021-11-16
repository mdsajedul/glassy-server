const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

// db connection 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmldf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run(){
    try{
        await client.connect();
        console.log('Database conneced successfully');
        const database = client.db('glassy');
        const glassesCollection = database.collection('glasses');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        // Get All 
        app.get('/glasses' ,async(req , res)=>{
            const cursor = glassesCollection.find({});
            const glasses = await cursor.toArray();
            res.send(glasses);
        })

        // Get One by id
        app.get('/glasses/:id' ,async(req , res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const glasses = await glassesCollection.findOne(query);
            res.send(glasses);
        })

        //post api for orders
        app.post('/orders' ,async(req , res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })

        //Post api for user 
        app.post('/users' ,async(req , res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        //put api for user
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //get api all orders by email 
        app.get('/orders/:email' ,async(req , res)=>{
            const email = req.params.email;
            const query = {email:email};
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
        })

        //order delete api 
      app.delete('/orders/:id' ,async(req , res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await ordersCollection.deleteOne(query);
        res.send(result);
      })
        //post api for review 
        app.post('/reviews' ,async(req , res)=>{
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(console.dir);

app.get('/' , (req , res)=>{

   res.send('hello from Glassy server :)')

})

app.listen(port,()=>{
    console.log('Server is runnig on',port);
})