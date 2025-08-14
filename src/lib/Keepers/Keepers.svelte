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
