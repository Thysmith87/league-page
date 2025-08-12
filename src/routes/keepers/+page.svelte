<script>
  import { calculateKeepers } from '$lib/keepers.js';
  export let data;

  let keepers = calculateKeepers(data);
</script>

<h1>Fantasy Football Keepers</h1>

<table>
  <thead>
    <tr>
      <th>Owner</th>
      <th>Player</th>
      <th>Position</th>
      <th>Round</th>
      <th>Keeper Cost</th>
      <th>ADP</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#each keepers as k}
      <tr class={k.eligibility}>
        <td>{k.owner}</td>
        <td>{k.player}</td>
        <td>{k.position}</td>
        <td>{k.draftRound}</td>
        <td>{k.keeperCost}</td>
        <td>{k.adp}</td>
        <td>{k.eligibility}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table { border-collapse: collapse; width: 100%; }
  th, td { padding: 0.5rem; border: 1px solid #ccc; }
  .green { background-color: #d4edda; }
  .yellow { background-color: #fff3cd; }
  .red { background-color: #f8d7da; }
</style>
