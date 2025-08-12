import { 
    getLeagueRosters, 
    getLeagueTeamManagers, 
    getUpcomingDraft, 
    getDraftInfo, 
    getAllPlayers 
} from '$lib/utils/helper';

export async function load({ fetch }) {
    try {
        const draftInfo = await getDraftInfo('1048287967434899456');
        console.log('Draft info:', draftInfo);

        const players = await getAllPlayers();
        console.log('Players:', Object.keys(players).length);

        return {
            draftInfo,
            players
        };
    } catch (error) {
        console.error('Error loading page:', error);
        return {
            error: error.message
        };
    }
}

