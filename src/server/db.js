const Database = require('better-sqlite3');

module.exports = () => {
  const db = new Database(null, {
    memory: true,
  });

  const createRideTableSchema = `
        CREATE TABLE Rides
        (
        rideID INTEGER PRIMARY KEY AUTOINCREMENT,
        startLat DECIMAL NOT NULL,
        startLong DECIMAL NOT NULL,
        endLat DECIMAL NOT NULL,
        endLong DECIMAL NOT NULL,
        riderName TEXT NOT NULL,
        driverName TEXT NOT NULL,
        driverVehicle TEXT NOT NULL,
        created DATETIME default CURRENT_TIMESTAMP
        )
    `;

  return db.exec(createRideTableSchema);
};
