import { getSubtitles } from 'youtube-caption-extractor';

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export async function getYoutubeTranscript(url: string): Promise<string> {
  try {
    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Fetch captions/subtitles
    const subtitles = await getSubtitles({
      videoID: videoId,
      lang: 'en' // Default to English, could be made configurable
    });

    if (!subtitles || subtitles.length === 0) {
      throw new Error('No captions available for this video');
    }

    // Combine all subtitle segments into a single text
    const fullTranscript = subtitles
      .map((segment: any) => segment.text || '')
      .filter((text: string) => text.length > 0)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!fullTranscript || fullTranscript.length === 0) {
      throw new Error('Transcript is empty');
    }

    return fullTranscript;
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    throw new Error(`Failed to fetch transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractVideoId(url: string): string | null {
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\?\/]+)/,
    /youtube\.com\/embed\/([^&\?\/]+)/,
    /youtube\.com\/v\/([^&\?\/]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
