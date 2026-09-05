-- 1. Create extension for range constraints if not created yet
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Create custom timerange type if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'timerange') THEN
        CREATE TYPE timerange AS RANGE (subtype = time);
    END IF;
END $$;

-- 3. Re-create Exceptions Table
DROP TABLE IF EXISTS Exceptions CASCADE;

CREATE TABLE Exceptions (
    exceptions_id SERIAL PRIMARY KEY,
    barber_id INT NOT NULL REFERENCES Barbers(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_day_off BOOLEAN NOT NULL DEFAULT true,
    shift_hours TIMERANGE,
    reason TEXT,
    
    -- Enforce shift_hours when is_day_off is false
    CONSTRAINT chk_exception_shift_hours CHECK (
        (is_day_off = true) OR (is_day_off = false AND shift_hours IS NOT NULL)
    ),

    -- Ensure a barber only has one exception per date
    CONSTRAINT unique_barber_exception_date UNIQUE(barber_id, exception_date)
);

-- 4. Create Performance Indexes for Fast Availability Lookups
CREATE INDEX IF NOT EXISTS idx_exceptions_barber_date ON Exceptions(barber_id, exception_date);
CREATE INDEX IF NOT EXISTS idx_availability_barber_day ON Availability(barber_id, day_of_week);