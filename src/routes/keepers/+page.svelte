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
      <td>
        <span
          style="
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: {k.eligibility};
          "
          title={k.eligibility}
        ></span>
      </td>
    </tr>
  {/each}
</tbody>
