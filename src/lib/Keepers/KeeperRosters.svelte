<script>
	import { gotoManager } from '$lib/utils/helper';
  	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import { Icon } from '@smui/icon-button';
	import RosterRow from "./KeeperRow.svelte";
	import { onMount } from 'svelte';

	// Props passed from loader
	export let roster;
	export let leagueTeamManagers;
	export let players;
	export let keeperData = []; // Array of { playerId, keeperCost, eligibility }

	let isMobile = false;

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth <= 768;
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	$: team = leagueTeamManagers.teamManagersMap[leagueTeamManagers.currentSeason][roster.roster_id].team;

	// Flatten all players (starters + bench + reserve) into one array
	const digestData = (passedPlayers, rawPlayers) => {
		let digestedRoster = [];
		for (const singlePlayer of rawPlayers) {
			let injury = null;
			switch (passedPlayers[singlePlayer]?.is) {
				case "Questionable": injury = "Q"; break;
				case "Out": injury = "OUT"; break;
				case "PUP": injury = "PUP"; break;
				case "IR": injury = "IR"; break;
			}
			// pull keeper data (including previousDraftRound now)
			const keeperInfo = keeperData.find(k => k.playerId === singlePlayer) || {};
			// always set eligibility color (even red for ineligible)
			const eligibilityColor =
				keeperInfo.eligibility === "green" ? "background-color: lightgreen" :
				keeperInfo.eligibility === "yellow" ? "background-color: gold" :
				"background-color: lightcoral"; // default red

			digestedRoster.push({
				id: singlePlayer,
				name: `${passedPlayers[singlePlayer]?.fn || ''} ${passedPlayers[singlePlayer]?.ln || ''}${injury ? ` (${injury})` : ""}`,
				poss: passedPlayers[singlePlayer]?.pos,
				team: passedPlayers[singlePlayer]?.t,
				avatar: passedPlayers[singlePlayer]?.pos == "DEF"
					? `background-image: url(https://sleepercdn.com/images/team_logos/nfl/${singlePlayer.toLowerCase()}.png)`
					: `background-image: url(https://sleepercdn.com/content/nfl/players/thumb/${singlePlayer}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`,
				keeperCost: keeperInfo.keeperCost || "-",
				previousDraftRound: keeperInfo.previousDraftRound || "-",
				eligibilityStyle: eligibilityColor
			});
		}
		return digestedRoster;
	};

	$: allPlayers = (roster.players || []).filter(p => p !== "0");
	$: fullRoster = digestData(players, allPlayers);

	const buildRecord = (newRoster) => {
		const innerRecord = [];
		if(!newRoster.metadata?.record) return innerRecord;
		for (const c of newRoster.metadata.record) {
			switch (c) {
				case "W": innerRecord.push("green"); break;
				case "L": innerRecord.push("red"); break;
				default: innerRecord.push("gray"); break;
			}
		}
		return innerRecord;
	};

	$: record = buildRecord(roster);

<style>
	.team {
		margin-bottom: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
	}

	.team-header {
		background-color: #f5f5f5;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #e0e0e0;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.team-header:hover {
		background-color: #eeeeee;
	}

	.team-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.team-name-section {
		display: flex;
		align-items: center;
	}

	.team-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		margin-right: 0.75rem;
		border: 1px solid #ccc;
		object-fit: cover;
	}

	.team-name {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: #333;
	}

	.record {
		display: flex;
		gap: 2px;
	}

	.result {
		width: 10px;
		height: 10px;
		border-radius: 2px;
	}

	:global(.team .mdc-data-table) {
		border: none;
		box-shadow: none;
	}

	:global(.team .mdc-data-table__table) {
		width: 100%;
	}

	:global(.team .mdc-data-table__header-row) {
		height: 40px;
		background-color: #fafafa;
	}

	:global(.team .mdc-data-table__row) {
		height: 36px;
		border-bottom: 1px solid #f0f0f0;
	}

	:global(.team .mdc-data-table__row:last-child) {
		border-bottom: none;
	}

	:global(.team .mdc-data-table__cell) {
		padding: 8px 12px;
		font-size: 0.875rem;
		vertical-align: middle;
	}

	/* Specific column widths for better space allocation */
	:global(.team .mdc-data-table__cell:nth-child(1)) {
		width: 40%;
		min-width: 120px;
	}

	:global(.team .mdc-data-table__cell:nth-child(2)) {
		width: 15%;
		min-width: 50px;
	}

	:global(.team .mdc-data-table__cell:nth-child(3)) {
		width: 15%;
		min-width: 50px;
	}

	:global(.team .mdc-data-table__cell:nth-child(4)) {
		width: 20%;
		min-width: 60px;
	}

	:global(.team .mdc-data-table__cell:nth-child(5)) {
		width: 10%;
		min-width: 40px;
	}

	:global(.team .mdc-data-table__header-cell) {
		padding: 8px 12px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		color: #666;
		letter-spacing: 0.5px;
	}

	.player-cell {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.player-info {
		min-width: 0;
		flex: 1;
	}

	.player-details-mobile {
		font-size: 0.7rem;
		color: #888;
		margin-top: 2px;
	}

	.pos-mobile, .team-mobile {
		margin-right: 8px;
	}

	.pos-mobile {
		font-weight: 600;
		color: #666;
	}

	.player-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		margin-right: 8px;
		background-size: cover;
		background-position: center;
		flex-shrink: 0;
		border: 1px solid #ddd;
	}

	.player-name {
		font-size: 0.875rem;
		line-height: 1.2;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		hyphens: auto;
	}

	/* Mobile-specific adjustments */
	@media (max-width: 768px) {
		.player-name {
			font-size: 0.8rem;
		}
		
		.player-avatar {
			width: 20px;
			height: 20px;
			margin-right: 6px;
		}
		
		:global(.team .mdc-data-table__cell) {
			padding: 6px 8px;
		}
		
		/* Make player column take more space */
		.player-cell {
			min-width: 0;
			flex: 1;
		}

		/* Adjust column widths for mobile - only 3 columns now */
		:global(.team .mdc-data-table__cell:nth-child(1)) {
			width: 60%;
			min-width: 140px;
		}

		:global(.team .mdc-data-table__cell:nth-child(2)) {
			width: 25%;
			min-width: 60px;
		}

		:global(.team .mdc-data-table__cell:nth-child(3)) {
			width: 15%;
			min-width: 40px;
		}
	}

	@media (max-width: 480px) {
		.player-name {
			font-size: 0.75rem;
			-webkit-line-clamp: 1;
		}
	}

	.pos-cell {
		font-weight: 600;
		font-size: 0.8rem;
		color: #666;
	}

	.team-cell {
		font-size: 0.8rem;
		color: #888;
	}

	.draft-round-cell {
		font-size: 0.875rem;
		text-align: center;
	}

	.eligibility-cell {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		margin: 0 auto;
	}
</style>

<div class="team">
	<div class="team-header" on:click={() => gotoManager({leagueTeamManagers, rosterID: roster.roster_id})}>
		<div class="team-info">
			<div class="team-name-section">
				<img 
					alt="team avatar" 
					class="team-avatar" 
					src="{team ? team.avatar : 'https://sleepercdn.com/images/v2/icons/player_default.webp'}" 
				/>
				<h3 class="team-name">{team?.name || 'No Manager'}</h3>
			</div>
			<div class="record">
				{#each record as result}
					<div class="result" style="background-color: {result === 'green' ? '#4caf50' : result === 'red' ? '#f44336' : '#9e9e9e'}"></div>
				{/each}
			</div>
		</div>
	</div>

	<DataTable class="teamInner" table$aria-label="Team Roster" style="width: 100%;">
		<Head>
			<Row>
				<Cell>Player</Cell>
				{#if !isMobile}
					<Cell>Pos</Cell>
					<Cell>Team</Cell>
				{/if}
				<Cell>Draft Round</Cell>
				<Cell>Eligible</Cell>
			</Row>
		</Head>
		<Body>
			{#each fullRoster as p}
				<Row>
					<Cell>
						<div class="player-cell">
							<div class="player-avatar" style="{p.avatar}"></div>
							<div class="player-info">
								<div class="player-name">{p.name}</div>
								{#if isMobile}
									<div class="player-details-mobile">
										<span class="pos-mobile">{p.poss}</span>
										<span class="team-mobile">{p.team}</span>
									</div>
								{/if}
							</div>
						</div>
					</Cell>
					{#if !isMobile}
						<Cell><span class="pos-cell">{p.poss}</span></Cell>
						<Cell><span class="team-cell">{p.team}</span></Cell>
					{/if}
					<Cell><span class="draft-round-cell">{p.previousDraftRound}</span></Cell>
					<Cell>
						<div class="eligibility-cell" style="{p.eligibilityStyle}"></div>
					</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</div>
