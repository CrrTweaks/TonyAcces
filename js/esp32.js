async function testConnection() {
  const ip = document.getElementById("esp32-ip").value;

  if (!ip) {
    showAlert("info", "Inserisci l'IP dell'ESP32");
    return;
  }

  updateConnectionStatus("connecting");

  try {
    const response = await fetch(`http://${ip}/ping`, {
      method: "GET",
      mode: "no-cors",
    });

    showAlert("success", "Connessione riuscita");
    updateConnectionStatus("connected");
  } catch (error) {
    showAlert("error", "ESP32 non raggiungibile");
    updateConnectionStatus("error");
  }
}

async function sendToESP32() {
  const ip = document.getElementById("esp32-ip").value;
  const btn = document.getElementById("btn-interact");

  if (!ip) {
    showAlert("info", "Configura prima l'IP");
    return;
  }

  if (!currentUser) {
    showAlert("error", "Devi effettuare il login");
    return;
  }

  btn.disabled = true;
  btn.textContent = "INVIO IN CORSO...";

  try {
    const payload = {
      userCode: currentUser.userCode,
      userName: currentUser.name,
      email: currentUser.email,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(`http://${ip}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();

      document.getElementById("esp32-response").classList.remove("hidden");
      document.getElementById("response-text").textContent =
        data.message || `Benvenuto ${currentUser.name}`;

      showAlert("success", "Codice inviato");
      updateConnectionStatus("connected");
    } else {
      throw new Error("Errore");
    }
  } catch (error) {
    showAlert("error", "Errore durante l'invio");
    updateConnectionStatus("error");
  } finally {
    btn.disabled = false;
    btn.textContent = "INVIA CODICE";
  }
}
