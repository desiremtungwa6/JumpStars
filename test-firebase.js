const db = require("./config/firebase");

async function testFirebase() {
    try {
        const testData = {
            system: "AMD Monitoring System",
            status: "Firebase connected",
            timestamp: new Date().toISOString()
        };

        const ref = db.ref("systemTest");
        const result = await ref.push(testData);

        console.log("Firebase connection successful!");
        console.log("Test ID:", result.key);
    } catch (error) {
        console.error("Firebase connection failed:");
        console.error(error);
    }
}

testFirebase();