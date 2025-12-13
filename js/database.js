// Carica utenti dal localStorage o usa quelli di default
function loadUsers() {
  const saved = localStorage.getItem("USERS_DB");
  if (saved) {
    return JSON.parse(saved);
  }
  // Utenti di default
  return [
    {
      id: 1,
      name: "Marco Rossi",
      email: "marco@test.it",
      password: "test123",
      userCode: "MR001",
    },
  ];
}

// Salva utenti nel localStorage
function saveUsers() {
  localStorage.setItem("USERS_DB", JSON.stringify(USERS_DB));
}

let USERS_DB = loadUsers();
let currentUser = null;
