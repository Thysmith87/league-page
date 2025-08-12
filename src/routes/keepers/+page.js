// src/routes/+page.js

const LEAGUE_ID = 'YOUR_LEAGUE_ID';
const DRAFT_ID = 'YOUR_DRAFT_ID';

export async function load() {
  const [rosters, draft, players, adp] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`).then(r => r.json()),
    fetch(`https://api.sleeper.app/v1/draft/${DRAFT_ID}/picks`).then(r => r.json()),
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
