export async function load({ fetch }) {
    const LEAGUE_ID = '1182840756039831552';
    const DRAFT_ID = '1182840756039831553';

    const [rostersRes, draftRes, playersRes] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`),
        fetch(`https://api.sleeper.app/v1/draft/${DRAFT_ID}/picks`),
        fetch(`https://api.sleeper.app/v1/players/nfl`)
    ]);

    const [rosters, draftPicks, players] = await Promise.all([
        rostersRes.json(),
        draftRes.json(),
        playersRes.json()
    ]);

    const keeperData = buildKeeperList(rosters, draftPicks, players);

    return { keeperData };
}

// Paste keeper rules engine here
function buildKeeperList(rosters, draftPicks, players) {
    const CURRENT_YEAR = new Date().getFullYear();
    const LAST_ROUND = Math.max(...draftPicks.map(p => p.round));
    
    // Build a quick lookup for draft info: player_id -> { round, year }
    const draftLookup = {};
    draftPicks.forEach(pick => {
        draftLookup[pick.player_id] = {
            round: pick.round,
            year: new Date(pick.metadata?.draft_year || CURRENT_YEAR).getFullYear()
        };
    });

    const teams = [];

    rosters.forEach(roster => {
        const ownerId = roster.owner_id;
        const teamPlayers = roster.players || [];
        const keepers = [];

        teamPlayers.forEach(playerId => {
            const playerInfo = players[playerId];
            let round, year;

            // Was the player drafted?
            if (draftLookup[playerId]) {
                round = draftLookup[playerId].round;
                year = draftLookup[playerId].year;
            } else {
                // Waiver pickup → last round
                round = LAST_ROUND;
                year = CURRENT_YEAR;
            }

            // Check keeper eligibility (within 2 years of draft year)
            const eligible = (CURRENT_YEAR - year) <= 2;

            if (eligible) {
                keepers.push({
                    name: playerInfo?.full_name || playerInfo?.first_name + " " + playerInfo?.last_name || "Unknown Player",
                    round,
                    year,
                    eligible,
                    status: eligible ? "Eligible" : "Ineligible"
                });
            }
        });

        // Apply round conflict rule
        const roundCounts = keepers.reduce((acc, k) => {
            acc[k.round] = (acc[k.round] || 0) + 1;
            return acc;
        }, {});

        const finalKeepers = keepers.map(k => {
            if (roundCounts[k.round] > 1) {
                return {
                    ...k,
                    status: `${k.status} (Round Conflict)`
                };
            }
            return k;
        });

        teams.push({
            owner_id: ownerId,
            keepers: finalKeepers
        });
    });

    return teams;
}
