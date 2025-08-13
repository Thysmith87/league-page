// src/routes/keepers/+page.js
import { getLeagueRosters, getPreviousDrafts, loadPlayers, leagueID } from '$lib/utils/helper';
import { calculateKeepers } from '$lib/keeperRulesEngine';

export async function load() {
  try {
    // Load core data
    const [rosters, previousDrafts, players] = await Promise.all([
      getLeagueRosters(leagueID),
      getPreviousDrafts(leagueID),
      loadPlayers()
    ]);

    if (!rosters?.length || !previousDrafts?.length) {
      console.warn("No rosters or draft data found for league:", leagueID);
      return { keepers: [], error: "No keeper data available." };
    }

    const draft = previousDrafts[0]?.picks || [];
    const adp = []; // placeholder until we fetch ADP data

    const keepers = calculateKeepers({
      rosters,
      draft,
      players,
      adp
    });

    return { keepers, error: null };

  } catch (err) {
    console.error("Keeper loader error:", err);
    return { keepers: [], error: "Failed to load keeper data." };
  }
}
