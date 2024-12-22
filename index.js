require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');




// middleware
app.use(cors({
    origin:['http://localhost:5175'],
    credentials:true,
    optionsSuccessStatus:200
  }
));
app.use(express.json())




// uri from mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pm9ea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// 
async function run() {

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database
    const database = client.db("sayEasylang");
    const tutorialCollection = database.collection("tutorials");





    // get all tutorials
    app.get('/tutorials' , async(req, res)=>{
        const result = await tutorialCollection.find().toArray();
        res.send(result)
    })
    // get specipfic user tutorials
    app.get('/user-tutorials/:email' , async (req ,res)=>{
       const email = req.params.email;
       const query = {email}
       const result = await tutorialCollection.find(query).toArray()
       res.send(result)
    })

    // post a tutorial
    app.post("/add-tutorials", async(req,res)=>{
      const tutorialData = req.body;
      console.log(tutorialData);
      const result = await tutorialCollection.insertOne(tutorialData);
      res.send(result)
    })

// tutorial update
// app.patch('/update-tutorials/:id', async(req,res)=>{
//    const id = req.params.id;
//    const query = 
// })

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// setUp
app.get("/", (req, res)=>{
    res.send("sayEasy server running")
});
app.listen(port , ()=>{
   console.log(`sayEasy is runnnig on the port ${port}`);
})