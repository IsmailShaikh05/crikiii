document.addEventListener("DOMContentLoaded", () => {
  const matchData = JSON.parse(localStorage.getItem("matchResult"));
  const scorecardsContainer = document.getElementById("scorecardsContainer");
  const resultText = document.getElementById("resultText");
  const playerOfMatchText = document.getElementById("playerOfMatch");

  if (!matchData || !matchData.firstInningsData || !matchData.secondInningsData) {
    alert("No match data found.");
    location.href = "index.html";
    return;
  }

  const { firstInningsData, secondInningsData, result } = matchData;

  resultText.textContent = `🏆 ${result}`;

  function generateScorecardHTML(data) {
    let playerRows = "";

    for (const [name, stats] of Object.entries(data.stats)) {
      const sr = stats.balls > 0 ? ((stats.runs / stats.balls) * 100).toFixed(1) : "0.0";
      playerRows += `
        <tr>
          <td>${name}${stats.out ? " ✖️" : ""}</td>
          <td>${stats.runs || 0}</td>
          <td>${stats.balls || 0}</td>
          <td>${stats.fours || 0}</td>
          <td>${stats.sixes || 0}</td>
          <td>${sr}</td>
        </tr>
      `;
    }

    return `
      <div class="card">
        <h2>${data.team.name}</h2>
        <p><strong>Score:</strong> ${data.score}/${data.wickets} (${Math.floor(data.overs / 6)}.${data.overs % 6} ov)</p>
        <table>
          <thead>
            <tr>
              <th>Batsman</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            ${playerRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // Append both innings scorecards
  scorecardsContainer.innerHTML =
    generateScorecardHTML(firstInningsData) + generateScorecardHTML(secondInningsData);

  // Player of the Match (Highest scorer or best bowler)
  let bestPlayer = { name: "", runs: 0 };
  const allStats = { ...firstInningsData.stats, ...secondInningsData.stats };

  for (const [name, stats] of Object.entries(allStats)) {
    if (stats.runs && stats.runs > bestPlayer.runs) {
      bestPlayer = { name, runs: stats.runs };
    }
  }

  playerOfMatchText.textContent = `🏅 Player of the Match: ${bestPlayer.name} (${bestPlayer.runs} runs)`;
});
