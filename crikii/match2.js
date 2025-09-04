document.addEventListener("DOMContentLoaded", () => {
    const teamAButton = document.getElementById("teamAButton");
    const teamBButton = document.getElementById("teamBButton");
    const startMatchBtn = document.getElementById("startMatchBtn");
  
    const teamA = JSON.parse(localStorage.getItem("teamA"));
    const teamB = JSON.parse(localStorage.getItem("teamB"));
    const matchSetup = JSON.parse(localStorage.getItem("matchSetup"));
  
    if (!teamA || !teamB || !matchSetup) {
      alert("Missing team or setup data. Redirecting...");
      window.location.href = "11.html";
      return;
    }
  
    teamAButton.textContent = teamA.name;
    teamBButton.textContent = teamB.name;
  
    let selectedBattingTeam = null;
  
    function handleSelection(team) {
      selectedBattingTeam = team;
  
      teamAButton.classList.remove("selected");
      teamBButton.classList.remove("selected");
  
      if (team === "A") teamAButton.classList.add("selected");
      if (team === "B") teamBButton.classList.add("selected");
  
      startMatchBtn.disabled = false;
    }
  
    teamAButton.addEventListener("click", () => handleSelection("A"));
    teamBButton.addEventListener("click", () => handleSelection("B"));
  
    startMatchBtn.addEventListener("click", () => {
      const battingTeam = selectedBattingTeam === "A" ? teamA : teamB;
      const bowlingTeam = selectedBattingTeam === "A" ? teamB : teamA;
  
      const matchData = {
        battingTeam,
        bowlingTeam,
        overs: matchSetup.overs,
        teamACaptain: matchSetup.teamACaptain,
        teamBCaptain: matchSetup.teamBCaptain
      };
  
      localStorage.setItem("matchData", JSON.stringify(matchData));
      window.location.href = "match3.html";
    });
  });
  