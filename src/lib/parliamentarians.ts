/**
 * Australian Parliamentarian Data Fetcher
 *
 * Fetches and maintains current list of Members of Parliament and Senators
 * from the Australian Parliament House website.
 *
 * Source: https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results
 */

import * as cheerio from 'cheerio';

export interface Parliamentarian {
  name: string;
  surname: string;
  electorate: string;
  state: string;
  party: string;
  positions: string[];
  chamber: 'House of Representatives' | 'Senate';
}

/**
 * Fetch current list of Members of Parliament (House of Representatives)
 * Returns array of parliamentarian data including names, parties, and electorates
 */
export async function fetchMembersOfParliament(): Promise<Parliamentarian[]> {
  const parliamentarians: Parliamentarian[] = [];

  try {
    // Fetch all pages of House of Representatives members
    // The search page shows 96 results per page, with 150 total members
    const pages = [1, 2]; // 2 pages needed for 150 members

    for (const page of pages) {
      const url = `https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results?q=&mem=1&par=-1&gen=0&ps=96&page=${page}`;

      console.log(`Fetching MPs from page ${page}...`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Political-Strategy-Workbench/1.0',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch MPs page ${page}: ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Parse each parliamentarian card
      $('.search-filter-results .row > div').each((_, element) => {
        const $card = $(element);

        // Extract name from heading
        const fullName = $card.find('h4 a').text().trim();
        if (!fullName) return;

        // Extract surname (last word before " MP")
        const nameParts = fullName.replace(' MP', '').split(' ');
        const surname = nameParts[nameParts.length - 1];

        // Extract electorate
        const electorateText = $card.find('p').filter((_, el) => {
          return $(el).text().includes('For');
        }).text().trim();
        const electorate = electorateText.replace('For', '').split(',')[0].trim();

        // Extract state
        const state = electorateText.split(',')[1]?.trim() || '';

        // Extract party
        const partyText = $card.find('p').filter((_, el) => {
          return $(el).text().includes('Party');
        }).text().trim();
        const party = partyText.replace('Party', '').trim();

        // Extract positions
        const positionsText = $card.find('p').filter((_, el) => {
          return $(el).text().includes('Positions');
        }).text().trim();
        const positions = positionsText
          ? positionsText.replace('Positions', '').split(/(?=[A-Z][a-z])/).filter(Boolean)
          : [];

        parliamentarians.push({
          name: fullName.replace(' MP', ''),
          surname,
          electorate,
          state,
          party,
          positions,
          chamber: 'House of Representatives',
        });
      });
    }

    console.log(`Fetched ${parliamentarians.length} Members of Parliament`);
    return parliamentarians;
  } catch (error) {
    console.error('Error fetching MPs:', error);
    return parliamentarians;
  }
}

/**
 * Fetch current list of Senators
 * Returns array of senator data including names, parties, and states
 */
export async function fetchSenators(): Promise<Parliamentarian[]> {
  const parliamentarians: Parliamentarian[] = [];

  try {
    // Fetch Senate members (76 senators total)
    const url = 'https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results?q=&sen=1&par=-1&gen=0&ps=96';

    console.log('Fetching Senators...');

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Political-Strategy-Workbench/1.0',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch Senators: ${response.status}`);
      return parliamentarians;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Parse each senator card
    $('.search-filter-results .row > div').each((_, element) => {
      const $card = $(element);

      // Extract name from heading
      const fullName = $card.find('h4 a').text().trim();
      if (!fullName) return;

      // Extract surname (last word before " Senator")
      const nameParts = fullName.replace(' Senator', '').split(' ');
      const surname = nameParts[nameParts.length - 1];

      // Extract state
      const stateText = $card.find('p').filter((_, el) => {
        return $(el).text().includes('For');
      }).text().trim();
      const state = stateText.replace('For', '').trim();

      // Extract party
      const partyText = $card.find('p').filter((_, el) => {
        return $(el).text().includes('Party');
      }).text().trim();
      const party = partyText.replace('Party', '').trim();

      // Extract positions
      const positionsText = $card.find('p').filter((_, el) => {
        return $(el).text().includes('Positions');
      }).text().trim();
      const positions = positionsText
        ? positionsText.replace('Positions', '').split(/(?=[A-Z][a-z])/).filter(Boolean)
        : [];

      parliamentarians.push({
        name: fullName.replace(' Senator', ''),
        surname,
        electorate: state, // For senators, electorate is their state
        state,
        party,
        positions,
        chamber: 'Senate',
      });
    });

    console.log(`Fetched ${parliamentarians.length} Senators`);
    return parliamentarians;
  } catch (error) {
    console.error('Error fetching Senators:', error);
    return parliamentarians;
  }
}

/**
 * Fetch all current Australian parliamentarians (MPs + Senators)
 */
export async function fetchAllParliamentarians(): Promise<Parliamentarian[]> {
  const [mps, senators] = await Promise.all([
    fetchMembersOfParliament(),
    fetchSenators(),
  ]);

  return [...mps, ...senators];
}

/**
 * Extract parliamentarian surnames for use as political keywords
 * Returns array of lowercase surnames for keyword matching
 */
export function extractParliamentarianKeywords(parliamentarians: Parliamentarian[]): string[] {
  return parliamentarians.map(p => p.surname.toLowerCase());
}

/**
 * Get cached parliamentarian data or fetch fresh if expired
 * Cache expires after 7 days (parliamentarians don't change frequently)
 */
let parliamentarianCache: {
  data: Parliamentarian[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export async function getCachedParliamentarians(): Promise<Parliamentarian[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (parliamentarianCache && (now - parliamentarianCache.timestamp) < CACHE_DURATION) {
    console.log('Using cached parliamentarian data');
    return parliamentarianCache.data;
  }

  // Fetch fresh data
  console.log('Fetching fresh parliamentarian data...');
  const parliamentarians = await fetchAllParliamentarians();

  // Update cache
  parliamentarianCache = {
    data: parliamentarians,
    timestamp: now,
  };

  return parliamentarians;
}

/**
 * Get parliamentarian surnames as keywords for political filtering
 * Uses cached data when available
 */
export async function getParliamentarianKeywords(): Promise<string[]> {
  const parliamentarians = await getCachedParliamentarians();
  return extractParliamentarianKeywords(parliamentarians);
}
