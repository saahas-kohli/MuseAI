const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_SCHEMA || 'public',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'test',
  {
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL == 'true',
    },
  }
);

// Create a new database named "perntodo" (lowercase)
sequelize.query('CREATE DATABASE perntodo;')
  .then(() => {
    console.log('Database "perntodo" created successfully');
  })
  .catch((error) => {
    if (error.name !== 'SequelizeDatabaseError' || error.parent.code !== '42P04') {
      // Ignore "database already exists" errors, handle other errors
      console.error('Error creating database:', error);
    }
  })
  .finally(() => {
    // Switch to the new database
    sequelize.close();
    const pernTodoSequelize = new Sequelize(
      'perntodo',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'test',
      {
        host: process.env.DB_HOST || 'db',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
          ssl: process.env.DB_SSL == 'true',
        },
      }
    );

    // models/todo.js
    const todo = pernTodoSequelize.define(
      'todo', // Model name in lowercase
      {
        todo_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        description: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        tableName: 'todo', // Table name in lowercase
      }
    );

    // Sync the model with the database
    pernTodoSequelize.sync()
      .then(() => {
        console.log('Database and table synced successfully');
      })
      .catch((error) => {
        console.error('Error syncing database:', error);
      });
  });

module.exports = sequelize;
