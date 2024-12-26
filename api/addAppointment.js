const { get } = require("@vercel/edge-config");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const EDGE_CONFIG_ID = "ecfg_mto8g7fjl7onvugnv6bdpe2wddao";
const EDGE_CONFIG_TOKEN = "fFO1EbvmMyyVXbdhB4kvmIsF";

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
        const response = await fetch(`https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${EDGE_CONFIG_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: [
                    {
                        operation: "update",
                        key: "appointments",
                        value: data,
                    },
                ],
            }),
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error("Failed to update Edge Config:", responseBody);
            throw new Error("Failed to update Edge Config");
        }

        res.status(200).json({ message: "Appointment added successfully!", data });
    } catch (error) {
        console.error("Error adding appointment:", error);
        res.status(500).json({ error: "Failed to add appointment" });
    }
};
