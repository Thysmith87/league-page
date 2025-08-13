<script>
	import { gotoManager } from '$lib/utils/helper';
  	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import { Icon } from '@smui/icon-button';
	import RosterRow from "./KeeperRow.svelte";

	// Props passed from loader
	export let roster;
	export let leagueTeamManagers;
	export let players;
	export let keeperData = []; // Array of { playerId, keeperCost, eligibility }

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
		const eligibilityColor = keeperInfo.eligibility === "green"
			? "background-color: lightgreen"
			: keeperInfo.eligibility === "yellow"
				? "background-color: gold"
				: keeperInfo.eligibility === "red"
					? "background-color: lightcoral"
					: "";

		digestedRoster.push({
			id: singlePlayer,
			name: `${passedPlayers[singlePlayer]?.fn || ''} ${passedPlayers[singlePlayer]?.ln || ''}${injury ? ` (${injury})` : ""}`,
			poss: passedPlayers[singlePlayer]?.pos,
			team: passedPlayers[singlePlayer]?.t,
			avatar: passedPlayers[singlePlayer]?.pos == "DEF"
				? `background-image: url(https://sleepercdn.com/images/team_logos/nfl/${singlePlayer.toLowerCase()}.png)`
				: `background-image: url(https://sleepercdn.com/content/nfl/players/thumb/${singlePlayer}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`,
			keeperCost: keeperInfo.keeperCost || "-",
			eligibilityStyle: eligibilityColor
		});
	}

	return digestedRoster;
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
	.result { width: 11px; }
</style>

<div class="team">
	<DataTable class="teamInner" table$aria-label="Team Name" style="width: 100%;">
		<Head>
			<Row>
				<Cell colspan=5 class="clickable">
					<h3 onclick={() => gotoManager({leagueTeamManagers, rosterID: roster.roster_id})}>
						<img alt="team avatar" class="teamAvatar" src="{team ? team.avatar : 'https://sleepercdn.com/images/v2/icons/player_default.webp'}" />
						{team?.name || 'No Manager'}
					</h3>
				</Cell>
			</Row>
			<Row>
				<Cell>Player</Cell>
				<Cell>Pos</Cell>
				<Cell>Team</Cell>
				<Cell>Keeper Cost</Cell>
				<Cell>Eligibility</Cell>
			</Row>
		</Head>
		<Body>
			{#each fullRoster as p}
				<Row>
					<Cell><div style="background:{p.avatar}">{p.name}</div></Cell>
					<Cell>{p.poss}</Cell>
					<Cell>{p.team}</Cell>
					<Cell>{p.keeperCost}</Cell>
					<Cell style={p.eligibilityStyle}></Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</div>
