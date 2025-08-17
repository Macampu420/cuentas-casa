import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000,
});

// Ensure all sessions run in UTC so defaults like now() are UTC
pool.on("connect", client => {
  client.query("SET TIME ZONE 'UTC'").catch(() => {
    // ignore
  });
});

pool
  .connect()
  .then(client => {
    console.log("✅ Base de datos conectada");
    client.release(); // liberamos el cliente
  })
  .catch(err => {
    console.error("❌ Error conectando a la base de datos:", err);
  });

export const db = drizzle(pool);
