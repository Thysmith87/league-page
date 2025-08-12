// src/lib/utils/helperFunctions/loadKeepers.js
import { calculateKeepers } from '$lib/keeperRulesEngine';
import { manualKeepers } from './manualKeepers';
import { getLeagueRosters, getDraftInfo, getAllPlayers } from '$lib/utils/helper'; 
// ^ Adjust to your actual API helper function names

export async function loadKeepers() {
  try {
    const [rosters, draft, players] = await Promise.all([
      getLeagueRosters(),
      getDraftInfo(),
      getAllPlayers(),
    ]);

    const keepers = calculateKeepers({ rosters, draft, players });

    if (keepers && keepers.length > 0) {
      console.log("Loaded keepers from rules engine");
      return keepers;
    } else {
      console.warn("No keeper data found — using manual keepers");
      return manualKeepers;
    }
  } catch (err) {
    console.error("Error loading keeper data:", err);
    console.warn("Falling back to manual keepers");
    return manualKeepers;
  }
}
