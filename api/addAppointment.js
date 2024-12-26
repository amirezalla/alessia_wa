const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, phone, date, time } = req.body;

    if (!name || !phone || !date || !time) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const filePath = path.resolve("../appointments.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Add new appointment
    data.push({ name, phone, date, time });

    // Save updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: "Appointment added successfully!" });
};
