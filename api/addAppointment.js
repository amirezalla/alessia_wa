const { get, set } = require("@vercel/edge-config");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, phone, date, time } = req.body;

    if (!name || !phone || !date || !time) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Fetch existing appointments from Edge Config
        const data = (await get("appointments")) || [];

        // Add new appointment
        data.push({ name, phone, date, time });

        // Update the appointments key in Edge Config
        await set("appointments", data);

        res.status(200).json({ message: "Appointment added successfully!", data });
    } catch (error) {
        console.error("Error adding appointment:", error);
        res.status(500).json({ error: "Failed to add appointment" });
    }
};
