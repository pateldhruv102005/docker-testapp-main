const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

// GET USERS
app.get("/getUsers", async (req, res) => {

    await client.connect();

    const db = client.db("apnacollege-db");

    const data = await db.collection("users").find({}).toArray();

    await client.close();

    res.send(data);
});

// ADD USER
app.post("/addUser", async (req, res) => {

    const userObj = req.body;

    await client.connect();

    const db = client.db("apnacollege-db");

    await db.collection("users").insertOne(userObj);

    await client.close();

    res.redirect("/");
});
//delete user
app.get("/deleteAllUsers", async (req, res) => {

    await client.connect();

    const db = client.db("apnacollege-db");

    await db.collection("users").deleteMany({});

    await client.close();

    res.send("All Users Deleted Successfully");

});
app.get("/updateUser", async (req, res) => {

    await client.connect();

    const db = client.db("apnacollege-db");

    await db.collection("users").updateOne(
        { email: "kilet260@gmail.com" },
        {
            $set: {
                username: "Dhruv"
            }
        }
    );

    await client.close();

    res.send("User Updated Successfully");

});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});