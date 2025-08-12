// src/routes/+page.js
import { getUpcomingDraft, leagueID } from '$lib/utils/helper';

export async function load() {
  const [rosters, draft, players, adp] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`).then(r => r.json()),
    fetch(`https://api.sleeper.app/v1/draft/${getUpcomingDraft}/picks`).then(r => r.json()),
    fetch(`https://api.sleeper.app/v1/players/nfl`).then(r => r.json()),
    fetch(`https://fantasyfootballcalculator.com/api/v1/adp/half-ppr?teams=12`).then(r => r.json())
  ]);

  return {
    rosters,
    draft,
    players,
    adp: adp.players
  };
}
