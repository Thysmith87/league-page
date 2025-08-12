import { 
    getLeagueRosters, 
    getLeagueTeamManagers, 
    getUpcomingDraft, 
    getDraftInfo, 
    getAllPlayers 
} from '$lib/utils/helper';

export async function load({ fetch }) {
    const leagueId = '1182840756039831552';

    const rosters = await getLeagueRosters(leagueId, fetch);
    const draft = await getUpcomingDraft(leagueId, fetch);
    const draftInfo = await getDraftInfo(draft.draft_id, fetch);
    const players = await getAllPlayers(fetch);

    const keeperData = await buildKeeperList(rosters, draft.picks, draftInfo, players);

    return { keeperData };
}
