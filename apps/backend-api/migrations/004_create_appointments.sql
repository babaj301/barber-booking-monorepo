-- 1. Install extension required for mixing scalar types and range types in constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

DROP TYPE IF EXISTS status CASCADE;
CREATE TYPE status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create a new table 'Appointments' with a primary key and columns
DROP TABLE IF EXISTS Appointments CASCADE;
CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    barber_id INT REFERENCES Barbers(id),
    appointment_time TSRANGE,
    status status NOT NULL DEFAULT 'confirmed',

    CONSTRAINT no_overlapping_appointments EXCLUDE USING gist(
      barber_id WITH =,
      appointment_time WITH &&
    )
);

