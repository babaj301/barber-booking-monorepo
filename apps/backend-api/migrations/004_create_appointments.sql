CREATE TYPE status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create a new table 'Appointments' with a primary key and columns
DROP TABLE IF EXISTS Appointments CASCADE;
CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Users(id),
    barber_id INT REFERENCES Barbers(id),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    current_status status
);