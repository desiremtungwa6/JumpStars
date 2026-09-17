const { initializeApp, cert } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

const serviceAccount = require("../firebase-service-account.json");

const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://amd-monitoring-system-default-rtdb.firebaseio.com/"
});

const db = getDatabase(app);

module.exports = db;