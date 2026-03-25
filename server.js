require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const logger = require("./lib/logger");
const { runMigrations } = require("./lib/migrate");

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
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed (JPG, PNG, WEBP)"));
  },
});

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("request", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: duration,
    });
  });
  next();
});

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
}

// --- Validation helpers ---
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'.,-]{2,100}$/;

function isValidDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();
  const dayDiff = now.getDate() - date.getDate();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  return actualAge >= 16 && actualAge <= 120;
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
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: "Full name is required." });
    }
    if (!NAME_REGEX.test(full_name.trim())) {
      return res
        .status(400)
        .json({ error: "Full name contains invalid characters." });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    if (!PHONE_REGEX.test(phone.trim())) {
      return res
        .status(400)
        .json({ error: "Please enter a valid phone number (7-20 digits)." });
    }
    if (!date_of_birth) {
      return res.status(400).json({ error: "Date of birth is required." });
    }
    if (!isValidDate(date_of_birth)) {
      return res
        .status(400)
        .json({ error: "Invalid date of birth. Applicant must be between 16 and 120." });
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
      ],
    );

    logger.info("Application submitted", {
      applicant_id: result.rows[0].id,
      name: result.rows[0].full_name,
    });

    res.json({
      success: true,
      message: "Application submitted successfully!",
      applicant: result.rows[0],
    });
  } catch (err) {
    logger.error("Submit error", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// GET /api/applicants — view all (protected by simple token)
app.get("/api/applicants", async (req, res) => {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    logger.warn("Unauthorized access attempt to /api/applicants", {
      ip: req.ip,
    });
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      `SELECT id, full_name, phone, date_of_birth, marital_status,
              available_weekends, available_evenings, on_call_emergencies,
              has_drivers_license, startup_mindset, nda_agreed, submitted_at
       FROM applicants ORDER BY submitted_at DESC`,
    );
    logger.info("Applicants list fetched", { count: result.rows.length });
    res.json({ applicants: result.rows });
  } catch (err) {
    logger.error("Fetch applicants error", { error: err.message });
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/applicants/:id/id-image — fetch ID image
app.get("/api/applicants/:id/id-image", async (req, res) => {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    logger.warn("Unauthorized access attempt to id-image", {
      ip: req.ip,
      applicant_id: req.params.id,
    });
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      "SELECT id_image, id_image_type FROM applicants WHERE id = $1",
      [req.params.id],
    );
    if (!result.rows[0] || !result.rows[0].id_image) {
      return res.status(404).json({ error: "No image found" });
    }
    const { id_image, id_image_type } = result.rows[0];
    const buffer = Buffer.from(id_image, "base64");
    res.set("Content-Type", id_image_type);
    res.send(buffer);
  } catch (err) {
    logger.error("Fetch id-image error", {
      error: err.message,
      applicant_id: req.params.id,
    });
    res.status(500).json({ error: "Server error" });
  }
});

// Catch-all for React router
if (process.env.NODE_ENV === "production") {
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
  });
}

async function start() {
  try {
    await runMigrations(pool);
    logger.info("Database migrations complete");
  } catch (err) {
    logger.error("Failed to run migrations", { error: err.message });
    process.exit(1);
  }

  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

start();
