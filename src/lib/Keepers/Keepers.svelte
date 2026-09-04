<script>
	import { loadPlayers } from '$lib/utils/helper';
	import { calculateKeepers, findConsecutiveKeepers } from '$lib/keeperRulesEngine.js';
	import RosterSorter from './KeeperSorter.svelte'
	import IneligibleKeepersBanner from './IneligibleKeepersBanner.svelte';
	export let leagueData, rosterData, leagueTeamManagers, playersInfo, previousDrafts;
	
	let players = playersInfo.players;
	
	// ===== MANUAL YEAR OVERRIDE =====
	const USE_MANUAL_YEAR = true;
	const MANUAL_YEAR = 2026; // <-- Update this each year after your draft
	// =================================
	
	$: currentFantasyYear = USE_MANUAL_YEAR ? MANUAL_YEAR : new Date().getFullYear();
	
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
	.keepers-layout {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 95%;
		margin: 20px auto;
	}

	.sidebar-column {
		width: 100%;
	}

	.main-column {
		width: 100%;
		position: relative;
		z-index: 1;
	}

	/* Side-by-side layout on large screens only */
	@media (min-width: 1100px) {
		.keepers-layout {
			flex-direction: row;
			align-items: flex-start;
		}

		.sidebar-column {
			flex: 0 0 320px;
		}

		.main-column {
			flex: 1 1 auto;
			min-width: 0; /* prevents flex overflow issues */
		}
	}
</style>

<div class="keepers-layout">
	<div class="sidebar-column">
		<IneligibleKeepersBanner 
			{keeperData} 
			{leagueTeamManagers}
			currentYear={currentFantasyYear}
			sidebar={true}
		/>
	</div>
	<div class="main-column">
		<RosterSorter 
			rosters={rosterData.rosters} 
			{players} 
			{leagueTeamManagers} 
			startersAndReserve={rosterData.startersAndReserve} 
			{leagueData}
			{keeperData}
		/>
	</div>
</div>
