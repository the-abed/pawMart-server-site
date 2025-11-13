
````markdown
# PawMart Server

PawMart Server is the backend API for **PawMart**, a community-driven platform for pet adoption and pet product sales. This server provides endpoints for managing listings, categories, and orders, enabling frontend applications to fetch, update, and display data.

---

## Features

- **CRUD for Listings**
  - Create, read, update, and delete pet/product listings.
  - Fetch listings by category or user email.
  - Fetch latest listings for home page display.
- **Orders Management**
  - Place orders for listings.
  - Retrieve orders for a specific user.
- **Category Endpoints**
  - Fetch listings by category: Pets, Pet Food, Accessories, Pet Care Products.
- **Bulk Operations**
  - Insert multiple listings at once.
  - Delete all listings.

---

## Technology Stack

- **Node.js** & **Express.js** – Server and routing.
- **MongoDB** – Database for listings and orders.
- **CORS** – Enable cross-origin requests.
- **dotenv** – Environment variable management.

---

## Environment Variables

Create a `.env` file in the root directory and provide the following variables:

```env
DB_USER=<your-mongodb-username>
DB_PASS=<your-mongodb-password>
PORT=5000
````

---

## Available API Endpoints

### Listings

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/listings`                 | Create a new listing.             |
| POST   | `/listings-many`            | Insert multiple listings at once. |
| GET    | `/listings`                 | Get all listings.                 |
| GET    | `/recent-listings`          | Get the 6 most recent listings.   |
| GET    | `/listings/:id`             | Get a single listing by ID.       |
| GET    | `/myListings?email=<email>` | Get listings for a specific user. |
| PUT    | `/listings/:id`             | Update a listing by ID.           |
| DELETE | `/listings/:id`             | Delete a listing by ID.           |
| DELETE | `/listings`                 | Delete all listings.              |

### Categories

| Method | Endpoint                        | Description                           |
| ------ | ------------------------------- | ------------------------------------- |
| GET    | `/categories/pets`              | Get all "Pets (Adoption)" listings.   |
| GET    | `/categories/pet-food`          | Get all "Pet Food" listings.          |
| GET    | `/categories/accessories`       | Get all "Accessories" listings.       |
| GET    | `/categories/pet-care-products` | Get all "Pet Care Products" listings. |

### Orders

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/orders`                 | Place a new order.              |
| GET    | `/myOrders?email=<email>` | Get orders for a specific user. |

---

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd paw-mart-server
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file** with MongoDB credentials (see above).

4. **Run the server**

```bash
npm run start
# or for development with auto-restart
npm run dev
```

5. **Server will run on:** `http://localhost:5000`

---

## Testing the Server

You can test endpoints using:

* **Postman**
* **Insomnia**
* **Frontend integration**

Example request to get all listings:

```bash
GET https://vercel.com/abeds-projects-40a481cc/paw-mart-server/
```

---

## Notes

* Ensure MongoDB Atlas or local instance is running.
* Make sure `DB_USER` and `DB_PASS` have proper read/write access.
* Bulk insert (`/listings-many`) expects an array of objects.

---

## License

This project is licensed under the MIT License.
© 2025 PawMart

```

---
