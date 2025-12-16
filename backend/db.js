const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("Errore DB:", err.message);
  } else {
    console.log("Database connesso");
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

// debug
function logAllUsers(reason = "") {
  db.all("SELECT id, name, email, userCode FROM users", [], (err, rows) => {
    if (err) {
      console.error("Errore lettura utenti:", err);
      return;
    }

    console.log("────────────────────");
    console.log("UTENTI NEL DB", reason && `(${reason})`);
    console.table(rows);
    console.log("────────────────────");
  });
}

module.exports = {
  db,
  logAllUsers,
};
