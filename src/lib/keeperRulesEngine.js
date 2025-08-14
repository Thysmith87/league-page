// src/lib/keeperRulesEngine.js
// NOTE: draft = array of picks (from previousDrafts[0].picks)
// players = sleeper players map keyed by player_id
export function calculateKeepers({ rosters, draft, players, adp = [], totalRounds = 16 }) {
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

      // Prefer Sleeper's full_name; fallback to fn/ln if that’s what your players map has
      const playerName =
        pInfo.full_name ||
        [pInfo.fn, pInfo.ln].filter(Boolean).join(' ') ||
        pid;

      // Previous year’s draft round (or last round if waiver per your rule)
      const pick = pickByPlayerId.get(pid);
      const previousDraftRound = pick ? Number(pick.round) : Number(totalRounds);

      // Your simple keeper cost logic (you can refine later)
      const keeperCost = previousDraftRound > 0 ? previousDraftRound - 1 : null;

      // Simple eligibility color (refine later for 2-year max etc.)
      let eligibility = "red";
      if (keeperCost > 0) eligibility = "green";
      else if (keeperCost === 0) eligibility = "yellow";

      results.push({
        owner: roster.owner_id,
        rosterId: roster.roster_id,
        playerId: String(pid),                   // <-- IMPORTANT for your Svelte match
        player: playerName,
        position: pInfo.pos,
        team: pInfo.t,
        previousDraftRound,               // <-- NEW
        draftRound: previousDraftRound,   // (alias if you referenced 'draftRound' elsewhere)
        keeperCost,
        adp: adpMap.get(playerName) ?? null,
        eligibility
      });
    }
  }

  return results;
}
