<script>
    export let keeperData;
</script>

{#each keeperData as team}
    <h2>Owner: {team.owner_id}</h2>
    <ul>
        {#each team.keepers as k}
            <li>{k.name} - Round {k.round} ({k.status})</li>
        {/each}
    </ul>
{/each}
