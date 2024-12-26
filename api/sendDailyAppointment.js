const fetch = require("node-fetch");
const { get, set } = require("@vercel/edge-config");

const API_URL = "https://api.intobo.com/SendMessage/3d752c017109baa9d8c32d35d73700375da521fc/+393342495566";
const KEY = "258c81f30d5f2e21b1dd0adae08c08f9e7890163"; // Replace with your API key

module.exports = async (req, res) => {
    try {
        // Fetch appointments from Edge Config
        const data = (await get("appointments")) || [];

        const today = new Date();
        const todayDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        // Filter appointments for today
        const todaysAppointments = data.filter((appointment) => appointment.date === todayDate);

        if (todaysAppointments.length === 0) {
            return res.status(200).json({ message: "No appointments for today." });
        }

        // Send WhatsApp messages
        const sendMessages = todaysAppointments.map((appointment) =>
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "x-api-key": KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to_number: appointment.phone,
                    type: "text",
                    message_text: `Hi ${appointment.name}, this is a reminder for your appointment today at ${appointment.time}.`,
                }),
            })
                .then((response) => response.json())
                .catch((error) => {
                    console.error(`Failed to send message to ${appointment.phone}:`, error);
                })
        );

        await Promise.all(sendMessages);

        res.status(200).json({ message: "Messages sent successfully!" });
    } catch (error) {
        console.error("Error in sending messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
