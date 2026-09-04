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
	export let expanded = false; // Global "Expand/Minimize All" control from KeeperSorter

	let isOpen = expanded;

	// Sync individual card state whenever the global toggle changes
	$: isOpen = expanded;

	$: team = leagueTeamManagers.teamManagersMap[leagueTeamManagers.currentSeason][roster.roster_id].team;

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

	const toggleOpen = (event) => {
		event.stopPropagation();
		isOpen = !isOpen;
	};
</script>
<style>
	.teamAvatar {
		vertical-align: middle;
		border-radius: 50%;
		height: 32px;
		width: 32px;
		margin-right: 10px;
		border: 0.25px solid #777;
		flex-shrink: 0;
	}
	.record {
		display: flex;
		justify-content: space-around;
		margin-top: 5px;
	}
	.result { width: 11px; }

	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		width: 100%;
	}

	.team-name-link {
		display: flex;
		align-items: center;
		cursor: pointer;
		width: 220px;
		flex-shrink: 0;
		min-width: 0; /* required for ellipsis to work inside a flex child */
	}

	.team-name-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 15px;
		font-weight: 600;
		margin: 0;
		line-height: 1.2;
	}

	.toggle-btn {
		background: #2a2a2a;
		color: #fff;
		border: 1px solid #555;
		border-radius: 4px;
		cursor: pointer;
		padding: 5px 12px;
		font-size: 0.8em;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.toggle-btn:hover {
		background: #3a3a3a;
	}
</style>

<div class="team">
	<DataTable class="teamInner" table$aria-label="Team Name" style="width: 100%;">
		<Head>
			<Row>
				<Cell colspan=5>
					<div class="header-row">
						<div class="team-name-link" onclick={() => gotoManager({leagueTeamManagers, rosterID: roster.roster_id})}>
							<img alt="team avatar" class="teamAvatar" src="{team ? team.avatar : 'https://sleepercdn.com/images/v2/icons/player_default.webp'}" />
							<h3 class="team-name-text">{team?.name || 'No Manager'}</h3>
						</div>
							<button class="toggle-btn" onclick={toggleOpen}>
								{isOpen ? 'Hide roster ▲' : 'Show roster ▼'}
							</button>
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
