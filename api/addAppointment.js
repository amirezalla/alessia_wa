let appointments = []; // In-memory storage

module.exports = (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, phone, date, time } = req.body;

    if (!name || !phone || !date || !time) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Add new appointment
    appointments.push({ name, phone, date, time });

    res.status(200).json({ message: "Appointment added successfully!", data: appointments });
};
