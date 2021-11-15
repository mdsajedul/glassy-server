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