// src/lib/keeperRulesEngine.js
// Enhanced version with manual keeper tracking

// Manual keeper history - organized by year for easier management
// "4034", // Christian McCaffrey
// "4046", // Josh Allen
// Add player IDs of players kept in 2023
const keepersByYear = {
  2024: [
    "8143", //Chris Olave
    "8112", //Drake London
    "5846", //DK Metcalf
    "7525", //DeVonta Smith
    "8146", //Garrett Wilson
    "6770", //Joe Burrow
    "5850", //Josh Jacobs
    "8136", //Rachaad White
    "3321", //Tyreek Hill
    "6813", //Jonathan Taylor
    "7553", //Kyle Pitts
    "2216", //Mike Evans
    "4035", //Alvin Kamara
    "6786", //CeeDee Lamb
    "3163", //Jared Goff
    "5947", //Jakobi Meyers
    "8205", //Isiah Pacheco
    "10859", //Sam LaPorta
    "9493", //Puka Nacua
    "6826", //Cole Kmet
    "4033", //David Njoku
    "9509", //Bijan Robinson
    "6804", //Jordan Love
    "9221", //Jahmyr Gibbs
    "8150", //Kyren Williams
    "7569", //Nico Collins
    "9226", //De'Von Achane
    "8155", //Breece Hall
    "10229", //Rashee Rice
    "4866", //Saquon Barkley
    "9756", //Jordan Addison
    "9758", //C.J. Stroud
  ],
  2025: [
    "9509", //Bijan Robinson
    "3198", //Derrick Henry
    "6794", //Justin Jefferson
    "7564", //Ja'Marr Chase
    "6786", //CeeDee Lamb
    "7547", //Amon-Ra St. Brown
    "9221", //Jahmyr Gibbs
    "4984", //Josh Allen
    "8130", //Trey McBride
    "11632", //Malik Nabers
    "6790", //D'Andre Swift
    "6801", //Tee Higgins
    "8137", //George Pickens
    "2216", //Mike Evans
    "8205", //Isiah Pacheco
    "11635", //Ladd McConkey
    "11624", //Xavier Worthy
    "11631", //Brian Thomas
    "9224", //Chase Brown
    "4033", //David Njoku
    "8144", //Chris Olave
    "11604", //Brock Bowers
    "9226", //De'Von Achane
    "11566", //Jayden Daniels
    "7594", //Chuba Hubbard
    "8150", //Kyren Williams
    "11584", //Bucky Irving
    "7569", //Nico Collins
    "9484", //Tucker Kraft
    "9493", //Puka Nacua
    "10444", //Cedric Tillman
    "9225", //Tank Bigsby
    "GB", //Green Bay Packers
    "7049", //Jauan Jennings
  ],
    // You can get player IDs from the console logs when the page loads
    //Spread sheet @ https://docs.google.com/spreadsheets/d/15LfrwlLcYJugBgL-VfmZt4CP09t4IolGTsNHGAfH1iI/edit?gid=0#gid=0 can be used to quickly determine keepers. 
};

export function calculateKeepers({ 
  rosters, 
  draft, 
  players, 
  adp = [], 
  totalRounds = 14,
  currentYear = 2026
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
      let reason = "";

      if (yearsKept >= 2) {
        // Player has been kept for 2+ years - INELIGIBLE
        eligibility = "red";
        reason = `Kept ${yearsKept} years - max reached`;
        
      } else if (yearsKept === 1) {
       // Kept Previous Year
        eligibility = "yellow";
        reason = "1st round pick - no cost savings";
        
      } else if (previousDraftRound <= totalRounds - 1) {
        // Rounds 2-13: Good keeper candidates (save 1 round)
        eligibility = "green";
        reason = `Keep at Previous Year Draft Position`;
        
      } else {
        // Waiver pickups (round 14+): Keep at round 13
        eligibility = "green";
        reason = "Waiver pickup - keep at round 14";
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
