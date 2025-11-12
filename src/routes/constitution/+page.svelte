<script>
    import { dues } from '$lib/utils/helper';
    let one, oneOne, oneOneOne, oneTwo, oneTwoOne, oneTwoTwo, oneTwoThree, oneTwoFour, oneTwoFive, oneThree;
    let two, twoOne, twoTwo, twoThree;
    let three, threeOne, threeTwo, threeTwoOne;
    let four, fourOne, fourTwo;
    let five, fiveOne;
    let six, sixOne, sixTwo, sixThree;
    let seven, sevenOne, sevenTwo, sevenThree;

    const goToSection = (section) => {
        const top = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({left: 0, top, behavior: 'smooth'});
    }
</script>

<style>
    .constitution {
        position: relative;
        z-index: 1;
        width: 92%;
        max-width: 800px;
        margin: 8em auto 10em;
    }

    h1 {
        font-size: 2em;
        line-height: 1.2em;
        text-align: center;
        margin: 2em 0 1.5em;
    }

    h2 {
        font-size: 1.5em;
        line-height: 1.2em;
    }

    h3 {
        text-decoration: underline;
        font-size: 1.3em;
        line-height: 1.2em;
    }

    h4 {
        text-decoration: underline;
        margin-left: 2em;
        font-size: 1.2em;
        line-height: 1.2em;
    }

    h5 {
        margin-left: 6em;
        font-size: 0.8em;
        line-height: 1.1em;
    }

    .subBlock {
        margin-left: 2.4em;
    }

    .sectionHeading {
        margin: 4em 0 1.5em;
    }

    .subSectionHeading {
        margin: 1.5em 0 1.5em;
    }

    .underscore {
        text-decoration: underline;
    }

    .right {
        text-align: right;
    }

    .positionMaximums td {
        min-width: 3em;
    }

    .noUnderscore {
        text-decoration: none;
    }

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        color: #00316b;
    }

    p {
        color: #777;
    }
</style>

<div class="constitution">
    <h1 class="noUnderscore">Marty's Bullshit (The Rules)</h1>
    <h3 class="noUnderscore">Please for the love of god, use this before asking me stupid questions</h3>
    <h2 class="noUnderscore">TABLE OF CONTENTS</h2>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(one)}>Section 1: Roster</h3>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(oneOne)}>1.1 Positional Breakdown</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(oneTwo)}>1.2 Trading</h4>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoOne)}>1.2.1 Trade Deadline</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoTwo)}>1.2.2 Trade Collusion</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoThree)}>1.2.3 Lending Players Prohibition</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoFour)}>1.2.4 Trade Restrictions</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoFive)}>1.2.5 Veto/Trade Process</h5>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(oneThree)}>1.3 Waiver Wire</h4>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(two)}>Section 2: Drafting</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(twoOne)}>2.1 Draft Order</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(twoTwo)}>2.2 Keepers</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(twoThree)}>2.3 Draft Day Trades</h4>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(three)}>Section 3: Scoring System</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(threeOne)}>3.1 Scoring System</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(threeTwo)}>3.2 Additional Rules</h4>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(threeTwoOne)}>3.2.1 Median Matchup Rule</h5>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(four)}>Section 4: Postseason</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(fourOne)}>4.1 Playoffs</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(fourTwo)}>4.2 Playoff Tiebreakers</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(five)}>Section 5: Tanking Policy</h3>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(fiveOne)}>5.1 League Tanking Policy</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(six)}>Section 6: Replacing Managers</h3>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sixOne)}>6.1 Removing Managers</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sixTwo)}>6.2 Replacing Managers</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sixThree)}>6.3 Replacement Incentive</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(seven)}>Section 7: League Finances</h3>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sevenOne)}>7.1 League Dues</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sixTwo)}>7.2 Payout</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sixThree)}>7.3 Raising Dues</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(eight)}>Section 8: Dumb Shit</h3>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(eightOne)}>8.1 Stupid Trades we should track</h4>
    
    
    <hr />
    
    <h2 class="sectionHeading" bind:this={one}>Section 1 Roster Breakdown</h2>
    
    <h3 class="subSectionHeading" bind:this={oneOne}>1.1 Positional Breakdown</h3>
    
    <p>15 Total Players</p>
    
    <p class="underscore">Starters</p>
    <ul>
        <li style="color:red;">QB</li>
        <li style="color:green;">RB</li>
        <li style="color:green;">RB</li>
        <li style="color:blue;">WR</li>
        <li style="color:blue;">WR</li>
        <li style="color:orange;">TE</li>
        <li>FLEX (RB/WR/TE)</li>
        <li style="color:purple;">K</li>
        <li style="color:grey;">D/ST</li>
    </ul>
    
    <p>5 Bench</p>

    <p>1 IR Spot (Player must be labeled as IR, Out, Covid, Suspended, and DNR/HOLDOUT/Opt-Out in the Sleeper App)</p>

    <h3 class="subSectionHeading" bind:this={oneTwo}>1.2 Trading</h3>
    
    <p>Trading of players and draft picks (up to 3 drafts away) are allowed. Trades will process immediately and will be reversed if vetoed or under investigation for collusion. Tradable assets include players, draft picks, and FAAB $.</p>

    <h4 bind:this={oneTwoOne}>1.2.1 Trade Deadline</h4>
    <div class="subBlock">
        <p>The trade deadline is set for the <bold>Tuesday following the Week 13 games</bold> of the NFL season.</p>
        <p>The FAAB trading deadline is also set for the <bold>Tuesday following the Week 13 games</bold> of the NFL season.</p>
        <p>The draft pick trading deadline is set for the <bold>Tuesday following the Week 10 games</bold> of the NFL season.</p>
    </div>

    <h4 bind:this={oneTwoTwo}>1.2.2 Trade Collusion</h4>
    <div class="subBlock">
        <p>If any owners are suspected of accepting bribes/offering bribes to enhance their/another owners team via trade, trading any assets other than fantasy players, draft picks, FAAB $, or otherwise found guilty of engaging in any form of collusion*, all parties involved in the trade will be susceptible to punishment. The punishments will go as followed:</p>
        
        <ul>
            <li>First Offense – Immediate reduction of FAAB budget by 80%</li>
            <li>Second Offense – Immediate freeze on all transaction types for the next 18 weeks of regular season and playoff fantasy football games, including trades and waiver wire bids</li>
            <li>Third Offense – A league meeting of all members not involved in any of the improper trades/activity in question will take place to discuss next steps.</li>
        </ul>

        <p>All trades that are found guilty of collusion, will be reversed/denied. If the trade had affected the outcome of previous games, the results of those games will be revised.  </p>

        <p>*Collusion includes the organizing of veto votes against an acceptable trade.</p>

        <p>The commissioner will error on the side of letting owners manage their teams the way they see fit. Any collusion will need to be clear. The commissioner reserves the right to step in and at the very least assess the thinking of any team involved in a heavily lop-sided trade. </p>
    </div>

    <h4 bind:this={oneTwoThree}>1.2.3 Lending Players Prohibition</h4>
    <div class="subBlock">
        <p>Any player traded from a team may not be re-acquired via trade within 2 weeks of the original trade. Any teams involved in this behavior will be subject to the aforementioned collusion punishments.</p>
    </div>
    
    <h4 bind:this={oneTwoFour}>1.2.4 Trade Restrictions</h4>
    <div class="subBlock">
        <p>You will not be able to trade draft s that are more than 3 drafts away. For example, during the 2025 season you cannot trade any picks in or after the 2028 draft. You may only trade FAAB $ from the current season.</p>
    </div>
    
    <h4 bind:this={oneTwoFive}>1.2.5 Veto/Trade Process</h4>
    <div class="subBlock">
        <p>We do not Veto Trades as a whole, but the commissioner has the right to revoke a trade or bring a trade to vote if there is a major concern with the trade.</p>
    </div>
    
    <h3 bind:this={oneThree}>1.3 Waiver Wire</h3>
    
    <p>FAAB Waiver wire system. Each team will begin the season with $100. $0 bids are allowed. Bids will process every night at 12am with and locked players will reset Tuesday nights at 2am</p>
    <p>All Game Days will be Free Agent days. Typically these days are as follows:</p>
    <ul>
        <li>Monday - Free Agents</li>
        <li>Tuesday - Waivers Processing at 3am PST</li>
        <li>Wednesday - Waivers Processing at 12am PST</li>
        <li>Thursday - Free Agents</li>
        <li>Friday - Waivers Processing at 12am PST </li>
        <li>Saturday - Waivers Processing at 12am PST</li>
        <li>Sunday - Free Agents</li>
    </ul>

    <p>FAAB budgets will reset at the beginning of the season.</p>
    
    
    <h2 class="sectionHeading" bind:this={two}>Section 2 Drafting</h2>
    
    <h3 bind:this={twoOne}>2.1 Draft Order</h3>
    <p>The draft order each year will be a linear draft with the first 6 picks making up the standings of the consolation bracket; Meaning the first pick is the winner or 7th place finisher second pick is the runner up or the 8th place Finisher</p>
    <p>The winner of the 5/6 place matchup in the finals will get the 7th round pick and then it will be inverse of standings. ie. the league champion from the previous year will draft last. 

    <h3 bind:this={twoTwo}>2.2 Keepers</h3>
    <p>We are playing in a keeper league allowing up to three players to be kept each year at their previous draft position.</p>
    <p>Keeper Player Rules</p>
    <ul>
        <li>A player may only be <bold>kept twice</bold> before being released back into the draft pool.</li>
        <li>A player not drafted in the current season may be kept in the 14th round.</li>
        <li>If a player is dropped and later picked back up, <bold>their keeper value remains</bold> based on their original draft position (it does not reset).</li>
        <li>Keeper selections must be designated by the defined deadline (typically 2 days before the draft) to allow other teams to plan.</li>
            <ul>
              <li>Exceptions may be granted day-of for preseason injuries or other extenuating circumstances.</li>
            </ul>
        <li>Players <bold>cannot be moved</bold> to a different draft position (better or worse).</li>
        <li>You may keep a player in a draft pick you traded for, but unless otherwise specified, that player’s position will default to one of your original picks.</li>
            <ul>
              <li>When not using one of your orginal draft positions, sleeper is not able to mark the player as Kept in the player history</li>
            </ul>
        <li>You are not required to keep any players.</li>
    </ul>

    <p>Use the <a href="https://wearethemeangirls.com/keepers">Keepers Tab</a> to determine which of players can be kept throughout the season and when making your pre-draft selections. <bold>Keeper Elegibility is solely determined by the charts found in the Keepers Tab</bold> and is in no way accurately tracked in Sleeper</p>

    <h3 bind:this={twoThree}>2.3 Draft Day Trades</h3>
    <p>No trades are permitted after the trade deadline has passed until the next years draft is completed.</p>
    
    <h2 class="sectionHeading" bind:this={three}>Section 3 Scoring System</h2>

    <h3 bind:this={threeOne}>3.1 Scoring System</h3>
    <p>The league scoring system breakdown is listed on the Sleeper fantasy app (for the most part, it follows typical .5PPR Scoring). The scoring system will never change without a majority league vote.</p>

    <h3 bind:this={threeTwo}>3.2 Additional Rules</h3>
        <h4 bind:this={threeTwoOne}>3.2.1 Median Matchup Rule</h4>
        <div class="subBlock">
            <p>We are playing with an additional game each week against the league median score.</p>
            <ul>
                <li>The top six teams (those scoring above the league median) will receive one additional win for that week.</li>
                <li>The bottom six teams (those scoring below the league median) will receive one additional loss added to their weekly record.</li>
            </ul>
        </div>

    <h2 class="sectionHeading" bind:this={four}>Section 4 Postseason</h2>
    
    <h3 bind:this={fourOne}>4.1 Playoffs</h3>
    <p>At the end of the season 6 teams will make the playoffs. The first round of playoffs will commence in week 15. Each team that wins their division and the 4 wild card teams that finish with the best records, will receive a playoff berth. The 2 teams that win their division will receive a bye week in the first round of the playoffs. Each playoff matchup will only last one week and the winner will advance. Week 18 will not be used.</p>
    
    <h3 bind:this={fourTwo}>4.2 Seeding Tiebreakers</h3>
    <p>If two teams finish with the same record the tiebreakers will go as followed:</p>

    <ol>
        <li>Points For</li>
        <li>Head 2 Head Record</li>
        <li>Division Record</li>
        <li>Total Points Against</li>
        <li>Coin Flip</li>
        <li>Duel to the death</li>
    </ol>

    <h2 class="sectionHeading" bind:this={five}>Section 5 Tanking Policy</h2>
    
    <h3 bind:this={fiveOne}>5.1 League Tanking Policy</h3>
    <p>No team may intentionally leave starting roster spots empty (Except Kickers, you do not need to roaster a kicker). Any evidence of intentionally leaving roster spots empty in order to improve your draft position may be subject to punishment, including but not limited to the forfeiture of draft selections.</p>

    <h2 class="sectionHeading" bind:this={six}>Section 6 Replacing Managers</h2>
    
    <h3 bind:this={sixOne}>6.1 Removing Managers</h3>
    <p>Short of continuously failing to set a valid lineup, or confirmed collusion, no manager can be removed against their will. Participation, through the league chat, trade offers, and the waiver wire, is strongly encouraged but generally grounds for removal.</p>
    
    <h3 bind:this={sixTwo}>6.2 Replacing Managers</h3>
    <p>When a manager needs to be replaced, the commisiooners will try to find a suitable candidate with some connection to at least a portion of the existing managers. Priority will be placed on managers who are eager to take on a dynasty commitment and will be very active within the league.</p>
    
    <h3 bind:this={sixThree}>6.3 Replacement Incentive</h3>
    <p>In the event that a manager chooses to quit the league or is removed by a comissioner, an incoming manager is offered a 50% reductioon on their first year buy-in.</p>

    <h2 class="sectionHeading" bind:this={seven}>Section 7 League Finances</h2>
    
    <h3 bind:this={sevenOne}>7.1 League Dues</h3>
    <p>League dues are set at ${dues}. Dues are collected through <a href="https://account.venmo.com/u/ThyTech">Venmo</a> and collection will be sent out no later than the first of week the first week of the nfl season. All managers must be fully paid up before the start of regular season. In the event that a manager fails to pay before the deadline, a 10% penalty will be added to their payment and will go towards the payouts at the end of the year.</p>
    
    <h3 bind:this={sevenTwo}>7.2 Payout</h3>
    <p>League payout is structured as follows:</p>
    <ul>
        <li>1st place: ${dues * 8}</li>
        <li>2nd place: ${dues * 3}</li>
        <li>3rd place: ${dues}</li>
    </ul>
    <p>In the event that a manager was fined due to late payment, their extra fee will be added to the winner's payout. Similarly, if new managers come into the league and the payout is smaller, the difference will come out of the winner's prize.</p>
    <p>$20 is kept by the league and used for trophies and other shit we can scheme up</p>

    <h3 bind:this={sevenThree}>7.3 Raising Dues</h3>
    <p>A ⅔ majority vote is required in order to raise league dues. In the event that a manager is no longer financially comfortable with the buyin, finding a co-manager to split the cost is reccomended.</p>

    <h2 class="sectionHeading" bind:this={eight}>Section 8 Dumb Shit</h2>
        <p>Here we track all the dumb shit you guys put me through</p>
    
    <h3 bind:this={eightOne}>8.1 Stupid Trades we should track</h3>
        <p>@Ballhog owes @ITouchd0wnThere a 2035 9th for Aaron Rodgers in week 11 of the 2025 Season</p>

</div>
