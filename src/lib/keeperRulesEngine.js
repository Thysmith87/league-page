// keeperRulesEngine.js
export function calculateKeepers(rosters, draftResults, players, keeperRules) {
    const results = [];

    // Create a quick lookup for draft positions
    const draftRoundMap = {};
    draftResults.forEach(d => {
        draftRoundMap[d.player_id] = d.round;
    });

    for (const roster of rosters) {
        for (const playerId of roster.players || []) {
            if (playerId === "0") continue; // skip empty slot

            const playerInfo = players[playerId];
            if (!playerInfo) continue;

            const previousDraftRound = draftRoundMap[playerId] || null;
            const keeperCost = keeperRules.calculateCost(previousDraftRound);

            const eligibility = keeperRules.checkEligibility({
                previousDraftRound,
                keeperCost,
                playerInfo,
                roster
            });

            results.push({
                owner: roster.owner_id,
                playerId,
                player: `${playerInfo.fn} ${playerInfo.ln}`,
                position: playerInfo.pos,
                team: playerInfo.t,
                previousDraftRound,      // NEW field
                keeperCost,
                eligibility
            });
        }
    }

    return results;
}
