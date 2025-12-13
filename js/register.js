function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  // Verifica se l'email esiste già
  const existingUser = USERS_DB.find((u) => u.email === email);
  if (existingUser) {
    showAlert("error", "Email già registrata");
    return;
  }

  // Genera codice utente univoco
  const userCode = generateUserCode(name);

  // Crea nuovo utente
  const newUser = {
    id: USERS_DB.length + 1,
    name: name,
    email: email,
    password: password,
    userCode: userCode,
  };

  // Aggiungi al database
  USERS_DB.push(newUser);

  // IMPORTANTE: Salva nel localStorage
  saveUsers();

  // Pulisci il form
  document.getElementById("register-name").value = "";
  document.getElementById("register-email").value = "";
  document.getElementById("register-password").value = "";

  // Mostra messaggio di successo e vai al login
  showAlert("success", "Registrazione completata! Ora puoi accedere");
  showPage("login");
}

function generateUserCode(name) {
  const nameParts = name.split(" ");
  let initials = "";

  if (nameParts.length >= 2) {
    initials = nameParts[0][0] + nameParts[1][0];
  } else {
    initials = name.substring(0, 2);
  }

  initials = initials.toUpperCase();

  // Genera numero progressivo
  const existingCodes = USERS_DB.map((u) => u.userCode);
  let number = 1;
  let code = `${initials}${String(number).padStart(3, "0")}`;

  while (existingCodes.includes(code)) {
    number++;
    code = `${initials}${String(number).padStart(3, "0")}`;
  }

  return code;
}
