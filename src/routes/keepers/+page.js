import { getLeagueData, getLeagueRosters, getLeagueTeamManagers, loadPlayers, getPreviousDrafts, waitForAll } from '$lib/utils/helper';

export async function load({fetch}) {
    const rostersInfo = waitForAll(
        getLeagueData(),
        getLeagueRosters(),
        getLeagueTeamManagers(),
        loadPlayers(fetch),
        getPreviousDrafts(),
    )

    return {
        rostersInfo
    };
}
