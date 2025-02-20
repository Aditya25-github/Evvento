const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Allows JSON data parsing

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "evvento",
  password: "",
  port: 5432, // Default PostgreSQL port
});

// API to fetch data
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM your_table");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
