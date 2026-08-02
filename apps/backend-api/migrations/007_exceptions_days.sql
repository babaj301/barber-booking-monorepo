DROP TABLE IF EXISTS Exceptions CASCADE;

CREATE TABLE Exceptions (
  exceptions_id SERIAL PRIMARY KEY,
  barber_id INT REFERENCES Barbers(id),
  exception_date DATE,
  reason TEXT
);