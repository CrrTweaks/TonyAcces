async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const res = await fetch("https://tonyacces.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    showAlert("success", "Registrazione completata!");
    showPage("login");
  } catch (err) {
    showAlert("error", err.message);
  }
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
