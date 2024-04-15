const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("./emailSender");
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//add song description for a user (create song for first time)

app.post("/todos/:user", async (req, res) => {
  try {
    const { defaultDescription } =
      req.body; /* this variable must have the same name as whatever key is in req.body! */
    const { user } = req.params;
    const newTodo = await pool.query(
      `INSERT INTO "${user}" (description) VALUES($1) RETURNING *;`,
      [defaultDescription]
    );
    console.log(newTodo.rows[0].todo_id);
    res.json(newTodo.rows[0].todo_id);
  } catch (err) {
    console.error(err.message);
  }
});

//add audio data for a user

app.post("/audio/:user/:id", async (req, res) => {
  try {
    console.log("Request received!");
    const { audioData } =
      req.body; /* this variable must have the same name as whatever key is in req.body! */
    const { user } = req.params;
    const { id } = req.params;
    //console.log(typeof audioData);
    console.log(user);
    console.log(audioData.substring(0, 5));
    console.log(id);
    const newTodo = await pool.query(
      `UPDATE "${user}" SET audio = $1 WHERE todo_id = $2;`,
      [audioData, id]
    );
    //console.log(newTodo);
    res.json("Audio added!");
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
      `CREATE TABLE "${lowercaseEmail}" (todo_id SERIAL PRIMARY KEY, description VARCHAR(255), audio TEXT);`
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

// create a table not named after any other email and not named "authentication"
app.post("/createGuestTable/:guestName", async (req, res) => {
  try {
    const { guestName } = req.params;
    const newUser = await pool.query(
      `CREATE TABLE "${guestName}" (todo_id SERIAL PRIMARY KEY, description VARCHAR(255), audio TEXT);`
    );
    res.json("Temporary guest table created!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete the randomized guest table
app.post("/deleteGuestTable/:guestName", async (req, res) => {
  try {
    const { guestName } = req.params;
    await pool.query(`DROP TABLE IF EXISTS "${guestName}";`);
    res.json(`Temporary guest table ${guestName} deleted!`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Error while deleting the table");
  }
});

//send verification email

app.post("/send-verify/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const lowercaseEmail = email.toLowerCase();
    await sendVerificationEmail(lowercaseEmail);
    res.json("Verification email sent!");
  } catch (err) {
    console.error(err.message);
  }
});

//send forgot-password email

app.post("/forgot-password/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const lowercaseEmail = email.toLowerCase();
    await sendForgotPasswordEmail(lowercaseEmail);
    res.json("Forgot-password email sent!");
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos for a user

app.get("/todos/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const allTodos = await pool.query(`SELECT * FROM "${user}";`);
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
    const todo = await pool.query(
      `SELECT * FROM "${user}" WHERE todo_id = $1;`,
      [id]
    );
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get audio for a user

app.get("/audio/:user/:id", async (req, res) => {
  try {
    const { user } = req.params;
    const { id } = req.params;
    if (id === "-1" || id === -1) {
      res.json({ exists: false, audioData: "invalid id" });
    } else {
      const data = await pool.query(
        `SELECT audio FROM "${user}" WHERE todo_id = $1;`,
        [id]
      );
      if (data.rowCount === 0)
        res.json({ exists: false, audioData: "invalid id" });
      else res.json({ exists: true, audioData: data.rows[0].audio });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// get (authenticate) a user

app.get("/users/:email/:password", async (req, res) => {
  try {
    const { email, password } = req.params;
    const lowercaseEmail = email.toLowerCase();
    const selectedEmail = await pool.query(
      `SELECT email, password FROM authentication WHERE email = $1;`,
      [lowercaseEmail]
    );
    let wasEmailVerified = false;
    if (selectedEmail.rowCount > 0) {
      const selectedUser = await pool.query(
        `SELECT email, password FROM authentication WHERE email = $1 AND password = $2;`,
        [lowercaseEmail, password]
      );
      const verifyEmailResult = await pool.query(
        `SELECT is_verified FROM email_verification WHERE email = $1;`,
        [lowercaseEmail]
      );
      if (verifyEmailResult.rowCount > 0) {
        // If a row was found, update wasEmailVerified with the value of is_verified from the database
        wasEmailVerified = verifyEmailResult.rows[0].is_verified;
        //console.log(verifyEmailResult.rows[0].is_verified);
      }
      if (selectedUser.rowCount > 0) {
        res.json({
          emailExists: true,
          emailVerified: wasEmailVerified,
          userExists: true,
        });
      } else {
        res.json({
          emailExists: true,
          emailVerified: wasEmailVerified,
          userExists: false,
        });
      }
    } else {
      res.json({
        emailExists: false,
        emailVerified: wasEmailVerified,
        userExists: false,
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// Verify a user's email address.

app.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    const verificationResult = await pool.query(
      `UPDATE email_verification SET is_verified = TRUE WHERE token = $1 RETURNING *;`,
      [token]
    );
    if (verificationResult.rows.length > 0) {
      res.json({ was_verified: true });
    } else {
      res.json({ was_verified: false });
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
      `UPDATE "${user}" SET description = $1 WHERE todo_id = $2;`,
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
      `DELETE FROM "${user}" WHERE todo_id = $1;`,
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
