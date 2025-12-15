const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("Errore apertura database:", err.message);
  } else {
    console.log("Database SQLite connesso");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    userCode TEXT
  )
`);

// DEBUG
function logAllUsers(reason = "") {
  db.all("SELECT id, name, email, userCode FROM users", [], (err, rows) => {
    if (err) {
      console.error("Errore lettura utenti:", err.message);
      return;
    }

    console.log("────────────────────────────");
    console.log("UTENTI NEL DATABASE", reason ? `(${reason})` : "");
    console.table(rows);
    console.log("────────────────────────────");
  });
}

module.exports = {
  db,
  logAllUsers,
};
