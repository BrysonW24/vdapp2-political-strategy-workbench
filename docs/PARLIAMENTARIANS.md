# Australian Parliamentarian Integration

## Overview

The Political Strategy Workbench automatically includes all current Australian parliamentarians (MPs and Senators) as political keywords. This ensures news articles mentioning any member of parliament are correctly identified as political content.

## How It Works

### Automatic Keyword Updates

The system fetches the current list of parliamentarians from the Australian Parliament House website:

**Source**: https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results

**Data Fetched**:
- All 150 Members of Parliament (House of Representatives)
- All 76 Senators
- Names, surnames, electorates, states, parties, and positions

**Caching**:
- Parliamentarian data is cached for 7 days
- Cache automatically refreshes when expired
- Reduces API calls to Parliament House website

### Integration with News Filtering

When filtering political news, the system:

1. Fetches current parliamentarian surnames (cached for 7 days)
2. Adds all surnames to the political keyword list
3. Any news article mentioning a parliamentarian surname is flagged as political
4. Combined with other political keywords (minister, parliament, policy, etc.)

**Example**: If an article mentions "Albanese", "Dutton", "Plibersek", or any other current MP/Senator, it's recognized as political content.

## Technical Implementation

### File: `src/lib/parliamentarians.ts`

Contains functions to:
- `fetchMembersOfParliament()` - Fetch all MPs
- `fetchSenators()` - Fetch all Senators
- `fetchAllParliamentarians()` - Fetch both chambers
- `getParliamentarianKeywords()` - Extract surnames for keyword matching
- `getCachedParliamentarians()` - Get cached data or refresh if expired

### File: `src/lib/news-aggregator.ts`

Updated to:
- Import parliamentarian keywords
- Include surnames in political keyword array
- Apply to all news filtering (ABC RSS + NewsData.io)

## Current Parliamentarians (as of December 2024)

### House of Representatives (150 members)

**Australian Labor Party** (94 members):
- Hon Anthony Albanese MP (Prime Minister, Grayndler NSW)
- Hon Richard Marles MP (Deputy PM, Minister for Defence, Corio VIC)
- Hon Tanya Plibersek MP (Minister for Social Services, Sydney NSW)
- Hon Dr Jim Chalmers MP (Treasurer, Rankin QLD)
- Hon Jason Clare MP (Minister for Education, Blaxland NSW)
- ... and 89 more

**Liberal Party of Australia** (18 members):
- Hon Sussan Ley MP (Leader of the Opposition, Farrer NSW)
- Hon Angus Taylor MP (Shadow Minister, Hume NSW)
- ... and 16 more

**Liberal National Party of Queensland** (16 members):
- Hon David Littleproud MP (Leader of the Nationals, Maranoa QLD)
- Mr Ted O'Brien MP (Deputy Leader of the Opposition, Fairfax QLD)
- ... and 14 more

**The Nationals** (8 members):
- Hon Darren Chester MP (Gippsland VIC)
- Hon Kevin Hogan MP (Deputy Leader, Page NSW)
- ... and 6 more

**Independent** (10 members):
- Dr Helen Haines MP (Indi VIC)
- Ms Kate Chaney MP (Curtin WA)
- Ms Allegra Spender MP (Wentworth NSW)
- ... and 7 more

**Other Parties**:
- Australian Greens: 1 member
- Centre Alliance: 1 member
- Katter's Australian Party: 1 member
- Pauline Hanson's One Nation: 1 member

### Senate (76 members)

*(Note: Senator data is also fetched automatically)*

## Updating Parliamentarian Data

### Automatic Updates

The system automatically updates every 7 days:
- Cache expires after 7 days
- Next news fetch automatically refreshes parliamentarian data
- No manual intervention required

### Manual Update (if needed)

To force a refresh of parliamentarian data:

**Option 1: Wait for Cache to Expire**
- Cache expires naturally after 7 days
- Next news fetch will trigger automatic refresh

**Option 2: Create a Utility Script**

Create `scripts/update-parliamentarians.ts`:

```typescript
import { getCachedParliamentarians, extractParliamentarianKeywords } from '../src/lib/parliamentarians';

async function updateParliamentarians() {
  console.log('Fetching current parliamentarians from Parliament House...');

  // This will bypass cache and fetch fresh data
  const parliamentarians = await fetchAllParliamentarians();

  console.log(`Fetched ${parliamentarians.length} parliamentarians`);

  const keywords = extractParliamentarianKeywords(parliamentarians);
  console.log(`Generated ${keywords.length} keyword surnames`);

  // Show sample
  console.log('Sample keywords:', keywords.slice(0, 20));
}

updateParliamentarians();
```

Run with:
```bash
npx ts-node scripts/update-parliamentarians.ts
```

## Benefits

### Comprehensive Political Coverage

**Before**: Manual keyword list with ~50 common political terms
- Would miss articles about backbench MPs
- Would miss new ministers appointed mid-term
- Would miss independent MPs not in major parties

**After**: Automatic inclusion of all 226 parliamentarians (150 MPs + 76 Senators)
- Catches any article mentioning any current parliamentarian
- Automatically updates when new MPs/Senators join (after cache expires)
- No maintenance required

### Examples of Articles Now Captured

1. **Backbench MP Mentions**:
   - "Mr Aaron Violi criticizes government spending" → Recognized (Violi is MP for Casey)
   - "Ms Louise Miller-Frost advocates for local funding" → Recognized (Miller-Frost is MP for Boothby)

2. **Minor Party MPs**:
   - "Bob Katter introduces agriculture bill" → Recognized (Katter's Australian Party)
   - "Rebekha Sharkie votes against measure" → Recognized (Centre Alliance)

3. **Independent MPs**:
   - "Allegra Spender speaks on climate" → Recognized (Independent, Wentworth)
   - "Zali Steggall introduces bill" → Recognized (Independent, Warringah)

## Data Source Terms of Use

### Australian Parliament House Website

**Legal Compliance**:
- ✅ Public information from official government website
- ✅ Parliamentarian data is publicly available information
- ✅ No authentication or API key required
- ✅ Reasonable polling intervals (7-day cache)
- ✅ Proper User-Agent identification

**Copyright**:
- Parliamentarian names, positions, and affiliations are factual data (not copyrightable)
- We only store surnames for keyword matching
- No reproduction of Parliament House copyrighted content

**Attribution**:
- Source credited: Australian Parliament House
- URL provided: https://www.aph.gov.au

## Monitoring

### Check Cached Parliamentarians

In your code or console:

```typescript
import { getCachedParliamentarians } from '@/lib/parliamentarians';

const parliamentarians = await getCachedParliamentarians();
console.log(`Total: ${parliamentarians.length}`);
console.log('Sample:', parliamentarians.slice(0, 5));
```

### View Current Keywords

```typescript
import { getParliamentarianKeywords } from '@/lib/parliamentarians';

const keywords = await getParliamentarianKeywords();
console.log(`${keywords.length} parliamentarian surnames being used as keywords`);
console.log(keywords);
```

## Troubleshooting

### No Parliamentarians Fetched

**Possible Causes**:
1. Network connectivity issue
2. Parliament House website structure changed
3. HTML parsing failed

**Solutions**:
1. Check server logs for errors
2. Test fetch manually: `curl https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results?q=&mem=1`
3. Update HTML parsing selectors if website changed

### Incorrect Keywords

**Issue**: Some parliamentarians missing or wrong surnames extracted

**Solutions**:
1. Check Parliament House website structure
2. Update cheerio selectors in `parliamentarians.ts`
3. Verify surname extraction logic

### Performance Issues

**Issue**: Fetching parliamentarians slows down news requests

**Solutions**:
- Cache is working correctly (7-day expiry)
- First request after cache expiry will be slower (acceptable)
- Subsequent requests use cached data (fast)
- Consider extending cache duration to 14 or 30 days if needed

## Future Enhancements

- [ ] Add state parliamentarians (state MPs and MLCs)
- [ ] Add ministerial portfolios for enhanced filtering
- [ ] Add party affiliation data for sentiment analysis by party
- [ ] Create dashboard showing most-mentioned parliamentarians
- [ ] Track when parliamentarians gain/lose positions
- [ ] Add historical parliamentarian data (former MPs/Senators)

## Support

For issues related to:
- **Parliamentarian data fetching**: Check `src/lib/parliamentarians.ts`
- **News filtering integration**: Check `src/lib/news-aggregator.ts`
- **Parliament House website changes**: Update HTML selectors in `fetchMembersOfParliament()` and `fetchSenators()`
