<script>
	import { loadPlayers } from '$lib/utils/helper';
	import { calculateKeepers, findConsecutiveKeepers } from '$lib/keeperRulesEngine.js';
	import RosterSorter from './KeeperSorter.svelte'
	import IneligibleKeepersBanner from './IneligibleKeepersBanner.svelte';
	export let leagueData, rosterData, leagueTeamManagers, playersInfo, previousDrafts;
	
	let players = playersInfo.players;
	
	// ===== MANUAL YEAR OVERRIDE =====
	// Set this to true and update MANUAL_YEAR after your draft completes
	// to move the keeper eligibility window forward.
	const USE_MANUAL_YEAR = true;
	const MANUAL_YEAR = 2026; // <-- Update this each year after your draft
	// =================================
	
	$: currentFantasyYear = USE_MANUAL_YEAR ? MANUAL_YEAR : new Date().getFullYear();
	
	// Transform the draft data to match what keeper rules engine expects
	$: draftPicks = previousDrafts?.[0]?.draft ? 
		previousDrafts[0].draft.flatMap((round, roundIndex) => 
			round.map(pick => ({
				player_id: pick.player,
				round: roundIndex + 1
			}))
		) : [];
	
	$: rostersArray = rosterData?.rosters ? Object.values(rosterData.rosters) : [];
	
	$: keeperData = calculateKeepers({
		rosters: rostersArray,
		draft: draftPicks,
		players: players,
		adp: [],
		totalRounds: 14,
		currentYear: currentFantasyYear
	});
	
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
	<IneligibleKeepersBanner 
		{keeperData} 
		{leagueTeamManagers}
		currentYear={currentFantasyYear}
	/>
	<RosterSorter 
		rosters={rosterData.rosters} 
		{players} 
		{leagueTeamManagers} 
		startersAndReserve={rosterData.startersAndReserve} 
		{leagueData}
		{keeperData}
	/>
</div>
