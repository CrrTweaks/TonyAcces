async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("https://tonyacces.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const user = await res.json();
    if (!res.ok) throw new Error(user.message);

    currentUser = user;
    updateUserUI();
    showPage("app");
    showAlert("success", `Benvenuto ${user.name}`);
  } catch (err) {
    showAlert("error", err.message);
  }
}

function handleLogout() {
  updateConnectionStatus("disconnected");
  currentUser = null;
  showPage("login");
  clearLoginForm();
  showAlert("info", "Disconnesso");
}

function clearLoginForm() {
  const form = document.getElementById("login-form");
  if (form) form.reset();
}
