const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "test",
  host: "db",
  port: 5432
});

// Example query execution
pool.query('CREATE DATABASE perntodo;', (err, result) => {
  if (err) {
    console.error('Error making database', err);
  } else {
    pool.query('USE perntodo;');
    console.log('Table created successfully');
  }
});

pool.query('CREATE TABLE todo(todo_id SERIAL PRIMARY KEY, description VARCHAR(255));', (err, result) => {
  if (err) {
    console.error('Error making table', err);
  } else {
    console.log('Table created successfully');
  }
});


module.exports = pool;


