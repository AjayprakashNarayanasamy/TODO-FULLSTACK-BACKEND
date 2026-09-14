require("dotenv").config();

const fs = require("fs");
const path = require("path");

const pool = require("./pool");

const migrationsDirectory = path.join(__dirname, "migrations");

async function runMigrations() {
  const client = await pool.connect();

  try {
    // Bootstrap migration history table.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGSERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const files = fs
      .readdirSync(migrationsDirectory)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const result = await client.query(
        `
          SELECT 1
          FROM schema_migrations
          WHERE migration_name = $1
        `,
        [file]
      );

      if (result.rowCount > 0) {
        console.log(`Skipping migration: ${file}`);
        continue;
      }

      const filePath = path.join(migrationsDirectory, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Running migration: ${file}`);

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `
            INSERT INTO schema_migrations (migration_name)
            VALUES ($1)
          `,
          [file]
        );

        await client.query("COMMIT");

        console.log(`Completed migration: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("All migrations completed.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();