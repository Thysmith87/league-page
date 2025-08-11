export function calculateKeepers({ rosters, draft, players, adp }) {
  const adpMap = Object.fromEntries(adp.map(p => [p.name, p.adp]));

  return rosters.flatMap(roster => {
    return roster.players.map(pid => {
      const draftPick = draft.find(d => d.player_id === pid);
      const playerInfo = players[pid] || {};
      const round = draftPick ? draftPick.round : null;
      const keeperCost = round ? round - 1 : null;

      let eligibility = "red";
      if (keeperCost && keeperCost > 0) eligibility = "green";
      else if (keeperCost === 0) eligibility = "yellow";

      return {
        owner: roster.owner_id,
        player: playerInfo.full_name,
        position: playerInfo.position,
        team: playerInfo.team,
        draftRound: round,
        keeperCost,
        adp: adpMap[playerInfo.full_name] || null,
        eligibility
      };
    });
  });
}
