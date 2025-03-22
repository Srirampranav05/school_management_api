import pool from "../config/db.js";

export async function addSchool(name, address, latitude, longitude) {
  await pool.query(
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
    [name, address, latitude, longitude]
  );
}

export async function getAllSchools() {
  const [rows] = await pool.query("SELECT * FROM schools");
  return rows;
}
