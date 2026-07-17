-- Create a new table 'Services' with a primary key and columns
DROP TABLE IF EXISTS Services CASCADE;

CREATE TABLE  Services (
    id SERIAL PRIMARY KEY,
    name TEXT,
    price DECIMAL,
    duration_minutes INT
);