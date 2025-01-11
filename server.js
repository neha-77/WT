const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'StudentPerformance' // Correct database name
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// API endpoint to fetch performance data
app.get('/performance', (req, res) => {
  const studentId = 2; // Replace with dynamic ID from login when ready
  const examId = 1; // Example exam ID, can be parameterized in the future

  const query = `
    SELECT 
      (SELECT AVG(sr.marks) 
       FROM Subject_Result sr
       JOIN Result r ON sr.result_id = r.result_id
       WHERE r.exam_id = ? AND r.studentid != ?) AS peer_avg,
      (SELECT AVG(sr.marks)
       FROM Subject_Result sr
       JOIN Result r ON sr.result_id = r.result_id
       WHERE r.exam_id = ? AND r.studentid = ?) AS student_avg,
      (SELECT AVG(sr.marks)
       FROM Subject_Result sr
       JOIN Result r ON sr.result_id = r.result_id
       WHERE r.studentid = ?) AS overall_avg;
  `;

  db.query(query, [examId, studentId, examId, studentId, studentId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    const peerAverage = results[0]?.peer_avg || 0;
    const studentAverage = results[0]?.student_avg || 0;
    const overallAverage = results[0]?.overall_avg || 0;

    // Log intermediate values for debugging
    console.log({ peerAverage, studentAverage, overallAverage });

    // Avoid division by zero and calculate percentages
    const betterThanPeers = peerAverage !== 0
      ? ((studentAverage - peerAverage) / peerAverage) * 100
      : 0;

    const betterThanYourself = overallAverage !== 0
      ? ((studentAverage - overallAverage) / overallAverage) * 100
      : 0;

    // Prepare chart labels and values for the response
    const chartLabels = ["Peer Average", "Your Average", "Overall Average"];
    const chartValues = [peerAverage, studentAverage, overallAverage];

    // Send the performance data and chart details as a response
    res.json({
      betterThanPeers: Math.round(betterThanPeers * 100) / 100, // Two decimal places
      betterThanYourself: Math.round(betterThanYourself * 100) / 100, // Two decimal places
      chartLabels,
      chartValues
    });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
