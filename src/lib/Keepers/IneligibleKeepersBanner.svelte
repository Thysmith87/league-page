<!-- src/lib/components/Keepers/IneligibleKeepersBanner.svelte -->
<script>
	export let keeperData = [];
	export let leagueTeamManagers;
	export let currentYear = new Date().getFullYear();

	// Filter for ineligible players (red eligibility)
	$: ineligiblePlayers = keeperData.filter(player => player.eligibility === 'red');

	// Group by roster/owner for better display
	$: playersByRoster = ineligiblePlayers.reduce((acc, player) => {
		const rosterId = player.rosterId;
		if (!acc[rosterId]) {
			acc[rosterId] = [];
		}
		acc[rosterId].push(player);
		return acc;
	}, {});

	$: sortedRosters = Object.entries(playersByRoster).sort((a, b) => {
		// Sort by number of ineligible players descending
		return b[1].length - a[1].length;
	});
</script>

<style>
	.banner-container {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		padding: 25px;
		margin: 20px auto;
		width: 95%;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		color: white;
	}

	.banner-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.banner-title {
		font-size: 1.8em;
		font-weight: bold;
		margin: 0;
	}

	.banner-count {
		background: rgba(255, 255, 255, 0.2);
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 1.1em;
		font-weight: bold;
	}

	.roster-section {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 15px;
		backdrop-filter: blur(10px);
	}

	.roster-section:last-child {
		margin-bottom: 0;
	}

	.roster-header {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		gap: 12px;
	}

	.team-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid white;
	}

	.team-name {
		font-size: 1.2em;
		font-weight: bold;
	}

	.player-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px;
	}

	.player-card {
		background: rgba(255, 255, 255, 0.15);
		padding: 10px 12px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: background 0.2s;
	}

	.player-card:hover {
		background: rgba(255, 255, 255, 0.25);
	}

	.player-info {
		flex-grow: 1;
	}

	.player-name {
		font-weight: bold;
		font-size: 0.95em;
		margin-bottom: 2px;
	}

	.player-details {
		font-size: 0.8em;
		opacity: 0.9;
	}

	.ineligible-badge {
		background: #dc3545;
		color: white;
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.75em;
		font-weight: bold;
		white-space: nowrap;
	}

	.no-ineligible {
		text-align: center;
		padding: 30px;
		font-size: 1.2em;
		opacity: 0.9;
	}

	.explanation {
		background: rgba(255, 255, 255, 0.1);
		padding: 12px 15px;
		border-radius: 6px;
		font-size: 0.9em;
		margin-top: 15px;
		border-left: 4px solid rgba(255, 255, 255, 0.5);
	}

	@media (max-width: 768px) {
		.banner-container {
			padding: 15px;
		}

		.banner-title {
			font-size: 1.3em;
		}

		.player-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

{#if ineligiblePlayers.length > 0}
	<div class="banner-container">
		<div class="banner-header">
			<h2 class="banner-title">⚠️ Ineligible Keepers for {currentYear}</h2>
			<div class="banner-count">
				{ineligiblePlayers.length} {ineligiblePlayers.length === 1 ? 'Player' : 'Players'}
			</div>
		</div>

		{#each sortedRosters as [rosterId, players]}
			{@const team = leagueTeamManagers.teamManagersMap[leagueTeamManagers.currentSeason]?.[rosterId]?.team}
			<div class="roster-section">
				<div class="roster-header">
					<img 
						alt="team avatar" 
						class="team-avatar" 
						src={team ? team.avatar : 'https://sleepercdn.com/images/v2/icons/player_default.webp'}
					/>
					<div class="team-name">
						{team?.name || 'No Manager'} ({players.length})
					</div>
				</div>

				<div class="player-grid">
					{#each players as player}
						<div class="player-card">
							<div class="player-info">
								<div class="player-name">{player.player}</div>
								<div class="player-details">
									{player.position || 'N/A'} - {player.team || 'FA'}
								</div>
							</div>
							<div class="ineligible-badge">2 Years</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<div class="explanation">
			<strong>Note:</strong> These players have been kept for 2 consecutive years and cannot be kept for {currentYear}. 
			They must be returned to the draft pool.
		</div>
	</div>
{:else}
	<div class="banner-container">
		<div class="no-ineligible">
			✅ All players are eligible for keeping next season!
		</div>
	</div>
{/if}
