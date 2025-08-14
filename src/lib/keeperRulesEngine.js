// src/lib/keeperRulesEngine.js
// Enhanced version with manual keeper tracking

// Manual keeper history - organized by year for easier management
const keepersByYear = {
  2023: [
    // "4034", // Christian McCaffrey
    // "4046", // Josh Allen
    // Add player IDs of players kept in 2023
  ],
  2024: [
    // "4034", // Christian McCaffrey (2nd year - ineligible for 2025)
    // "5890", // Different player (1st year - eligible for 2025)
    // Add player IDs of players kept in 2024
  ],
  
  // TODO: Add your actual keeper data here
  // You can get player IDs from the console logs when the page loads
};

export function calculateKeepers({ 
  rosters, 
  draft, 
  players, 
  adp = [], 
  totalRounds = 14,
  currentYear = 2025
}) {
  // Map ADP by name (optional)
  const adpMap = new Map();
  for (const p of adp) {
    if (p?.name) adpMap.set(p.name, p.adp);
  }

  // Fast lookup: player_id -> pick
  const pickByPlayerId = new Map();
  for (const p of (draft || [])) {
    pickByPlayerId.set(String(p.player_id), p);
  }

  const results = [];

  for (const roster of rosters || []) {
    const rosterPlayers = (roster.players || []).filter(pid => pid !== "0");
    
    for (const rawPid of rosterPlayers) {
      const pid = String(rawPid);
      const pInfo = players?.[pid] || {};
      
      // Player name
      const playerName =
        pInfo.full_name ||
        [pInfo.fn, pInfo.ln].filter(Boolean).join(' ') ||
        pid;

      // Previous year's draft round (or last round if waiver pickup)
      const pick = pickByPlayerId.get(pid);
      const previousDraftRound = pick ? Number(pick.round) : Number(totalRounds);

      // Check keeper history for this player - count how many years they've been kept
      const yearsKept = Object.keys(keepersByYear).filter(year => 
        Number(year) < currentYear && keepersByYear[year].includes(pid)
      ).length;

      // Calculate keeper eligibility and cost
      let eligibility = "red";
      let keeperCost = null;
      let reason = "";

      if (yearsKept >= 2) {
        // Player has been kept for 2+ years - INELIGIBLE
        eligibility = "red";
        keeperCost = null;
        reason = `Kept ${yearsKept} years - max reached`;
        
      } else if (previousDraftRound === 1) {
        // First round picks can be kept but at round 1 (no cost savings)
        eligibility = "yellow";
        keeperCost = 1; // Keep at round 1 cost
        reason = "1st round pick - no cost savings";
        
      } else if (previousDraftRound <= totalRounds - 1) {
        // Rounds 2-13: Good keeper candidates (save 1 round)
        eligibility = "green";
        keeperCost = Math.max(1, previousDraftRound - 1);
        reason = `Keep at round ${keeperCost} (save 1 round)`;
        
      } else {
        // Waiver pickups (round 14+): Keep at round 13
        eligibility = "green";
        keeperCost = totalRounds - 1; // Round 13
        reason = "Waiver pickup - keep at round 13";
      }

      // Get years kept history for display
      const keeperYears = Object.keys(keepersByYear)
        .filter(year => keepersByYear[year].includes(pid))
        .sort();

      results.push({
        owner: roster.owner_id,
        rosterId: roster.roster_id,
        playerId: pid,
        player: playerName,
        position: pInfo.pos,
        team: pInfo.t,
        previousDraftRound,
        draftRound: previousDraftRound, // alias
        keeperCost,
        adp: adpMap.get(playerName) ?? null,
        eligibility,
        yearsKept,
        keeperYears, // Array of years this player was kept
        reason // Explanation for debugging
      });
    }
  }

  return results;
}

// Helper functions for managing keeper history
export function addKeeperRecord(playerId, year, owner) {
  if (!keeperHistory[playerId]) {
    keeperHistory[playerId] = {};
  }
  keeperHistory[playerId][year] = { kept: true, owner };
  console.log(`Added keeper record: ${playerId} kept by ${owner} in ${year}`);
}

export function removeKeeperRecord(playerId, year) {
  if (keeperHistory[playerId] && keeperHistory[playerId][year]) {
    delete keeperHistory[playerId][year];
    console.log(`Removed keeper record: ${playerId} in ${year}`);
  }
}

export function getKeeperHistory() {
  return keeperHistory;
}

export function logPlayerIds(rosters, players) {
  console.log("=== PLAYER IDS FOR KEEPER TRACKING ===");
  for (const roster of rosters || []) {
    const rosterPlayers = (roster.players || []).filter(pid => pid !== "0");
    console.log(`Roster ${roster.roster_id}:`);
    
    for (const pid of rosterPlayers.slice(0, 5)) { // Show first 5 players
      const pInfo = players?.[pid] || {};
      const playerName = pInfo.full_name || [pInfo.fn, pInfo.ln].filter(Boolean).join(' ') || pid;
      console.log(`  "${pid}": "${playerName}" (${pInfo.pos} - ${pInfo.t})`);
    }
  }
  console.log("=== Copy player IDs above to add to keeperHistory ===");
}
