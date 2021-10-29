const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT||4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("GeniusMechanics");
    const servicesCollections = database.collection("ServicesCollections");

    //Get Data from database
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //Get single service from database
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await servicesCollections.findOne(query);

      res.send(result);
    });


    // create a document to insert
    app.post("/services", async (req, res) => {
      const servicesData = req.body;
      console.log(servicesData);
      const result = await servicesCollections.insertOne(servicesData);
      res.send(JSON.stringify(result));
    });

    //Delete service from database
    app.delete("/services/:id", async (req, res) => {
      // console.log("receving delete id",req.params.id)
      const id = req.params.id;
      const query = {_id:ObjectID(id)}
      const deletedService= await servicesCollections.deleteOne(query)
      res.json(deletedService);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("yes got this server responsees yes yes yes");
});
app.get("/extra",(req,res)=>{
  res.send("this is extra feature")
})
app.listen(port, () => {
  console.log("listening to ", port);
});
