<script>
  export let data;
</script>

<h1>Keeper Options</h1>
{#if data.keepers && data.keepers.length}
 <table>
  <thead>
    <tr>
      <th>Owner</th>
      <th>Player</th>
      <th>Pos</th>
      <th>Team</th>
      <th>Round</th>
      <th>Keeper Cost</th>
      <th>ADP</th>
      <th>Eligibility</th>
    </tr>
  </thead>
  <tbody>
    {#each data.keepers as k}
      <tr>
        <td>{k.owner}</td>
        <td>{k.player}</td>
        <td>{k.position}</td>
        <td>{k.team}</td>
        <td>{k.draftRound}</td>
        <td>{k.keeperCost}</td>
        <td>{k.adp}</td>
        <td>{k.eligibility}</td>
      </tr>
    {/each}
  </tbody>
</table>
{:else}
  <p>No keeper data found.</p>
{/if}
