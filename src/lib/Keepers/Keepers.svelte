<script>
	import { loadPlayers } from '$lib/utils/helper';
	import { calculateKeepers } from '$lib/keeperRulesEngine.js';  // ADD THIS IMPORT
	import RosterSorter from './KeeperSorter.svelte'
	
	export let leagueData, rosterData, leagueTeamManagers, playersInfo;
	
	let players = playersInfo.players;
	
	// ADD THIS - Calculate keeper data using your rules engine
	// Convert rosters object to array since your calculateKeepers expects an array
	$: rostersArray = rosterData?.rosters ? Object.values(rosterData.rosters) : [];
	
	$: keeperData = calculateKeepers({
		rosters: rostersArray,
		draft: leagueData?.previousDrafts?.[0]?.picks || [],
		players: players,
		adp: [], // Add your ADP data if you have it
		totalRounds: 14
	});
	// Debug logging - add this after the keeperData calculation
	$: if (leagueData?.previousDrafts?.[0]?.picks) {
		console.log('Draft picks found:', leagueData.previousDrafts[0].picks.length);
		console.log('First few draft picks:', leagueData.previousDrafts[0].picks.slice(0, 5));
	}
	$: {
	    console.log('Full leagueData structure:', leagueData);
	    console.log('leagueData keys:', leagueData ? Object.keys(leagueData) : 'leagueData is null/undefined');
	    
	    if (leagueData) {
	        console.log('Looking for draft data in:');
	        console.log('- leagueData.drafts:', leagueData.drafts);
	        console.log('- leagueData.previousDrafts:', leagueData.previousDrafts);
	        console.log('- leagueData.draft:', leagueData.draft);
	        console.log('- leagueData.draftData:', leagueData.draftData);
	    }
	}
	$: if (rostersArray.length > 0) {
		console.log('First roster players:', rostersArray[0].players?.slice(0, 5));
	}
	
	$: if (keeperData.length > 0) {
		console.log('Sample keeper data:', keeperData.slice(0, 3));
	}
	// Debug logging - remove after confirming it works
	$: if (keeperData && keeperData.length > 0) {
		console.log('Keeper data calculated:', keeperData);
	}
	
	const refreshPlayers = async () => {
		const newPlayersInfo = await loadPlayers(null, true);
		players = newPlayersInfo.players;
	}
	
	if(playersInfo.stale) {
		refreshPlayers();
	}
</script>

<style>
	.rosters {
		position: relative;
		z-index: 1;
	}
</style>

<div class="rosters">
	<RosterSorter 
		rosters={rosterData.rosters} 
		{players} 
		{leagueTeamManagers} 
		startersAndReserve={rosterData.startersAndReserve} 
		{leagueData}
		{keeperData}
	/>
</div>
