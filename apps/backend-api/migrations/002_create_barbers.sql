-- Create a new table 'Barbers' with a primary key and columns
DROP TABLE IF EXISTS Barbers CASCADE;
CREATE TABLE Barbers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    bio TEXT ,
    is_active BOOLEAN DEFAULT true NOT NULL
);