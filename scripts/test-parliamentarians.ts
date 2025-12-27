/**
 * Test script to verify parliamentarian data fetching
 * Run with: npx ts-node scripts/test-parliamentarians.ts
 */

import {
  fetchMembersOfParliament,
  fetchSenators,
  fetchAllParliamentarians,
  getParliamentarianKeywords,
  getCachedParliamentarians
} from '../src/lib/parliamentarians';

async function testParliamentarianFetch() {
  console.log('='.repeat(80));
  console.log('TESTING PARLIAMENTARIAN DATA FETCH');
  console.log('='.repeat(80));
  console.log();

  // Test 1: Fetch Members of Parliament
  console.log('TEST 1: Fetching Members of Parliament (House of Representatives)...');
  const mps = await fetchMembersOfParliament();
  console.log(`✅ Fetched ${mps.length} MPs`);
  console.log('Sample MPs:', mps.slice(0, 5).map(mp => ({
    name: mp.name,
    electorate: mp.electorate,
    party: mp.party
  })));
  console.log();

  // Test 2: Fetch Senators
  console.log('TEST 2: Fetching Senators...');
  const senators = await fetchSenators();
  console.log(`✅ Fetched ${senators.length} Senators`);
  console.log('Sample Senators:', senators.slice(0, 5).map(s => ({
    name: s.name,
    state: s.state,
    party: s.party
  })));
  console.log();

  // Test 3: Fetch All Parliamentarians
  console.log('TEST 3: Fetching All Parliamentarians...');
  const all = await fetchAllParliamentarians();
  console.log(`✅ Total: ${all.length} parliamentarians`);
  console.log(`   - House of Representatives: ${all.filter(p => p.chamber === 'House of Representatives').length}`);
  console.log(`   - Senate: ${all.filter(p => p.chamber === 'Senate').length}`);
  console.log();

  // Test 4: Extract Keywords
  console.log('TEST 4: Extracting Surnames for Keywords...');
  const keywords = await getParliamentarianKeywords();
  console.log(`✅ Generated ${keywords.length} keyword surnames`);
  console.log('Sample keywords:', keywords.slice(0, 20));
  console.log();

  // Test 5: Party Distribution
  console.log('TEST 5: Party Distribution...');
  const partyCount = all.reduce((acc, p) => {
    acc[p.party] = (acc[p.party] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(partyCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([party, count]) => {
      console.log(`   ${party}: ${count} members`);
    });
  console.log();

  // Test 6: Cabinet Ministers (those with positions)
  console.log('TEST 6: Ministers and Office Holders...');
  const withPositions = all.filter(p => p.positions.length > 0);
  console.log(`✅ Found ${withPositions.length} parliamentarians with positions`);
  console.log('Sample positions:');
  withPositions.slice(0, 10).forEach(p => {
    console.log(`   ${p.name} (${p.party}):`);
    p.positions.forEach(pos => console.log(`      - ${pos}`));
  });
  console.log();

  // Test 7: Keyword Matching Test
  console.log('TEST 7: Testing Keyword Matching...');
  const testArticle = 'Prime Minister Anthony Albanese announced new climate policy today. Opposition Leader Peter Dutton criticized the plan.';
  const matchedKeywords = keywords.filter(k => testArticle.toLowerCase().includes(k));
  console.log(`Test article: "${testArticle}"`);
  console.log(`✅ Matched keywords: ${matchedKeywords.join(', ')}`);
  console.log();

  // Test 8: Cache Test
  console.log('TEST 8: Testing Cache Functionality...');
  console.log('Fetching cached parliamentarians (should be instant)...');
  const startTime = Date.now();
  const cached = await getCachedParliamentarians();
  const duration = Date.now() - startTime;
  console.log(`✅ Fetched ${cached.length} parliamentarians in ${duration}ms (cached)`);
  console.log();

  console.log('='.repeat(80));
  console.log('ALL TESTS COMPLETED SUCCESSFULLY');
  console.log('='.repeat(80));
}

// Run the tests
testParliamentarianFetch().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
