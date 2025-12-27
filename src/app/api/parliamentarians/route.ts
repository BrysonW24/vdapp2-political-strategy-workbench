import { NextResponse } from 'next/server';
import {
  getCachedParliamentarians,
  getParliamentarianKeywords,
  fetchAllParliamentarians
} from '@/lib/parliamentarians';

/**
 * GET /api/parliamentarians
 * Returns current Australian parliamentarians data
 *
 * Query params:
 * - refresh=true: Force refresh cache (fetch fresh data from Parliament House)
 * - keywords_only=true: Return only surnames array for keyword matching
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';
    const keywordsOnly = searchParams.get('keywords_only') === 'true';

    // If keywords only requested
    if (keywordsOnly) {
      const keywords = await getParliamentarianKeywords();
      return NextResponse.json({
        success: true,
        count: keywords.length,
        keywords,
      });
    }

    // Get parliamentarian data
    const parliamentarians = refresh
      ? await fetchAllParliamentarians() // Force fresh fetch
      : await getCachedParliamentarians(); // Use cache if available

    // Calculate statistics
    const stats = {
      total: parliamentarians.length,
      chambers: {
        house: parliamentarians.filter(p => p.chamber === 'House of Representatives').length,
        senate: parliamentarians.filter(p => p.chamber === 'Senate').length,
      },
      parties: parliamentarians.reduce((acc, p) => {
        acc[p.party] = (acc[p.party] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      withPositions: parliamentarians.filter(p => p.positions.length > 0).length,
    };

    return NextResponse.json({
      success: true,
      stats,
      parliamentarians: parliamentarians.map(p => ({
        name: p.name,
        surname: p.surname,
        electorate: p.electorate,
        state: p.state,
        party: p.party,
        positions: p.positions,
        chamber: p.chamber,
      })),
    });
  } catch (error) {
    console.error('Error fetching parliamentarians:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch parliamentarians',
      },
      { status: 500 }
    );
  }
}
