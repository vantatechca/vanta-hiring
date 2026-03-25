const fs = require("fs");
const path = require("path");
const logger = require("./logger");

async function runMigrations(pool) {
  // Create migrations tracking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Get already-applied migrations
  const { rows: applied } = await pool.query(
    "SELECT filename FROM schema_migrations ORDER BY id",
  );
  const appliedSet = new Set(applied.map((r) => r.filename));

  // Read migration files
  const migrationsDir = path.join(__dirname, "..", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    logger.info("No migrations directory found, skipping migrations");
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let migrationsRun = 0;
  for (const file of files) {
    if (appliedSet.has(file)) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    logger.info("Running migration", { file });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      migrationsRun++;
      logger.info("Migration applied successfully", { file });
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("Migration failed", { file, error: err.message });
      throw err;
    } finally {
      client.release();
    }
  }

  if (migrationsRun === 0) {
    logger.info("All migrations already applied");
  } else {
    logger.info("Migrations complete", { count: migrationsRun });
  }
}

module.exports = { runMigrations };
