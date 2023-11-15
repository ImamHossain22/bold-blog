const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.BLOG_USER}:${process.env.BLOG_KEY}@cluster0.dx0wc.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
 
    await client.connect();

    const blogCollection = client.db("blogerdb").collection("blog");

    app.post("/blog", async (req, res) => {
      const addBlog = {
        
        name: req.body.name,
        image: req.body.image,
        short: req.body.short,
        type: req.body.type,
        description: req.body.description,
        timeAndDate: new Date(),
      };

      const result = await blogCollection.insertOne(addBlog);
      res.send(result);
    });

    app.get("/blog", async (req, res) => {
      const cursor = blogCollection.find().sort({ timeAndDate: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(qurey);
      res.send(result);
    });

   
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Blog is running...");
});

app.listen(port, () => {
  console.log(`Blog server is running on port ${port}`);
});
