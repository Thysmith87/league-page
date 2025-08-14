// src/routes/keepers/+page.js
import {
  getLeagueData,
  getLeagueRosters,
  getLeagueTeamManagers,
  loadPlayers,
  waitForAll,
  getPreviousDrafts
} from '$lib/utils/helper';

import { calculateKeepers } from '$lib/keeperRulesEngine';
import { leagueID } from '$lib//utils/leagueInfo';

export async function load({ fetch }) {
  // fetch main league info
  const [leagueData, rosters, managers, players] = await waitForAll(
    getLeagueData(),
    getLeagueRosters(),
    getLeagueTeamManagers(),
    loadPlayers(fetch)
  );

  // fetch previous drafts
  const previousDrafts = await getPreviousDrafts(leagueID);
  const draftObj = previousDrafts?.[0] || {};
  const draftPicks = draftObj.picks || [];
  const totalRounds = draftObj.settings?.rounds ?? 16;

  // calculate keeper data
  const keeperData = calculateKeepers({
    rosters,
    draft: draftPicks,
    players,
    adp: [], // wire this later if needed
    totalRounds
  });

  return {
    leagueData,
    rosters,
    managers,
    players,
    keeperData,
    totalRounds
  };
}
