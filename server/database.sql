/* This file is not necessary. It just shows what the database started off with. */
CREATE DATABASE perntodo;

CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    audio TEXT
);

CREATE TABLE authentication(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE email_verification ( email VARCHAR(255) NOT NULL UNIQUE, token VARCHAR(255), is_verified BOOLEAN NOT NULL DEFAULT FALSE );

/* Remaining tables like 'todo' but with names corresponding to user emails */