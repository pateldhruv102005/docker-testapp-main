const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5050;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";

// GET USERS
app.get("/getUsers", async (req, res) => {
    const client = new MongoClient(MONGO_URL);

    try {
        await client.connect();

        const db = client.db("apnacollege-db");
        const users = await db.collection("users").find({}).toArray();

        res.json(users);
    } catch (err) {
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
            password: req.body.password
        });

        res.send(`
            <h2>User Added Successfully ✅</h2>
            <a href="/">Go Back</a>
        `);

    } catch (err) {
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
                    username: "Dhruv Patel"
                }
            }
        );

        res.send("User Updated Successfully");
    } catch (err) {
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
        res.status(500).send(err.message);
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});