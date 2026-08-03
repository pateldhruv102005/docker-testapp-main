const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb://admin:qwerty@mongo:27017/apnacollege-db?authSource=admin";

// HOME PAGE
app.get("/", (req, res) => {
  res.send(`
        <h1>CI/CD Test Successful 🚀</h1>

        <h3>Available Routes</h3>

        <a href="/getUsers">Get Users</a><br><br>

        <form action="/addUser" method="POST">
            <input type="text" name="username" placeholder="Username" required><br><br>

            <input type="email" name="email" placeholder="Email" required><br><br>

            <input type="password" name="password" placeholder="Password" required><br><br>

            <button type="submit">Add User</button>
        </form>

        <br>

        <a href="/updateUser">Update User</a><br><br>

        <a href="/deleteAllUsers">Delete All Users</a>
    `);
});

// GET USERS
app.get("/getUsers", async (req, res) => {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();

    const db = client.db("apnacollege-db");
    const users = await db.collection("users").find({}).toArray();

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    await client.close();
  }
});

// ADD USER
app.post("/addUser", async (req, res) => {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();

    const db = client.db("apnacollege-db");

    await db.collection("users").insertOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.send(`
            <h2>User Added Successfully ✅</h2>
            <a href="/">Go Back</a>
        `);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    await client.close();
  }
});

// UPDATE USER
app.get("/updateUser", async (req, res) => {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();

    const db = client.db("apnacollege-db");

    await db.collection("users").updateOne(
      { email: "dhruv@example.com" },
      {
        $set: {
          username: "Dhruv Patel",
        },
      }
    );

    res.send("User Updated Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    await client.close();
  }
});

// DELETE ALL USERS
app.get("/deleteAllUsers", async (req, res) => {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();

    const db = client.db("apnacollege-db");

    await db.collection("users").deleteMany({});

    res.send("All Users Deleted Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});