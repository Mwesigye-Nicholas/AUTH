const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 5000;
app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});
app.post("/users", async (req, res) => {
  try {
    //*const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    //console.log(users);
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});
app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name == req.body.name);
  if (user === null) return res.status(400).send("Cannot find the user");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Successfully! logged In");
    } else {
      res.send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
