const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // For working with file paths

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve the index.html file when accessing the root URL (http://localhost:3000)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to handle form submission
app.post('/submit-score', (req, res) => {
    const { name, class: userClass, score } = req.body;

    // Check if required fields are present
    if (!name || !userClass || score === undefined) {
        return res.status(400).json({
            message: 'Missing required fields: name, class, or score.',
        });
    }

    // Log the submission to the console
    console.log('Received submission:', req.body);

    // File path to save participant details
    const filePath = path.join(__dirname, 'participants.json');

    try {
        // Read existing data or initialize an empty array
        let participants = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            participants = JSON.parse(fileData);
        }

        // Add the new participant's data
        participants.push({ name, class: userClass, score });

        // Save the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(participants, null, 2), 'utf-8');

        // Send a success response with the participant's data
        res.json({
            message: 'Quiz submission received and saved!',
            name,
            class: userClass,
            score,
        });
    } catch (error) {
        console.error('Error handling participant data:', error);
        res.status(500).json({ message: 'An error occurred while saving the data.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
