const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Initialize database with default tables
const defaultDb = {
    users: [],
    products: [],
    dashboardData: {} // Keyed by user email: { tasks: [], transactions: [], notes: [], quickNote: '', city: 'İzmir' }
};

function readDb() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf8');
            return defaultDb;
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Database read error, using default database:", e);
        return defaultDb;
    }
}

function writeDb(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error("Database write error:", e);
        return false;
    }
}

module.exports = {
    readDb,
    writeDb
};
