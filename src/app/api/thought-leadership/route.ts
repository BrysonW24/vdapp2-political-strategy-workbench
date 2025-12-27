import { NextRequest, NextResponse } from 'next/server'
import { getYoutubeTranscript } from '@/lib/youtube-transcript'
import { analyseTranscriptWithAI } from '@/lib/ai-analysis'

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'Invalid request: urls array required' },
        { status: 400 }
      )
    }

    // Filter out empty or placeholder URLs
    const validUrls = urls.filter(url =>
      url &&
      url.trim() !== '' &&
      !url.includes('...') &&
      (url.includes('youtube.com') || url.includes('youtu.be'))
    )

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one valid YouTube URL' },
        { status: 400 }
      )
    }

    console.log('Processing', validUrls.length, 'YouTube URLs...')

    // Fetch transcripts for all URLs
    const transcripts: Array<{ url: string; transcript: string; error?: string }> = []

    for (const url of validUrls) {
      try {
        console.log('Fetching transcript for:', url)
        const transcript = await getYoutubeTranscript(url)
        console.log('Successfully fetched transcript, length:', transcript.length)
        transcripts.push({ url, transcript })
      } catch (error) {
        console.error(`Error fetching transcript for ${url}:`, error)
        transcripts.push({
          url,
          transcript: '',
          error: error instanceof Error ? error.message : 'Failed to fetch transcript'
        })
      }
    }

    // Check if we got at least one successful transcript
    const successfulTranscripts = transcripts.filter(t => !t.error && t.transcript)
    if (successfulTranscripts.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to fetch transcripts from any of the provided URLs. Please ensure the videos have captions/subtitles available.'
        },
        { status: 400 }
      )
    }

    console.log('Successfully fetched', successfulTranscripts.length, 'transcripts')
    console.log('Analysing with AI...')

    // Generate analysis using free open-source AI
    let brief;
    try {
      brief = await analyseTranscriptWithAI(successfulTranscripts)
      console.log('AI analysis complete')
    } catch (aiError) {
      console.error('AI analysis error:', aiError)
      return NextResponse.json(
        {
          error: `AI analysis failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}. Please try again.`
        },
        { status: 500 }
      )
    }

    return NextResponse.json(brief)
  } catch (error) {
    console.error('Error processing thought leadership:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate brief' },
      { status: 500 }
    )
  }
}
