document.addEventListener("DOMContentLoaded", () => {
  const teamASelect = document.getElementById("teamACaptain");
  const teamBSelect = document.getElementById("teamBCaptain");
  const teamAInput = document.getElementById("teamAName");
  const teamBInput = document.getElementById("teamBName");
  const oversInput = document.getElementById("overs");
  const proceedBtn = document.getElementById("proceedBtn");

  // ✅ Load actual team data
  const teamAData = JSON.parse(localStorage.getItem("teamA")) || { name: "Team A", players: [] };
  const teamBData = JSON.parse(localStorage.getItem("teamB")) || { name: "Team B", players: [] };

  // ✅ Show names in input fields
  teamAInput.value = teamAData.name;
  teamBInput.value = teamBData.name;

  // ✅ Populate captain dropdowns
  teamAData.players.forEach(player => {
    const option = document.createElement("option");
    option.value = player.name;
    option.textContent = player.name;
    teamASelect.appendChild(option);
  });

  teamBData.players.forEach(player => {
    const option = document.createElement("option");
    option.value = player.name;
    option.textContent = player.name;
    teamBSelect.appendChild(option);
  });

  // ✅ Store match setup on proceed
  proceedBtn.addEventListener("click", () => {
    if (!oversInput.value || !teamASelect.value || !teamBSelect.value) {
      alert("Please fill all fields and select captains.");
      return;
    }

    const setupData = {
      teamAName: teamAInput.value.trim() || "Team A",
      teamBName: teamBInput.value.trim() || "Team B",
      overs: parseInt(oversInput.value),
      teamACaptain: teamASelect.value,
      teamBCaptain: teamBSelect.value
    };

    localStorage.setItem("matchSetup", JSON.stringify(setupData));
    window.location.href = "coin.html"; // go to match start page
  });
});
