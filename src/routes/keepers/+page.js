import { getLeagueData, getLeagueRosters, getLeagueTeamManagers, loadPlayers, getPreviousDrafts, waitForAll } from '$lib/utils/helper';

export async function load({fetch}) {
    try {
        const rostersInfo = await waitForAll(
            getLeagueData().catch(e => { console.error('getLeagueData failed:', e); throw e; }),
            getLeagueRosters().catch(e => { console.error('getLeagueRosters failed:', e); throw e; }),
            getLeagueTeamManagers().catch(e => { console.error('getLeagueTeamManagers failed:', e); throw e; }),
            loadPlayers(fetch).catch(e => { console.error('loadPlayers failed:', e); throw e; }),
            getPreviousDrafts().catch(e => { console.error('getPreviousDrafts failed:', e); throw e; }),
        );
        return {
            rostersInfo
        };
    } catch (error) {
        console.error('Keepers page load error:', error);
        throw error;
    }
}
