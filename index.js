const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simplecrudserver.fyfvvbn.mongodb.net/?appName=simpleCRUDserver`;

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
    const db = client.db("pawMartDB");
    const listingCollection = db.collection("listings");

    // ✅ 1. Create listing
    app.post("/listings", async (req, res) => {
      const newListing = req.body;
      const result = await listingCollection.insertOne(newListing);
      res.send(result);
    });

    // 📖 2. Read all listings
    app.get("/listings", async (req, res) => {
      const listings = await listingCollection.find().toArray();
      res.send(listings);
    });

    // 📖 3. Read one listing by ID
    app.get("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const listing = await listingCollection.findOne({ _id: new ObjectId(id) });
      res.send(listing);
    });

    // 📖 4. Delete one listing by ID
    app.delete("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const result = await listingCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // 📖 5. Update one listing by ID
    app.put("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedListing = req.body;
      const result = await listingCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedListing }
      );
      res.send(result);
    });


    // 6. Orders API 
app.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    const db = client.db("pawMartDB");
    const ordersCollection = db.collection("orders");
    const result = await ordersCollection.insertOne(order);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to place order" });
  }
});
    


    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}

run();

app.get("/", (req, res) => {
  res.send("🐾 PawMart Server is running...");
});

app.listen(port, () => {
  console.log(`🚀 PawMart Server listening on port ${port}`);
});
