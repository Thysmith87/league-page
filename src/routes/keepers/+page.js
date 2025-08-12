export async function load({ fetch }) {
    const LEAGUE_ID = '1182840756039831552';
    const DRAFT_ID = '1182840756039831553';

    try {
        const [rostersRes, draftRes, playersRes] = await Promise.all([
            fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`),
            fetch(`https://api.sleeper.app/v1/draft/${DRAFT_ID}/picks`),
            fetch(`https://api.sleeper.app/v1/players/nfl`)
        ]);

        if (!rostersRes.ok) throw new Error('Rosters fetch failed');
        if (!draftRes.ok) throw new Error('Draft picks fetch failed');
        if (!playersRes.ok) throw new Error('Players fetch failed');

        const [rosters, draftPicks, players] = await Promise.all([
            rostersRes.json(),
            draftRes.json(),
            playersRes.json()
        ]);

        console.log('Rosters:', rosters);
        console.log('Draft Picks:', draftPicks);
        console.log('Players:', Object.keys(players).length);

        const keeperData = buildKeeperList(rosters, draftPicks, players);
        console.log('Keeper Data:', keeperData);

        return { keeperData };

    } catch (err) {
        console.error('Error loading keeper data:', err);
        return { keeperData: [] };
    }
}
