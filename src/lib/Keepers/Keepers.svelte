<script>
	import { loadPlayers } from '$lib/utils/helper';
	import { calculateKeepers } from '$lib/keeperRulesEngine.js';  // ADD THIS IMPORT
	import RosterSorter from './KeeperSorter.svelte'
	
	export let leagueData, rosterData, leagueTeamManagers, playersInfo, previousDrafts;	

	let players = playersInfo.players;
	
	// ADD THIS - Calculate keeper data using your rules engine
	// Convert rosters object to array since your calculateKeepers expects an array
	$: rostersArray = rosterData?.rosters ? Object.values(rosterData.rosters) : [];
	
	$: keeperData = calculateKeepers({
	    rosters: rostersArray,
	    draft: previousDrafts?.[0]?.draft || [],  // Use the loaded draft data
	    players: players,
	    adp: [],
	    totalRounds: 14
	});

	// Debug logging
	$: {
	    console.log('previousDrafts data:', previousDrafts);
	    console.log('previousDrafts type:', typeof previousDrafts);
	    
	    if (previousDrafts) {
	        console.log('previousDrafts length/keys:', Array.isArray(previousDrafts) ? previousDrafts.length : Object.keys(previousDrafts));
	        console.log('first draft:', previousDrafts[0]);
	        if (previousDrafts[0]?.picks) {
	            console.log('picks in first draft:', previousDrafts[0].picks.length);
	            console.log('sample picks:', previousDrafts[0].picks.slice(0, 3));
	        }
	    }
	}
	$: if (previousDrafts?.[0]?.draft) {
	    console.log('2024 draft picks:', previousDrafts[0].draft.length);
	    console.log('Sample 2024 picks:', previousDrafts[0].draft.slice(0, 5));
	} else {
	    console.log('No draft property found in 2024 data:', previousDrafts?.[0]);
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
