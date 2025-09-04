const players = JSON.parse(localStorage.getItem("players")) || [];

if (players.length < 2) {
  alert("Not enough players. Redirecting to Add Players page...");
  window.location.href = "addplayer.html";
}

let teamAPlayers = [];
let teamBPlayers = [];

players.sort((a, b) => (b.bat + b.bowl) - (a.bat + a.bowl));

players.forEach((player, index) => {
  if (index % 2 === 0) teamAPlayers.push(player);
  else teamBPlayers.push(player);
});

// ✅ Store with team names for next page
const teamA = {
  name: "Warriors",
  players: teamAPlayers
};

const teamB = {
  name: "Strikers",
  players: teamBPlayers
};

localStorage.setItem("teamA", JSON.stringify(teamA));
localStorage.setItem("teamB", JSON.stringify(teamB));

// ✅ Display to user
const teamAList = document.getElementById("teamAList");
const teamBList = document.getElementById("teamBList");

function renderTeam(list, team) {
  team.players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} (Bat: ${p.bat}, Bowl: ${p.bowl})`;
    list.appendChild(li);
  });
}

renderTeam(teamAList, teamA);
renderTeam(teamBList, teamB);

document.getElementById("nextBtn").addEventListener("click", () => {
  window.location.href = "match.html"; // Go to match setup
});
