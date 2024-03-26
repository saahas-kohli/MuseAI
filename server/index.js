const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//create a todo for a user

app.post("/todos/:user", async (req, res) => {
  try {
    const { defaultDescription } =
      req.body; /* this variable must have the same name as whatever key is in req.body! */
    const { user } = req.params;
    const newTodo = await pool.query(
      `INSERT INTO ${user} (description) VALUES($1) RETURNING *`,
      [defaultDescription]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create a user

app.post("/todos/:email/:password", async (req, res) => {
  try {
    const { email, password } = req.params;
    const lowercaseEmail = email.toLowerCase();
    const newUser = await pool.query(
      `CREATE TABLE $1(todo_id SERIAL PRIMARY KEY, description VARCHAR(255));`,
      [lowercaseEmail]
    );
    const newIdentifier = await pool.query(
      `INSERT INTO authentication (email, password) VALUES($1, $2);`,
      [lowercaseEmail, password]
    );
    res.json("New user created!");
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos for a user

app.get("/todos/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const allTodos = await pool.query(`SELECT * FROM ${user}`);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo for a user

app.get("/todos/:user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.params;
    const todo = await pool.query(`SELECT * FROM ${user} WHERE todo_id = $1`, [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get (authenticate) a user

app.get("/todos/:email/:password", async (req, res) => {
  try {
    const { email, password } = req.params;
    const lowercaseEmail = email.toLowerCase();
    const selectedEmail = await pool.query(
      `SELECT * FROM authentication WHERE email = $1;`,
      [lowercaseEmail]
    );
    if (selectedUser.rowCount > 0) {
      const selectedUser = await pool.query(
        `SELECT email, password FROM authentication WHERE email = $1 AND password = $2;`,
        [lowercaseEmail, password]
      );
      if (selectedUser.rowCount > 0) {
        res.json({ emailExists: true, userExists: true });
      } else {
        res.json({ emailExists: true, userExists: false });
      }
    } else {
      res.json({ emailExists: false, userExists: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo for a user

app.put("/todos/:user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      `UPDATE ${user} SET description = $1 WHERE todo_id = $2`,
      [description, id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo for a user

app.delete("/todos/:user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.params;
    const deleteTodo = await pool.query(
      `DELETE FROM ${user} WHERE todo_id = $1`,
      [id]
    );
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

//initialize server

app.listen(9000, () => {
  console.log("server has started on port 9000");
});
