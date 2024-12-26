const { get } = require("@vercel/edge-config");
const fetch = require("node-fetch");

const EDGE_CONFIG_ID = "alessia-wa-token"; // Replace with your Edge Config ID
const EDGE_CONFIG_TOKEN = process.env.EDGE_CONFIG_TOKEN; // Use a Vercel Environment Variable

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

        // Update Edge Config using the API
        const response = await fetch(`https://edge-config.vercel.com/v1/configs/${EDGE_CONFIG_ID}/items`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${EDGE_CONFIG_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: [
                    {
                        operation: "set",
                        key: "appointments",
                        value: data,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update Edge Config");
        }

        res.status(200).json({ message: "Appointment added successfully!", data });
    } catch (error) {
        console.error("Error adding appointment:", error);
        res.status(500).json({ error: "Failed to add appointment" });
    }
};
