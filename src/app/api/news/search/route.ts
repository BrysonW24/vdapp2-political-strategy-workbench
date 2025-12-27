import { NextRequest, NextResponse } from 'next/server'
import { searchHistoricalNews } from '@/lib/news-aggregator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keywords = searchParams.get('keywords') || undefined
    const fromDate = searchParams.get('from_date') || undefined
    const toDate = searchParams.get('to_date') || undefined
    const category = searchParams.get('category') || undefined

    console.log('Search API called with:', { keywords, fromDate, toDate, category })

    // Search historical news using Archive API if dates provided
    const articles = await searchHistoricalNews(
      keywords,
      fromDate,
      toDate,
      category
    )

    // Transform to match existing interface
    const news = articles.map((article, index) => ({
      id: index + 1,
      title: article.title,
      source: article.source,
      category: article.category,
      publishedAt: article.publishedAt,
      summary: article.summary,
      url: article.url,
      relevanceScore: article.relevanceScore,
      imageUrl: article.imageUrl,
      sourceIcon: article.sourceIcon,
    }))

    return NextResponse.json({
      success: true,
      count: news.length,
      total: articles.length,
      hasArchiveAccess: fromDate ? true : false,
      searchParams: { keywords, fromDate, toDate, category },
      news,
    })
  } catch (error) {
    console.error('Error searching news:', error)
    return NextResponse.json(
      { error: 'Failed to search news' },
      { status: 500 }
    )
  }
}
