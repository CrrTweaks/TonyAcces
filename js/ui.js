function showPage(pageName) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(`page-${pageName}`).classList.add("active");

  const header = document.getElementById("app-header");
  if (pageName === "app") {
    header.classList.remove("hidden");
  } else {
    header.classList.add("hidden");
  }
}

function showAlert(type, message) {
  const alertBox = document.getElementById("alert-box");
  const alertContainer = document.getElementById("alert-container");
  const alertMessage = document.getElementById("alert-message");

  const colors = {
    success: "border-green-500 bg-green-50 text-green-800",
    error: "border-red-500 bg-red-50 text-red-800",
    info: "border-blue-500 bg-blue-50 text-blue-800",
  };

  alertContainer.className = `bg-white rounded-lg shadow-lg p-4 border-l-4 ${colors[type]}`;
  alertMessage.textContent = message;

  alertBox.classList.remove("hidden");
  setTimeout(() => alertBox.classList.add("hidden"), 3000);
}

function updateUserUI() {
  if (!currentUser) return;

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  document.getElementById("user-name-desktop").textContent = currentUser.name;
  document.getElementById(
    "user-code-desktop"
  ).textContent = `Codice: ${currentUser.userCode}`;
  document.getElementById("user-avatar-desktop").textContent = initials;

  document.getElementById("header-name").textContent = currentUser.name;
  document.getElementById("header-code").textContent = currentUser.userCode;
  document.getElementById("header-avatar").textContent = initials;
}

function updateConnectionStatus(status) {
  const indicator = document.getElementById("status-indicator");
  const text = document.getElementById("status-text");

  const config = {
    connected: { color: "bg-green-500", text: "Connesso" },
    disconnected: { color: "bg-gray-400", text: "Disconnesso" },
    connecting: { color: "bg-yellow-500", text: "Connessione..." },
    error: { color: "bg-red-500", text: "Errore" },
  };

  indicator.className = `w-3 h-3 rounded-full ${config[status].color}`;
  text.textContent = config[status].text;
}
