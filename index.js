const express = require('express')
const cors = require('cors')
// const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8m97.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors());
const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  console.log('database connected');

  app.get('/', (req, res)=> {
    productsCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
      // console.log('responding')
    })
  })
  app.post('/addProduct', (req,res)=>{
    const products = req.body;
    // console.log(products);
    productsCollection.insertOne(products)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })
  
  app.get('/products', (req, res)=> {
    productsCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
      // console.log('responding')
    })
  })

  app.get('/product/:key', (req,res)=> {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req,res) => {
    const productkeys = req.body;
    productsCollection.find({key: {$in: productkeys}})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.post('/addOrder', (req,res)=>{
    const order = req.body;
    // console.log(products);
    ordersCollection.insertOne(order)
    .then(result => {
      // console.log(result.insertedCount);
      res.send(result.insertedCount > 0)
    })
    .catch(err  => console.log(err))
  })

});


app.listen(port)