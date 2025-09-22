<script>
	import { loadPlayers } from '$lib/utils/helper';
	import { calculateKeepers, findConsecutiveKeepers } from '$lib/keeperRulesEngine.js';
	import RosterSorter from './KeeperSorter.svelte'
	
	export let leagueData, rosterData, leagueTeamManagers, playersInfo, previousDrafts;
	
	let players = playersInfo.players;
	
	// Transform the draft data to match what keeper rules engine expects
	$: draftPicks = previousDrafts?.[0]?.draft ? 
		previousDrafts[0].draft.flatMap((round, roundIndex) => 
			round.map(pick => ({
				player_id: pick.player,  // Convert 'player' to 'player_id'
				round: roundIndex + 1    // Add round number (1-based)
			}))
		) : [];

	// Convert rosters object to array
	$: rostersArray = rosterData?.rosters ? Object.values(rosterData.rosters) : [];
	
	// Calculate keeper data using enhanced rules engine
	$: keeperData = calculateKeepers({
		rosters: rostersArray,
		draft: draftPicks,
		players: players,
		adp: [], // Add your ADP data if you have it
		totalRounds: 14,
		currentYear: 2025
	});
	
	// Debug logging
	$: if (keeperData.length > 0) {
		findConsecutiveKeepers(2026);
	}
	$: if (keeperData && keeperData.length > 0) {
		console.log('Keeper data calculated:', keeperData.length, 'players');
		console.log('Sample keeper data:', keeperData.slice(0, 3));
		
		// Show eligibility summary
		const summary = keeperData.reduce((acc, player) => {
			acc[player.eligibility] = (acc[player.eligibility] || 0) + 1;
			return acc;
		}, {});
		console.log('Eligibility summary:', summary);
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
