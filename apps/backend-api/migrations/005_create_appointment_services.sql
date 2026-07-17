
DROP TABLE IF EXISTS Appointment_services CASCADE;

CREATE TABLE Appointment_services (
    appointment_id INT REFERENCES Appointments(id) ON DELETE CASCADE,
    service_id INT REFERENCES Services(id) ON DELETE CASCADE,
    PRIMARY KEY (appointment_id, service_id)
);