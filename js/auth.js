function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = USERS_DB.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    showAlert("error", "Email o password errati");
    return;
  }
  currentUser = user;
  updateUserUI();
  showPage("app");
  updateConnectionStatus("disconnected");
  showAlert("success", `Benvenuto ${user.name}`);
}

function handleLogout() {
  updateConnectionStatus("disconnected");
  currentUser = null;
  showPage("login");
  showAlert("info", "Disconnesso");
}
