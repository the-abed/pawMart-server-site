const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simplecrudserver.fyfvvbn.mongodb.net/?appName=simpleCRUDserver`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("pawMartDB");
//     const listingCollection = db.collection("listings");

//     // ✅ 1. Create listing
//     app.post("/listings", async (req, res) => {
//       const newListing = req.body;
//       const result = await listingCollection.insertOne(newListing);
//       res.send(result);
//     });

//     // 📖 2. Read all listings
//     app.get("/listings", async (req, res) => {
//       const listings = await listingCollection.find().toArray();
//       res.send(listings);
//     });

//     // 📖 3. Read one listing by ID
//     app.get("/listings/:id", async (req, res) => {
//       const id = req.params.id;
//       const listing = await listingCollection.findOne({ _id: new ObjectId(id) });
//       res.send(listing);
//     });

//     // ✏️ 4. Update listing
//     app.put("/listings/:id", async (req, res) => {
//       const id = req.params.id;
//       const updatedData = req.body;
//       const result = await listingCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: updatedData }
//       );
//       res.send(result);
//     });

//     // ❌ 5. Delete listing
//     app.delete("/listings/:id", async (req, res) => {
//       const id = req.params.id;
//       const result = await listingCollection.deleteOne({ _id: new ObjectId(id) });
//       res.send(result);
//     });

//     // Orders API
// app.post("/orders", async (req, res) => {
//   try {
//     const order = req.body;
//     const db = client.db("pawMartDB");
//     const ordersCollection = db.collection("orders");
//     const result = await ordersCollection.insertOne(order);
//     res.status(201).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Failed to place order" });
//   }
// });

//     console.log("✅ MongoDB Connected Successfully");
//   } catch (err) {
//     console.error("❌ MongoDB Error:", err);
//   }
// }
async function run() {
  try {
    await client.connect();
    const db = client.db("pawMartDB");
    const listingCollection = db.collection("listings");
    const ordersCollection = db.collection("orders");

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
      const listing = await listingCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(listing);
    });

    // get listing by email
    app.get("/myListings", async (req, res) => {
      try {
        const email = req.query.email; // get email from query string
        const query = email ? { email } : {};
        const listings = await listingCollection.find(query).toArray();
        res.send(listings);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch listings" });
      }
    });

    // 📖 3. Read one listing by category
    // GET /listings?category=Pets
    app.get("/listings", async (req, res) => {
      try {
        const category = req.query.category; // category from frontend
        let query = {};

        if (category) {
          // Make sure to match exact category stored in DB
          query.category = category;
        }

        const listings = await listingCollection.find(query).toArray();
        res.send(listings);
      } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send({ message: "Failed to fetch listings" });
      }
    });

    // 📖 4. Delete one listing by ID
    app.delete("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const result = await listingCollection.deleteOne({
        _id: new ObjectId(id),
      });
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

    //📖 6. Orders API
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

    // GET /orders?buyerEmail=user@example.com
    app.get("/myOrders", async (req, res) => {
      try {
        const buyerEmail = req.query.email;
        const query = buyerEmail ? { buyerEmail } : {};
        const orders = await ordersCollection.find(query).toArray();
        res.send(orders);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch orders" });
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
