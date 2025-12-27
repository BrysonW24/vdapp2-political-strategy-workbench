import { NextRequest, NextResponse } from 'next/server'
import { fetchNewsByCategory } from '@/lib/news-aggregator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')

    console.log(`Fetching news for category: ${category}`)

    // Fetch real news from ABC RSS + NewsData.io
    const articles = await fetchNewsByCategory(
      category as 'all' | 'politics' | 'federal-politics' | 'business' | 'regulation'
    )

    // Apply limit
    const limitedArticles = articles.slice(0, limit)

    // Transform to match existing interface
    const news = limitedArticles.map((article, index) => ({
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
      news,
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
