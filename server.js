require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Multer: store ID image as buffer in memory, save base64 to DB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed (JPG, PNG, WEBP)"));
  },
});

app.use(cors());
app.use(express.json());

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
}

// Initialize DB table
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applicants (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        date_of_birth DATE NOT NULL,
        id_image TEXT,
        id_image_type VARCHAR(50),
        marital_status VARCHAR(50),
        available_weekends BOOLEAN DEFAULT false,
        available_evenings BOOLEAN DEFAULT false,
        on_call_emergencies BOOLEAN DEFAULT false,
        has_drivers_license BOOLEAN DEFAULT false,
        startup_mindset BOOLEAN DEFAULT false,
        has_second_job BOOLEAN DEFAULT false,
        second_job_details TEXT,
        other_commitments TEXT,
        commitment_level VARCHAR(20),
        nda_agreed BOOLEAN DEFAULT false,
        submitted_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Database table ready");
  } catch (err) {
    console.error("❌ DB init error:", err.message);
  }
}

// POST /api/apply — submit application
app.post("/api/apply", upload.single("id_image"), async (req, res) => {
  try {
    const {
      full_name,
      phone,
      date_of_birth,
      marital_status,
      available_weekends,
      available_evenings,
      on_call_emergencies,
      has_drivers_license,
      startup_mindset,
      has_second_job,
      second_job_details,
      other_commitments,
      commitment_level,
      nda_agreed,
    } = req.body;

    // Validation
    if (!full_name || !phone || !date_of_birth) {
      return res.status(400).json({ error: "Full name, phone, and date of birth are required." });
    }
    if (nda_agreed !== "true" && nda_agreed !== true) {
      return res.status(400).json({ error: "You must agree to the NDA terms to proceed." });
    }

    let id_image = null;
    let id_image_type = null;
    if (req.file) {
      id_image = req.file.buffer.toString("base64");
      id_image_type = req.file.mimetype;
    }

    const result = await pool.query(
      `INSERT INTO applicants
        (full_name, phone, date_of_birth, id_image, id_image_type, marital_status,
         available_weekends, available_evenings, on_call_emergencies,
         has_drivers_license, startup_mindset,
         has_second_job, second_job_details, other_commitments, commitment_level,
         nda_agreed)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING id, full_name, submitted_at`,
      [
        full_name.trim(),
        phone.trim(),
        date_of_birth,
        id_image,
        id_image_type,
        marital_status || null,
        available_weekends === "true" || available_weekends === true,
        available_evenings === "true" || available_evenings === true,
        on_call_emergencies === "true" || on_call_emergencies === true,
        has_drivers_license === "true" || has_drivers_license === true,
        startup_mindset === "true" || startup_mindset === true,
        has_second_job === "true" || has_second_job === true,
        second_job_details?.trim() || null,
        other_commitments?.trim() || null,
        commitment_level || null,
        true,
      ]
    );

    res.json({
      success: true,
      message: "Application submitted successfully!",
      applicant: result.rows[0],
    });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// GET /api/applicants — view all (protected by simple token)
app.get("/api/applicants", async (req, res) => {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      `SELECT id, full_name, phone, date_of_birth, marital_status,
              available_weekends, available_evenings, on_call_emergencies,
              has_drivers_license, startup_mindset, nda_agreed, submitted_at
       FROM applicants ORDER BY submitted_at DESC`
    );
    res.json({ applicants: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/applicants/:id/id-image — fetch ID image
app.get("/api/applicants/:id/id-image", async (req, res) => {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      "SELECT id_image, id_image_type FROM applicants WHERE id = $1",
      [req.params.id]
    );
    if (!result.rows[0] || !result.rows[0].id_image) {
      return res.status(404).json({ error: "No image found" });
    }
    const { id_image, id_image_type } = result.rows[0];
    const buffer = Buffer.from(id_image, "base64");
    res.set("Content-Type", id_image_type);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Catch-all for React router
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
  });
}

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
