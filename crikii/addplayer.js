let players = JSON.parse(localStorage.getItem("players")) || [];

const form = document.getElementById("playerForm");
const playerList = document.getElementById("playerList");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("playerName").value.trim();
  const bat = parseInt(document.getElementById("batRating").value);
  const bowl = parseInt(document.getElementById("bowlRating").value);

  if (!name || isNaN(bat) || isNaN(bowl)) return alert("Fill all fields");

  const player = { name, bat, bowl };
  players.push(player);
  localStorage.setItem("players", JSON.stringify(players));
  form.reset();
  renderPlayers();
});

function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach((p, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${p.name} (Bat: ${p.bat}, Bowl: ${p.bowl})</span>
      <button class="remove-btn" onclick="removePlayer(${index})">Remove</button>
    `;
    playerList.appendChild(li);
  });
}

function removePlayer(index) {
  players.splice(index, 1);
  localStorage.setItem("players", JSON.stringify(players));
  renderPlayers();
}

document.getElementById("generateTeamsBtn").addEventListener("click", () => {
  if (players.length < 2) {
    alert("Add at least 2 players to generate teams.");
    return;
  }
  window.location.href ="11.html";
});

renderPlayers();
