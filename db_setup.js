const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSetup() {
    // 1. Verbindung aufbauen mit deinen Umgebungsvariablen
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false } // Zwingend erforderlich für Aiven
    });

    console.log("Connecte zu Aiven...");

    try {
        // 2. Der SQL-Befehl zum Erstellen der Tabelle
        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            uid INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        await connection.query(createTableSQL);
        console.log("✅ Tabelle 'users' wurde erfolgreich erstellt (oder existierte bereits).");

        // 3. Optional: Kurzer Test-Check
        const [rows] = await connection.query("SHOW TABLES LIKE 'users'");
        if (rows.length > 0) {
            console.log("🚀 Datenbank ist bereit für Registrierungen!");
        }

    } catch (err) {
        console.error("❌ Fehler beim Setup:");
        console.error(err.message);

        if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
            console.log("\nTipp: Überprüfe, ob deine IP in der Aiven-Konsole freigeschaltet ist!");
        }
    } finally {
        // Verbindung schließen
        await connection.end();
        process.exit();
    }
}

runSetup();