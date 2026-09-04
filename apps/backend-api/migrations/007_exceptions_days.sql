-- Up Migration: Exceptions & Availability

DROP TABLE IF EXISTS Exceptions CASCADE;

CREATE TABLE Exceptions (
    exceptions_id SERIAL PRIMARY KEY,
    barber_id INT NOT NULL REFERENCES Barbers(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_day_off BOOLEAN NOT NULL DEFAULT true,
    shift_hours TIMERANGE,
    reason TEXT,
    
    -- Enforce that if it's not a full day off, shift_hours must be provided
    CONSTRAINT chk_exception_shift_hours CHECK (
        (is_day_off = true) OR (is_day_off = false AND shift_hours IS NOT NULL)
    ),

    -- Ensure a barber can only have one exception per date
    CONSTRAINT unique_barber_exception_date UNIQUE(barber_id, exception_date)
);

-- Index for high-performance availability lookups by date
CREATE INDEX idx_exceptions_barber_date ON Exceptions(barber_id, exception_date);
CREATE INDEX idx_availability_barber_day ON Availability(barber_id, day_of_week);