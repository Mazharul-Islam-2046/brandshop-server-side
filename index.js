const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.userNameDB}:${process.env.password}@cluster0.ypipc9x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersCollection = client.db("brandDB").collection("users");
    const productCollection = client.db("brandDB").collection("product");
    const brandCollection = client.db("brandDB").collection("brandCollection");
    const myCartCollection = client.db("brandDB").collection("myCart")


    // myCart post method
    app.post("/mycarts", async (req, res) => {
      const myCart = req.body;
      const result = await myCartCollection.insertOne(myCart);
      res.send(result);
    });


    // myCart get method
    app.get("/mycarts", async (req, res) => {
      const result = await myCartCollection.find().toArray();
      res.send(result);
    });




    // myCart Delete method
    app.delete("/mycarts/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await myCartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });




    // user post method
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // add product (Post)
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //   add product (get)
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // Product get by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // product update by id
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          brandName: data.brandName,
          type: data.type,
          imageLink: data.imageLink,
          productName: data.productName,
          description: data.description,
          price: data.price,
          ratings: data.ratings,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });

    // Brand Collection get
    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server in running");
});

app.listen(port, () => {
  console.log("server is running");
});
