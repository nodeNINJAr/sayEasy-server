require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');




// middleware
app.use(cors({
    origin:['http://localhost:5175','http://localhost:5173','https://sayeasy-95352.web.app','sayeasy-95352.firebaseapp.com'],
    credentials:true,
    optionsSuccessStatus:200
  }
));
app.use(express.json());
app.use(cookieParser());




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
    const bookedTutorsCollection = database.collection("bookedTutors");
    const usersCollection = database.collection("users");



    // verify token middleware 
    const verifyToken = (req, res , next)=>{
          const token = req?.cookies?.token
          // return if token not found
          if(!token){
             return  res.status(401).json({message : "UnAuthorize Access"});
          }
          //verify 
          jwt.verify(token, process.env.JWT_SECRET, (err , decode)=>{
               if(err){
                  return res.status(401).send({message : "UnAuthorize Access"})
               }
              req.user = decode;
              console.log(decode.email);
              next()
          });

    }

    // 
    app.get('/users',async(req,res)=>{
      const users = await usersCollection.estimatedDocumentCount();
      res.send({users})
    })

    // get all tutorials
    app.get('/tutorials' , async(req, res)=>{
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        const searchData = req.query.search || "";
          // {} for search all item 
          let query = {};
          if(searchData){
            query ={  
                language : {
                  $regex: searchData , $options: "i"
                },
             }
          } 
           // tota count
        const count = await tutorialCollection.estimatedDocumentCount(query);
        const tutoirals = await tutorialCollection.find(query)
        .skip((page -1)* size)
        .limit(size)
        .toArray()
        // send all api
        res.send({
          count,
          tutoirals,
      
        })

    })


    // get tutorials by its category
    app.get('/tutors/:category', async(req,res)=>{
       const category = req.params.category;
       const query = {language : category};
       const result = await tutorialCollection.find(query).toArray();
       res.send(result)
    })
    // get specipfic user tutorials
    app.get('/user-tutorials/:email' ,verifyToken, async (req ,res)=>{
        const email = req.params.email;
        // email from verify token
        const userEmail = req?.user?.email;
        // if email not same with login user
         if(email !== userEmail){
            return res.status(403).send({message : 'Forbidden Access'})
         }
        const query = {email};
        const result = await tutorialCollection.find(query).toArray()
        res.send(result)
    })
    // get specifice tutorial by id
    app.get('/tutor/:id' , verifyToken, async(req , res )=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await tutorialCollection.findOne(query);
        res.send(result)
    })
    // get booed tutor 
    app.get('/booked-tutors/:email',verifyToken, async(req ,res)=>{
        const buyerEmail = req.params.email;
        // email from verify token
        const userEmail = req.user.email;
        // if email not same with login user
         if(buyerEmail !==  userEmail){
            return res.status(403).send({message : 'Forbidden Access'})
         }
        const query = {userEmail: buyerEmail};
        const result = await bookedTutorsCollection.find(query).toArray();
        res.send(result)
    })



    // post a tutorial
    app.post("/add-tutorials",verifyToken, async(req,res)=>{
      const tutorialData = req.body;
      const query = { language: tutorialData.language , email:tutorialData.email };
      // already exist
      const alreadyExist = await tutorialCollection.findOne(query);
      if(alreadyExist){
         return res.status(400).send("This language already added by this user")
      }
      const result = await tutorialCollection.insertOne(tutorialData);
      res.send(result)
    })

    // tutorial update 
    app.patch('/update-tutorials/:id',verifyToken, async(req,res)=>{
      const id = req.params.id;
      const formData = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatedData = {
          $set : formData
      }

      const result = await tutorialCollection.updateOne(filter, updatedData);
      res.send(result)
    })

    // tutorial delete 
    app.delete('/remove/:id',verifyToken, async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await tutorialCollection.deleteOne(query);
      res.send(result)
    })  

    // book tutor
    app.post('/tutor-booking' ,verifyToken, async (req ,res)=>{
      const bookedData = req.body;
      const query ={tutorEmail:bookedData.tutorEmail, language:bookedData.language};
      const alredyExist = await bookedTutorsCollection.findOne(query);
      
      //  validation same tutor with same category
      if(alredyExist){
          return res.status(400).send('This language tutor already booked ')
      }
      const result = await bookedTutorsCollection.insertOne(bookedData);
      res.send(result);
    })

    // review tutor
    app.patch('/review/',verifyToken, async (req ,res)=>{
      const tutorInfo = req.body;
      const query = { _id : new ObjectId(tutorInfo.tutorId)};
      // reviewed checked
      const tutor = await tutorialCollection.findOne(query);

          // Check if tutor exists
          if (!tutor) {
            return 
        }

      if(tutor.reviewedBy && tutor.reviewedBy.includes(tutorInfo._id)){
          return res.status(400).send("You have already reviewed this tutor!");
      }

      const updateReview = {
              $inc:{review : 1},
              $push:{reviewedBy: tutorInfo._id},
      }
      const result = await tutorialCollection.updateOne(query, updateReview);
      res.send(result)
    } )

    // jwt sign in
    app.post('/jwt', async(req , res)=>{
      const email = req.body;
      const token = jwt.sign(email ,process.env.JWT_SECRET , {
         expiresIn:'5h'
      });

      // setuser Eamil to user  collection for count total user
      const query = {userEmail:email.email}
      const alreadyExist = await usersCollection.findOne(query);
      if(email?.email !== alreadyExist?.userEmail){
       await usersCollection.insertOne(query);
       }
   
      //data set to cookie
      res.cookie('token' , token , {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .send({message : "token-set-on-http-only-cookie"})

    })

  // remove token from cookie
  app.get('/logout' , async(req , res)=>{
     res.clearCookie('token', {
      maxAge:0,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
     })
    res.status(200).send({ message: "clear jwt token from http only cookie successfully!" });
  })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); // it need to comments
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