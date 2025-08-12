async function buildKeeperList(rosters, draftPicks, draftInfo, players) {
  const CURRENT_YEAR = new Date().getFullYear();
  const draftYear = new Date(draftInfo.season).getFullYear ? new Date(draftInfo.season).getFullYear() : parseInt(draftInfo.season, 10);

  const lookupRound = Object.fromEntries(
    draftPicks.map(pick => [pick.player_id, pick.round])
  );

  return rosters.map(roster => {
    const keepers = roster.players.map(pid => {
      const round = lookupRound[pid] ?? Math.max(...draftPicks.map(p => p.round)); // fallback
      const eligible = (CURRENT_YEAR - draftYear) <= 2;

      const info = players[pid] || {};
      const name = info.full_name || `${info.first_name || ''} ${info.last_name || ''}`.trim() || pid;

      return {
        name,
        round,
        status: eligible ? 'Eligible' : 'Ineligible'
      };
    });

    const roundCounts = keepers.reduce((acc, k) => {
      acc[k.round] = (acc[k.round] || 0) + 1;
      return acc;
    }, {});

    return {
      owner_id: roster.owner_id,
      keepers: keepers.map(k => ({
        ...k,
        status: roundCounts[k.round] > 1 ? `${k.status} (Round Conflict)` : k.status
      }))
    };
  });
}
