const express = require("express");
const bcrypt = require("bcrypt");
const { db, logAllUsers } = require("../db");

const router = express.Router();

// POST /register
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Dati mancanti" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userCode =
      name.substring(0, 2).toUpperCase() +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

    db.run(
      "INSERT INTO users (name, email, password, userCode) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userCode],
      function (err) {
        if (err) {
          return res.status(409).json({ message: "Email già registrata" });
        }

        res.status(201).json({
          message: "Registrazione completata",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Errore server" });
  }

  // Log Utenti
  logAllUsers("DOPO REGISTER");
});

module.exports = router;
