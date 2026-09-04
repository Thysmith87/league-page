<!-- src/lib/Keepers/KeeperRosters.svelte -->
<script>
	import { gotoManager } from '$lib/utils/helper';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import { Icon } from '@smui/icon-button';
	import RosterRow from "./KeeperRow.svelte";

	// Props passed from loader
	export let roster;
	export let leagueTeamManagers;
	export let players;
	export let keeperData = [];
	export let expanded = false; // Global expand/collapse-all control from KeeperSorter

	let isOpen = expanded; // Individual team's own toggle state

	// Keep individual state in sync when "Expand/Minimize All" is clicked
	$: isOpen = expanded;

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

			const keeperInfo = keeperData.find(k => k.playerId === singlePlayer) || {};

			const eligibilityColor =
				keeperInfo.eligibility === "green" ? "background-color: lightgreen" :
				keeperInfo.eligibility === "yellow" ? "background-color: gold" :
				"background-color: lightcoral";
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

	const toggleOpen = () => {
		isOpen = !isOpen;
	};
</script>

<style>
	.teamAvatar {
		vertical-align: middle;
		border-radius: 50%;
		height: 40px;
		margin-right: 15px;
		border: 0.25px solid #777;
	}
	.record {
		display: flex;
		justify-content: space-around;
		margin-top: 5px;
	}
	.result { width: 11px; }
	.clickable {
		cursor: pointer;
	}
	.chevron {
		display: inline-block;
		transition: transform 0.2s ease;
		margin-left: 8px;
		font-size: 0.8em;
	}
	.chevron.open {
		transform: rotate(180deg);
	}
	.team-header-row {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

<div class="team">
	<DataTable class="teamInner" table$aria-label="Team Name" style="width: 100%;">
		<Head>
			<Row>
				<Cell colspan=5 class="clickable" on:click={toggleOpen}>
					<div class="team-header-row">
						<h3 on:click|stopPropagation={() => gotoManager({leagueTeamManagers, rosterID: roster.roster_id})}>
							<img alt="team avatar" class="teamAvatar" src="{team ? team.avatar : 'https://sleepercdn.com/images/v2/icons/player_default.webp'}" />
							{team?.name || 'No Manager'}
						</h3>
						<span class="chevron" class:open={isOpen}>▼</span>
					</div>
					<div class="record">
						{#each record as result}
							<img alt="match result" class="result" src="/{result}.png" />
						{/each}
					</div>
				</Cell>
			</Row>
			{#if isOpen}
				<Row>
					<Cell>Player</Cell>
					<Cell>Pos</Cell>
					<Cell>Team</Cell>
					<Cell>Keeper Draft Round</Cell>
					<Cell>Eligibility</Cell>
				</Row>
			{/if}
		</Head>
		{#if isOpen}
			<Body>
				{#each fullRoster as p}
					<Row>
						<Cell><div style="background:{p.avatar}">{p.name}</div></Cell>
						<Cell>{p.poss}</Cell>
						<Cell>{p.team}</Cell>
						<Cell>{p.previousDraftRound}</Cell>
						<Cell style={p.eligibilityStyle}></Cell>
					</Row>
				{/each}
			</Body>
		{/if}
	</DataTable>
</div>
