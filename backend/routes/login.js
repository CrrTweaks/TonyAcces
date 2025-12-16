const express = require("express");
const bcrypt = require("bcrypt");
const { db, logAllUsers } = require("../db");

const router = express.Router();

// POST /login
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Dati mancanti" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) {
      return res.status(401).json({ message: "Credenziali errate" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Credenziali errate" });
    }

    // LOOG Utenti
    logAllUsers("DOPO LOGIN");

    res.json({
      name: user.name,
      email: user.email,
      userCode: user.userCode,
    });
  });
});

module.exports = router;
