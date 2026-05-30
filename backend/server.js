const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(cors());
app.use(express.json());

// DATABASE CONNECTION

const db = new sqlite3.Database("./database.db", (err) => {

  if (err) {
    console.log(err.message);
  } else {
    console.log("✅ SQLite Connected");
  }

});

// CREATE TABLE

db.run(`
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT,
  drug_name TEXT,
  quantity INTEGER
)
`);

// INSERT SAMPLE DATA

db.run(`
INSERT INTO inventory (category, drug_name, quantity)
VALUES
('Painkillers', 'Paracetamol', 100),
('Diabetes', 'Insulin', 30),
('Antibiotics', 'Amoxicillin', 120)
`);

// GET INVENTORY API

app.get("/inventory", (req, res) => {

  db.all(
    "SELECT * FROM inventory",
    [],
    (err, rows) => {

      if (err) {
        res.status(500).json(err);
      } else {
        res.json(rows);
      }

    }
  );

});

// REQUEST DRUG API

app.post("/request-drug", (req, res) => {

  const { category, drug_name, quantity } = req.body;

  db.get(
    `SELECT * FROM inventory
     WHERE category = ?
     AND drug_name = ?`,
    [category, drug_name],

    (err, row) => {

      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (!row) {
        return res.status(404).json({
          message: "Drug not found",
        });
      }

      if (row.quantity < quantity) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }

      const newQuantity =
        row.quantity - quantity;

      db.run(
        `UPDATE inventory
         SET quantity = ?
         WHERE id = ?`,
        [newQuantity, row.id],

        function (err) {

          if (err) {
            return res.status(500).json({
              message: "Update failed",
            });
          }

          res.json({
            message:
              "✅ Drug dispatched successfully",
          });

        }
      );

    }
  );

});

// START SERVER

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});