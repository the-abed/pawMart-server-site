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
    // await client.connect();
    const db = client.db("pawMartDB");
    const listingCollection = db.collection("listings");
    const ordersCollection = db.collection("orders");

    // . Create listing
    app.post("/listings", async (req, res) => {
      const newListing = req.body;
      const result = await listingCollection.insertOne(newListing);
      res.send(result);
    });

    // Insert multiple listings
    app.post("/listings-many", async (req, res) => {
      try {
        const newListings = req.body; // should be an array of objects
        const result = await listingCollection.insertMany(newListings);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
      }
    });

    //   Read all listings
    app.get("/listings", async (req, res) => {
      const listings = await listingCollection.find().toArray();
      res.send(listings);
    });

    //   Read one listing by ID
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

    // 🔹 Fetch Pets (Adoption)
    app.get("/categories/pets", async (req, res) => {
      try {
        const listings = await listingCollection
          .find({ category: "Pets" })
          .toArray();
        res.status(200).send(listings);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch Pets listings" });
      }
    });

    // 🔹 Fetch Pet Food
    app.get("/categories/pet-food", async (req, res) => {
      try {
        const listings = await listingCollection
          .find({ category: "Pet Food" })
          .toArray();
        res.status(200).send(listings);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch Pet Food listings" });
      }
    });

    // 🔹 Fetch Accessories
    app.get("/categories/accessories", async (req, res) => {
      try {
        const listings = await listingCollection
          .find({ category: "Accessories" })
          .toArray();
        res.status(200).send(listings);
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Failed to fetch Accessories listings" });
      }
    });

    // 🔹 Fetch Pet Care Products
    app.get("/categories/pet-care-products", async (req, res) => {
      try {
        const listings = await listingCollection
          .find({ category: "Pet Care Products" })
          .toArray();
        res.status(200).send(listings);
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Failed to fetch Pet Care Products listings" });
      }
    });

    // 📖  Delete one listing by ID
    app.delete("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const result = await listingCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // DELETE all listings
    app.delete("/listings", async (req, res) => {
      try {
        const deleteResult = await listingCollection.deleteMany({});
        res.send({
          message: "All listings deleted successfully",
          deletedCount: deleteResult.deletedCount,
        });
      } catch (error) {
        console.error("Error deleting listings:", error);
        res.status(500).send({ message: "Failed to delete listings" });
      }
    });

    // 📖  Update one listing by ID
    app.put("/listings/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id))
          return res.status(400).send({ message: "Invalid listing ID" });

        const updatedListing = req.body;
        delete updatedListing._id; // prevent _id overwrite

        const result = await listingCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedListing }
        );

        if (result.matchedCount === 0)
          return res.status(404).send({ message: "Listing not found" });

        res.send({ acknowledged: true, modifiedCount: result.modifiedCount });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Failed to update listing", error: err.message });
      }
    });

    //📖  Orders API
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

    // ✅ GET /myOrders?email=user@example.com
    app.get("/myOrders", async (req, res) => {
      try {
        const email = req.query.email; // get from query params
        const query = email ? { email } : {}; // 👈 match your DB field name
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
