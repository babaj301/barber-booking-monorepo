-- 1. Install extension required for mixing scalar types and range types in constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Create the custom time range type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'timerange') THEN
        CREATE TYPE timerange AS RANGE (subtype = time);
    END IF;
END $$;

-- 3. Clear existing table structure
DROP TABLE IF EXISTS Availability CASCADE;

-- 4. Create the final Availability table
CREATE TABLE Availability (
    availability_id SERIAL PRIMARY KEY,
    barber_id INT REFERENCES Barbers(id) NOT NULL,
    
    -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    day_of_week INT NOT NULL CHECK(day_of_week BETWEEN 0 AND 6), 
    shift_hours TIMERANGE NOT NULL,

    -- Rule: Ensure shift hours fall strictly within corporate business hours
    CONSTRAINT chk_conditional_business_hours CHECK (
        (day_of_week = 0 AND shift_hours <@ timerange('12:00:00', '18:00:00', '[]')) OR -- Sunday (12 PM - 6 PM)
        (day_of_week BETWEEN 1 AND 6 AND shift_hours <@ timerange('09:00:00', '20:00:00', '[]')) -- Mon-Sat (9 AM - 8 PM)
    ),

    -- Rule: Prevent a barber from having overlapping shift blocks on the same day [9.3]
    CONSTRAINT no_overlapping_barber_shifts EXCLUDE USING gist (
        barber_id WITH =,
        day_of_week WITH =,
        shift_hours WITH &&
    )
);
