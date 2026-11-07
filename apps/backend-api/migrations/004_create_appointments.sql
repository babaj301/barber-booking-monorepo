
DROP TYPE IF EXISTS status CASCADE;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create a new table 'Appointments' with a primary key and columns
DROP TABLE IF EXISTS Appointments CASCADE;
CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES Users(id),
    barber_id INT NOT NULL REFERENCES Barbers(id),
    service_id     INT NOT NULL REFERENCES Services(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    current_status status NOT NULL DEFAULT 'confirmed',

    CHECK (start_time < end_time),  -- Ensure start_time is before end_time

    created_at TIMESTAMPTZ DEFAULT NOW(),

    EXCLUDE USING gist (
        barber_id WITH =,
        tstzrange(start_time, end_time) WITH &&) WHERE (current_status <> 'cancelled')  --cancelled appointments free the slot 
);

