document.addEventListener("DOMContentLoaded", () => {
  const strikerSelect = document.getElementById("strikerSelect");
  const nonStrikerSelect = document.getElementById("nonStrikerSelect");
  const bowlerSelect = document.getElementById("bowlerSelect");
  const scoreDisplay = document.getElementById("score");
  const oversDisplay = document.getElementById("overs");
  const recentDisplay = document.getElementById("recent");
  const nextInningsBtn = document.getElementById("nextInningsBtn");

  let matchData = JSON.parse(localStorage.getItem("matchData"));
  if (!matchData) {
    alert("Match data not found. Please start from setup.");
    window.location.href = "addplayer.html";
    return;
  }

  let {
    battingTeam,
    bowlingTeam,
    overs: totalOvers,
    firstInnings = true,
    target = null,
    firstInningsData = null
  } = matchData;

  let currentRuns = 0;
  let currentWickets = 0;
  let ballsBowled = 0;
  let recentBalls = [];

  let striker = null;
  let nonStriker = null;
  let bowler = null;

  let playersStats = {};

  // Reset stats if second innings
  if (!firstInnings) {
    playersStats = {};
  }

  function populateDropdown(select, players) {
    select.innerHTML = `<option value="">Select</option>`;
    players.forEach(player => {
      const option = document.createElement("option");
      option.value = player.name;
      option.textContent = player.name;
      select.appendChild(option);
    });
  }

  function updateScoreboard() {
    scoreDisplay.textContent = `${currentRuns} / ${currentWickets}`;
    oversDisplay.textContent = `Overs: ${Math.floor(ballsBowled / 6)}.${ballsBowled % 6}`;
    recentDisplay.textContent = `Recent: ${recentBalls.join(" ")}`;
  }

  function rotateStrike() {
    [striker, nonStriker] = [nonStriker, striker];
    strikerSelect.value = striker;
    nonStrikerSelect.value = nonStriker;
  }

  function promptNextBatsman() {
    const remainingPlayers = battingTeam.players.filter(p => !playersStats[p.name]?.out && p.name !== striker && p.name !== nonStriker);
    if (remainingPlayers.length === 0) {
      endInnings();
      return;
    }
    let next = prompt(`Wicket! Select next batsman:\n${remainingPlayers.map(p => p.name).join(", ")}`);
    if (remainingPlayers.some(p => p.name === next)) {
      striker = next;
      strikerSelect.value = next;
    } else {
      alert("Invalid selection. Picking first available.");
      striker = remainingPlayers[0].name;
      strikerSelect.value = striker;
    }
  }

  function promptNewBowler() {
    const availableBowlers = bowlingTeam.players.filter(p => p.name !== bowler);
    let next = prompt(`Over completed! Select next bowler:\n${availableBowlers.map(p => p.name).join(", ")}`);
    if (availableBowlers.some(p => p.name === next)) {
      bowler = next;
      bowlerSelect.value = next;
    } else {
      alert("Invalid selection. Keeping same bowler.");
    }
  }

  function endInnings() {
    alert("Innings Over!");
    if (firstInnings) {
      matchData.firstInningsData = {
        team: battingTeam,
        score: currentRuns,
        wickets: currentWickets,
        overs: ballsBowled,
        stats: playersStats
      };
      matchData.firstInnings = false;
      matchData.target = currentRuns + 1;
      matchData.battingTeam = bowlingTeam;
      matchData.bowlingTeam = battingTeam;
      localStorage.setItem("matchData", JSON.stringify(matchData));
      nextInningsBtn.style.display = "block";
    } else {
      const result = currentRuns >= target ? `${battingTeam.name} won!` : `${bowlingTeam.name} won!`;
      matchData.secondInningsData = {
        team: battingTeam,
        score: currentRuns,
        wickets: currentWickets,
        overs: ballsBowled,
        stats: playersStats
      };
      matchData.result = result;
      localStorage.setItem("matchResult", JSON.stringify(matchData));
      window.location.href = "score.html";
    }
  }

  document.querySelectorAll(".score-buttons button").forEach(button => {
    button.addEventListener("click", () => {
      if (!striker || !nonStriker || !bowler) {
        alert("Please select striker, non-striker and bowler first.");
        return;
      }

      const value = button.getAttribute("data-run");
      if (!playersStats[striker]) playersStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
      if (!playersStats[bowler]) playersStats[bowler] = { overs: 0, runs: 0, wickets: 0 };

      if (value === "WD" || value === "NB") {
        currentRuns++;
        playersStats[bowler].runs++;
        recentBalls.push(value);
      } else if (value === "W") {
        currentWickets++;
        playersStats[striker].balls++;
        playersStats[striker].out = true;
        playersStats[bowler].wickets++;
        recentBalls.push("W");
        ballsBowled++;
        promptNextBatsman();
      } else {
        const runs = parseInt(value);
        currentRuns += runs;
        playersStats[striker].runs += runs;
        playersStats[striker].balls++;
        if (runs === 4) playersStats[striker].fours++;
        if (runs === 6) playersStats[striker].sixes++;
        playersStats[bowler].runs += runs;
        recentBalls.push(runs);
        ballsBowled++;

        if (runs % 2 === 1 || runs === 3) {
          rotateStrike();
        }
      }

      if (recentBalls.length > 6) recentBalls.shift();
      updateScoreboard();

      if (ballsBowled % 6 === 0) {
        playersStats[bowler].overs++;
        rotateStrike();
        promptNewBowler();
      }

      if (Math.floor(ballsBowled / 6) >= totalOvers || currentWickets >= battingTeam.players.length - 1) {
        endInnings();
      }

      if (!firstInnings && currentRuns >= target) {
        endInnings();
      }
    });
  });

  strikerSelect.addEventListener("change", e => striker = e.target.value);
  nonStrikerSelect.addEventListener("change", e => nonStriker = e.target.value);
  bowlerSelect.addEventListener("change", e => bowler = e.target.value);

  populateDropdown(strikerSelect, battingTeam.players);
  populateDropdown(nonStrikerSelect, battingTeam.players);
  populateDropdown(bowlerSelect, bowlingTeam.players);

  document.getElementById("matchTitle").textContent = `${battingTeam.name} vs ${bowlingTeam.name}`;
  updateScoreboard();

  nextInningsBtn.addEventListener("click", () => {
    // Refresh the page for second innings with updated teams and reset state
    window.location.reload();
  });
});
