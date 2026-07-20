DROP TYPE IF EXISTS role CASCADE;
CREATE TYPE role AS ENUM ('client', 'barber', 'admin');

DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users (
  id  SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_role  role NOT NULL DEFAULT 'client',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);