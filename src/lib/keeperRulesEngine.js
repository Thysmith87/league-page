// src/lib/keeperRulesEngine.js
// Enhanced version with manual keeper tracking

// Manual keeper history - organized by year for easier management
const keepersByYear = {
  2024: [
    "8144", //Chris Olave
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
    "9509", //Bijan Robinson (2nd year - INELIGIBLE for 2026)
    "3198", //Derrick Henry
    "6794", //Justin Jefferson
    "7564", //Ja'Marr Chase
    "6786", //CeeDee Lamb (2nd year - INELIGIBLE for 2026)
    "7547", //Amon-Ra St. Brown
    "9221", //Jahmyr Gibbs (2nd year - INELIGIBLE for 2026)
    "4984", //Josh Allen
    "8130", //Trey McBride
    "11632", //Malik Nabers
    "6790", //D'Andre Swift
    "6801", //Tee Higgins
    "8137", //George Pickens
    "2216", //Mike Evans (2nd year - INELIGIBLE for 2026)
    "8205", //Isiah Pacheco (2nd year - INELIGIBLE for 2026)
    "11635", //Ladd McConkey
    "11624", //Xavier Worthy
    "11631", //Brian Thomas
    "9224", //Chase Brown
    "4033", //David Njoku (2nd year - INELIGIBLE for 2026)
    "8144", //Chris Olave
    "11604", //Brock Bowers
    "9226", //De'Von Achane (2nd year - INELIGIBLE for 2026)
    "11566", //Jayden Daniels
    "7594", //Chuba Hubbard
    "8150", //Kyren Williams (2nd year - INELIGIBLE for 2026)
    "11584", //Bucky Irving
    "7569", //Nico Collins (2nd year - INELIGIBLE for 2026)
    "9484", //Tucker Kraft
    "9493", //Puka Nacua (2nd year - INELIGIBLE for 2026)
    "10444", //Cedric Tillman
    "9225", //Tank Bigsby
    "GB", //Green Bay Packers
    "7049", //Jauan Jennings
  ],
};

export function calculateKeepers({ 
  rosters, 
  draft, 
  players, 
  adp = [], 
  totalRounds = 14,
  currentYear = 2026,
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

      // Count consecutive keeper years leading up to the current year
      const previousYear = currentYear - 1;
      const yearBeforePrevious = currentYear - 2;
      
      const keptPreviousYear = keepersByYear[previousYear]?.includes(pid) || false;
      const keptYearBeforePrevious = keepersByYear[yearBeforePrevious]?.includes(pid) || false;
      
      // Determine consecutive keeper status
      let consecutiveYears = 0;
      if (keptPreviousYear) {
        consecutiveYears = 1;
        if (keptYearBeforePrevious) {
          consecutiveYears = 2;
        }
      }

     // Calculate keeper eligibility and cost based on consecutive years
      let eligibility = "green"; // Default to green

      if (consecutiveYears >= 2) {
        // Player kept for 2 consecutive years - INELIGIBLE
        eligibility = "red";
      } else if (keptPreviousYear) {
        // Player kept last year only - FINAL keeper year
        eligibility = "yellow";
      } else {
        // Player not kept recently - ELIGIBLE for keeping
        eligibility = "green";
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
        consecutiveYears, // Changed from yearsKept
        keptPreviousYear,
        keptYearBeforePrevious,
        keeperYears, // Array of years this player was kept
      });
    }
  }

  return results;
}

// Helper functions for managing keeper history
export function addKeeperToYear(playerId, year) {
  if (!keepersByYear[year]) {
    keepersByYear[year] = [];
  }
  if (!keepersByYear[year].includes(playerId)) {
    keepersByYear[year].push(playerId);
    console.log(`Added keeper: ${playerId} to ${year}`);
  }
}

export function removeKeeperFromYear(playerId, year) {
  if (keepersByYear[year]) {
    const index = keepersByYear[year].indexOf(playerId);
    if (index > -1) {
      keepersByYear[year].splice(index, 1);
      console.log(`Removed keeper: ${playerId} from ${year}`);
    }
  }
}

export function getKeepersByYear() {
  return keepersByYear;
}

export function getPlayersKeptInYear(year) {
  return keepersByYear[year] || [];
}

export function analyzeKeeperStatus(playerId, players) {
  const yearsKept = Object.keys(keepersByYear).filter(year => 
    keepersByYear[year].includes(playerId)
  );
  
  const playerInfo = players?.[playerId];
  const playerName = playerInfo?.full_name || playerInfo?.fn + ' ' + playerInfo?.ln || playerId;
  
  return {
    playerId,
    playerName,
    position: playerInfo?.pos,
    team: playerInfo?.t,
    yearsKept: yearsKept.length,
    keptInYears: yearsKept.sort(),
    isEligible: yearsKept.length < 2,
    status: yearsKept.length >= 2 ? 'Ineligible' : 
            yearsKept.length === 1 ? 'Final Year' : 'First Time'
  };
}

// Debug function to check consecutive keeper status
export function findConsecutiveKeepers(currentYear = 2026) {
  console.log("=== CONSECUTIVE KEEPER STATUS ===");
  const previousYear = currentYear - 1;
  const yearBeforePrevious = currentYear - 2;
  
  const allPlayers = new Set([
    ...(keepersByYear[yearBeforePrevious] || []),
    ...(keepersByYear[previousYear] || [])
  ]);
  
  for (const playerId of allPlayers) {
    const keptPreviousYear = keepersByYear[previousYear]?.includes(playerId) || false;
    const keptYearBeforePrevious = keepersByYear[yearBeforePrevious]?.includes(playerId) || false;
    
    let status = "";
    if (keptPreviousYear && keptYearBeforePrevious) {
      status = "❌ RED - Ineligible (kept 2 consecutive years)";
    } else if (keptPreviousYear) {
      status = "⚠️ YELLOW - Final keeper year";
    } else if (keptYearBeforePrevious) {
      status = "✅ GREEN - Eligible (gap year)";
    }
    
    const years = [];
    if (keptYearBeforePrevious) years.push(yearBeforePrevious);
    if (keptPreviousYear) years.push(previousYear);
    
    console.log(`${playerId}: kept in [${years.join(', ')}] - ${status}`);
  }
}
