<script>
  export let data;

  function eligibilityColor(status) {
    if (status === "green") return "bg-green-500";
    if (status === "yellow") return "bg-yellow-400";
    return "bg-red-500";
  }
</script>

<h1 class="text-2xl font-bold mb-6">Keeper Eligible Players</h1>

{#each data.owners as owner}
  <section class="mb-10">
    <h2 class="text-xl font-semibold mb-3">{owner.owner_name}</h2>
    <table class="min-w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-2 py-1 border">Player</th>
          <th class="px-2 py-1 border">Position</th>
          <th class="px-2 py-1 border">Team</th>
          <th class="px-2 py-1 border">Keeper Draft Position</th>
          <th class="px-2 py-1 border">Eligibility</th>
        </tr>
      </thead>
      <tbody>
        {#each owner.players as p}
          <tr>
            <td class="px-2 py-1 border">{p.player}</td>
            <td class="px-2 py-1 border">{p.position}</td>
            <td class="px-2 py-1 border">{p.team}</td>
            <td class="px-2 py-1 border text-center">{p.draftRound ?? 'N/A'}</td>
            <td class="px-2 py-1 border text-center">
              <span class={`inline-block w-4 h-4 rounded-full ${eligibilityColor(p.eligibility)}`}></span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
{/each}
