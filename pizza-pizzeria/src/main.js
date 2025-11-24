import "./style.css";

// --- Render HTML do #app (bez frameworka, czysty JS) ---
document.querySelector("#app").innerHTML = `
  <div class="app">
    <header class="header">
      <div class="header-title">
        <h1><span class="logo">🍕</span> Symulator Pizzerii</h1>
        <p class="subtitle">Asynchroniczne pieczenie, losowe błędy i smakowite promisy.</p>
      </div>
      <div class="badge">Async / Await • Promise</div>
    </header>

    <section class="controls-card">
      <div class="controls-header">
        <div>
          <h2><span>🧾</span> Złóż zamówienie</h2>
          <p>Wybierz rodzaj pizzy. Pamiętaj: 30% szans, że się przypali...</p>
        </div>
        <span class="badge-small">70% sukcesu</span>
      </div>

      <div class="buttons-row">
        <button data-rodzaj="Margherita">🍅 Margherita</button>
        <button data-rodzaj="Pepperoni">🌶 Pepperoni</button>
        <button data-rodzaj="Funghi">🍄 Funghi</button>
        <button data-rodzaj="Quattro Formaggi">🧀 Quattro Formaggi</button>
      </div>
    </section>

    <section class="status-card">
      <div class="status-icon" id="status-icon">
        <span>⏳</span>
      </div>
      <div class="status-text">
        <div id="status" class="status-muted">Czekam na Twoje zamówienie...</div>
      </div>
    </section>

    <section class="history-card">
      <div class="history-header">
        <h2><span>📜</span> Historia zamówień</h2>
        <button id="clear-history">Wyczyść historię</button>
      </div>
      <ul id="historia">
        <li class="empty-history">Brak zamówień. Upieczmy coś! 🔥</li>
      </ul>
    </section>
  </div>
`;

// --- Funkcja pieczenia pizzy (Promise + losowość) ---
function upieczPizze(rodzaj) {
  return new Promise((resolve, reject) => {
    console.log(`👨‍🍳 Zaczynam piec: ${rodzaj}...`); // log do konsoli

    const statusDiv = document.getElementById("status");
    const statusIcon = document.getElementById("status-icon");

    statusDiv.textContent = `👨‍🍳 Zaczynam piec: ${rodzaj}...`;
    statusDiv.className = "status-text"; // reset klas
    statusIcon.innerHTML = "";
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    statusIcon.appendChild(spinner); // animacja ładowania

    setTimeout(() => {
      const los = Math.random(); // losowanie 0–1

      if (los > 0.3) {
        resolve(`Pizza ${rodzaj} gotowa!`);
      } else {
        reject(new Error("Cholera! Przypaliła się!"));
      }
    }, 3000); // 3 sekundy "pieczenia"
  });
}

// --- Funkcja obsługująca zamówienie (async/await) ---
async function zamowienie(rodzaj) {
  const statusDiv = document.getElementById("status");
  const statusIcon = document.getElementById("status-icon");
  const lista = document.getElementById("historia");
  const przyciski = document.querySelectorAll("button[data-rodzaj]");

  // wyłączamy przyciski na czas pieczenia
  przyciski.forEach((btn) => (btn.disabled = true));

  // usuwamy komunikat o pustej historii (jeśli jest)
  const empty = document.querySelector(".empty-history");
  if (empty) {
    empty.remove();
  }

  try {
    const wynik = await upieczPizze(rodzaj); // czekamy na Promise
    console.log("Sukces:", wynik);

    statusDiv.textContent = `🍕 ${wynik} Smacznego! 😋`;
    statusDiv.className = "status-text status-success";
    statusIcon.innerHTML = "<span>✅</span>";

    const li = document.createElement("li");
    const left = document.createElement("div");
    left.className = "hist-left";

    const main = document.createElement("span");
    main.className = "hist-main";
    main.textContent = wynik;

    const time = document.createElement("span");
    time.className = "hist-time";
    time.textContent = new Date().toLocaleTimeString();

    left.appendChild(main);
    left.appendChild(time);

    const tag = document.createElement("span");
    tag.className = "hist-tag hist-tag-success";
    tag.textContent = "SUKCES";

    li.appendChild(left);
    li.appendChild(tag);
    lista.prepend(li); // najnowszy wpis na górze
  } catch (err) {
    console.error("Błąd:", err.message);

    statusDiv.textContent = `⚠ ${err.message} Zamawiam pizzę w innym lokalu... 🚶‍♂️`;
    statusDiv.className = "status-text status-error";
    statusIcon.innerHTML = "<span>❌</span>";

    const li = document.createElement("li");
    const left = document.createElement("div");
    left.className = "hist-left";

    const main = document.createElement("span");
    main.className = "hist-main";
    main.textContent = "Błąd: " + err.message;

    const time = document.createElement("span");
    time.className = "hist-time";
    time.textContent = new Date().toLocaleTimeString();

    left.appendChild(main);
    left.appendChild(time);

    const tag = document.createElement("span");
    tag.className = "hist-tag hist-tag-error";
    tag.textContent = "BŁĄD";

    li.appendChild(left);
    li.appendChild(tag);
    lista.prepend(li);
  } finally {
    // po zakończeniu włączamy przyciski
    przyciski.forEach((btn) => (btn.disabled = false));
  }
}

// --- Podpinanie przycisków i czyszczenie historii ---
function initUI() {
  const przyciski = document.querySelectorAll("button[data-rodzaj]");
  const clearBtn = document.getElementById("clear-history");
  const lista = document.getElementById("historia");
  const statusDiv = document.getElementById("status");
  const statusIcon = document.getElementById("status-icon");

  przyciski.forEach((przycisk) => {
    przycisk.addEventListener("click", () => {
      const rodzaj = przycisk.getAttribute("data-rodzaj"); // typ pizzy
      zamowienie(rodzaj);
    });
  });

  clearBtn.addEventListener("click", () => {
    // czyścimy listę historii
    lista.innerHTML = "";
    const li = document.createElement("li");
    li.className = "empty-history";
    li.textContent = "Brak zamówień. Upieczmy coś! 🔥";
    lista.appendChild(li);

    // reset statusu
    statusDiv.textContent = "Czekam na Twoje zamówienie...";
    statusDiv.className = "status-text status-muted";
    statusIcon.innerHTML = "<span>⏳</span>";
  });
}

initUI();
