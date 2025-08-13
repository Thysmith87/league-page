// src/routes/keepers/+page.js
import { getLeagueRosters, getPreviousDrafts, loadPlayers, leagueID } from '$lib/utils/helper';
import { calculateKeepers } from '$lib/keeperRulesEngine';

export async function load() {
  const [rosters, draft, players] = await Promise.all([
    getLeagueRosters(leagueID),
    getPreviousDrafts(leagueID),
    loadPlayers()
  ]);

  // Assume ADP data will be fetched later; pass empty for now
  const adp = [];

  // Calculate keeper eligibility
  const keeperResults = calculateKeepers({
    rosters,
    draft: draft[0]?.picks || [],
    players,
    adp
  });

  // Group by owner
  const ownersMap = {};
  keeperResults.forEach(player => {
    if (!ownersMap[player.owner]) {
      ownersMap[player.owner] = [];
    }
    ownersMap[player.owner].push(player);
  });

  const owners = Object.entries(ownersMap).map(([owner_id, players]) => {
    return {
      owner_id,
      owner_name: rosters.find(r => r.owner_id === owner_id)?.owner?.display_name || 'Unknown Owner',
      players
    };
  });

  return { owners };
}
