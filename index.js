const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikmm0oq.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('products');
    const myProductCollection = client.db('productDB').collection('myProducts')

    // Read data
    // Read product
    app.get('/products', async(req, res)=> {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result);
  })

    // Create data
    // post product
    app.post('/products', async(req, res)=> {
        const newProduct = req.body;
        console.log(newProduct)
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    });

    // update product

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedProduct = req.body;
      const product = {
          $set: {
              name: updatedProduct.name,
              brand: updatedProduct.brand,
              photo: updatedProduct.photo,
              price: updatedProduct.price,
              category: updatedProduct.category,
              rating: updatedProduct.rating,
              description : updatedProduct.description
          }
      }
      const result = await productCollection.updateOne(filter, product, options)
      res.send(result)

  })

    // Read data
    // Read MyProduct

    app.get('/myProducts', async(req, res)=> {
      const cursor = myProductCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/myProducts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await myProductCollection.findOne(query)
      res.send(result);
  })

    // Create data
    // post my product

    app.post('/myProducts', async(req, res)=> {
      const myAddedProduct = req.body;
      console.log(myAddedProduct);
      const result = await myProductCollection.insertOne(myAddedProduct);
      res.send(result);
    });

    // Delete data
    // delete my product

    app.delete('/myProducts/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await myProductCollection.deleteOne(query)
      res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send("Fashion Savvy Server is running")
});

app.listen(port, ()=> {
    console.log(`Fashion Savvy Server is running on port : ${port}`)
})