const express = require("express");
const app = express();

const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.post("/todo", async (req, res) => {
  try {
    console.log(req.body);
    const date = new Date();
    if (request.body.title.trim() === "") {
      return res.send(422, "Title cannot be empty!");
    }
    const newTodoItem = {
      title: req.body.title,
      description: req.body.description,
      createdAt: date,
    };
    const responce = db.collection("todos").add(newTodoItem);
    res.json(responce);
  } catch (error) {
    res.send(400, "Oops, something ent wrong!");
    console.error(error);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = db.collection("todos");
    const responce = await todos.get();
    let todosArray = [];
    responce.forEach((doc) => {
      todosArray.push(doc.data());
    });
    res.json(todosArray);
  } catch (error) {
    res.send(error);
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = db.collection("todos").doc(req.params.id);
    const responce = await todo.get();
    res.json(responce.data());
  } catch (error) {
    res.send(error);
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.send(422, "Cannot add todo(s). Check input data!");
      return;
    }
    if (req.body.id || req.body.createdAt) {
      res.send(400, "Not allowed to edit");
    }

    const todoUpdated = await db
      .collection("todos")
      .doc(req.params.id)
      .update(req.body);
    res.json(todoUpdated);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const responce = await db.collection("todos").doc(req.params.id).delete();
    res.json(responce);
  } catch (error) {
    res.send(error);
  }
});
