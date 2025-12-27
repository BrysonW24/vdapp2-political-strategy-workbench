# YouTube Transcript Analysis

## Overview

The Thought Leadership feature extracts YouTube video transcripts and generates AI-powered policy intelligence briefs for Australian government media officials. It supports videos up to 3+ hours long and uses free open-source AI models.

## Requirements

### Video Requirements

1. **Captions/Subtitles Required**
   - Videos MUST have either auto-generated or manual captions/subtitles
   - Videos without captions will fail with an error message
   - Most YouTube videos have auto-generated captions enabled by default

2. **Supported URL Formats**
   - Regular videos: `https://www.youtube.com/watch?v=VIDEO_ID`
   - Short URLs: `https://youtu.be/VIDEO_ID`
   - YouTube Shorts: `https://youtube.com/shorts/VIDEO_ID`
   - Embedded videos: `https://youtube.com/embed/VIDEO_ID`
   - Query parameters (like `?si=...`, `&t=...`) are automatically stripped

3. **Video Length**
   - Supports videos of any length (tested up to 3+ hours)
   - Very long transcripts (>15,000 characters per video) are truncated to fit AI token limits
   - Multiple videos can be analyzed together

### Technical Requirements

1. **Dependencies**
   - `youtube-transcript` package (v1.2.1+)
   - Internet connection for YouTube API access
   - Internet connection for Hugging Face API (or fallback to local analysis)

2. **Browser Requirements**
   - Modern browser with JavaScript enabled
   - No specific browser version requirements

## API Endpoint

### Request

**Endpoint:** `POST /api/thought-leadership`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "urls": [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/shorts/s4YV_316_iM",
    "https://youtu.be/ANOTHER_VIDEO_ID"
  ]
}
```

**Validation:**
- `urls` must be an array
- Empty strings and placeholder URLs (containing `...`) are filtered out
- At least one valid YouTube URL required
- Only YouTube URLs are accepted (youtube.com or youtu.be domains)

### Response Format

#### Success Response (200 OK)

```json
{
  "executiveSummary": "A 3-4 sentence summary of key insights for government political strategy and policy development",

  "keySignals": [
    {
      "title": "Digital Service Delivery and Citizen Expectations",
      "insight": "Detailed insight about this emerging trend or signal relevant to government policy",
      "citation": "[T1] Reference from transcript 1 showing where this insight came from"
    },
    {
      "title": "Policy Communication and Public Engagement",
      "insight": "Analysis of communication strategies and public engagement approaches",
      "citation": "[T2] Reference from transcript 2"
    }
  ],

  "strategicImplications": [
    {
      "area": "Digital Government Transformation",
      "recommendation": "Actionable recommendation for policy makers and government officials",
      "rationale": "Why this recommendation matters for government strategy and citizen outcomes"
    },
    {
      "area": "Strategic Communications Framework",
      "recommendation": "Specific actions government should consider",
      "rationale": "Evidence-based reasoning for the recommendation"
    }
  ],

  "directQuotes": [
    {
      "speaker": "[T1] Speaker Name or Video 1",
      "quote": "Direct verbatim quote from the transcript",
      "timestamp": "12:34",
      "relevance": "Why this quote matters for policy development and government communications"
    }
  ],

  "citations": [
    {
      "source": "[T1] YouTube Video 1",
      "quote": "Brief excerpt from the beginning of the transcript (first 200 chars)",
      "relevance": "How this source contributes to the overall policy analysis"
    },
    {
      "source": "[T2] YouTube Video 2",
      "quote": "Brief excerpt from second transcript...",
      "relevance": "Contribution of this source material"
    }
  ]
}
```

#### Error Responses

**400 Bad Request - Invalid URLs:**
```json
{
  "error": "Invalid request: urls array required"
}
```

**400 Bad Request - No Valid URLs:**
```json
{
  "error": "Please provide at least one valid YouTube URL"
}
```

**400 Bad Request - No Captions:**
```json
{
  "error": "Failed to fetch transcripts from any of the provided URLs. Please ensure the videos have captions/subtitles available."
}
```

**500 Internal Server Error - AI Analysis Failed:**
```json
{
  "error": "AI analysis failed: [error message]. Please try again."
}
```

**500 Internal Server Error - General Error:**
```json
{
  "error": "Failed to generate brief"
}
```

## Citation Format

The analysis uses a standardized citation format to reference multiple transcripts:

- `[T1]` - Refers to the first video transcript
- `[T2]` - Refers to the second video transcript
- `[T3]` - Refers to the third video transcript
- etc.

This notation appears throughout:
- Key signals citations
- Direct quotes speaker attribution
- Source citations

## AI Analysis

### Primary: Hugging Face Inference API

The system uses the free Hugging Face Inference API with Meta's Llama 3.1 70B Instruct model:

**Model:** `meta-llama/Meta-Llama-3.1-70B-Instruct`

**API Endpoint:** `https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-70B-Instruct`

**Parameters:**
```json
{
  "max_new_tokens": 2000,
  "temperature": 0.7,
  "top_p": 0.9,
  "return_full_text": false
}
```

**Important Notes:**
- No API key required (uses public inference API)
- Subject to rate limiting on free tier
- May take 5-30 seconds depending on queue

### Fallback: Keyword-Based Analysis

If the Hugging Face API is unavailable or rate-limited, the system automatically falls back to a keyword-based analysis that:

1. Extracts meaningful sentences from transcripts
2. Identifies government-relevant keywords (policy, minister, citizen, digital, etc.)
3. Generates structured output matching the same JSON format
4. Provides relevant insights without AI model dependency

**Fallback Keywords:**
- government, policy, minister, parliament
- citizen, public, service, digital
- strategy, communication, media, political
- trust, accountability, engagement, evidence, democracy

## Use Cases

### 1. Ministerial Briefings
Convert expert interviews and thought leadership content into actionable intelligence for ministers and senior officials.

### 2. Policy Research
Analyze conference talks, expert panels, and policy discussions to inform evidence-based policy development.

### 3. Media Intelligence
Track what thought leaders and policy experts are discussing to stay ahead of emerging issues.

### 4. Cabinet Submissions
Generate evidence-based insights with proper citations for inclusion in cabinet submissions and policy papers.

### 5. Strategic Communications
Identify communication strategies and public engagement approaches used by experts and other jurisdictions.

## Best Practices

### Video Selection
1. Choose videos with clear policy relevance
2. Prioritize expert interviews, conference talks, and panel discussions
3. Verify captions are available before queuing
4. Mix complementary perspectives for richer analysis

### Multi-Video Analysis
1. Queue 2-5 related videos for comprehensive analysis
2. Group videos by theme or policy area
3. Include diverse expert perspectives
4. Consider different jurisdictions or time periods

### Output Usage
1. Review executive summary first for quick context
2. Check citations to verify AI interpretations
3. Cross-reference direct quotes with original videos
4. Validate strategic implications against government priorities
5. Adapt recommendations to local context and constraints

## Limitations

### Technical Limitations
1. **Transcript Truncation:** Very long transcripts (>15,000 chars) are truncated per video
2. **Rate Limiting:** Free Hugging Face API may be rate-limited during peak usage
3. **Caption Dependency:** Cannot process videos without captions
4. **Language:** Optimized for English-language content

### Content Limitations
1. **Context Understanding:** AI may miss nuanced political or cultural context
2. **Australian Focus:** While optimized for Australian government, may reference other jurisdictions
3. **Timestamp Accuracy:** Fallback analysis generates approximate timestamps
4. **Speaker Attribution:** Fallback mode uses generic speaker labels

### Quality Considerations
1. **AI Hallucination:** Always verify insights against source transcripts
2. **Citation Accuracy:** Check that citations accurately represent content
3. **Policy Applicability:** Assess recommendations against current government priorities
4. **Evidence Quality:** Evaluate strength of evidence supporting each insight

## Troubleshooting

### "Failed to fetch transcripts"
- **Cause:** Video doesn't have captions or is private/deleted
- **Solution:** Verify video has captions enabled, try a different video

### "AI analysis failed"
- **Cause:** Hugging Face API error or rate limit exceeded
- **Solution:** Wait a few minutes and try again; system should fall back automatically

### Empty or placeholder URLs
- **Cause:** Invalid URL format or empty input fields
- **Solution:** Ensure all URLs are complete YouTube links, remove empty fields

### "Please provide at least one valid YouTube URL"
- **Cause:** No valid YouTube URLs in the submitted array
- **Solution:** Check URL format, ensure it's from youtube.com or youtu.be

### Slow response times
- **Cause:** Long transcripts, multiple videos, or Hugging Face API queue
- **Solution:** Be patient (may take 30-60 seconds), consider analyzing fewer videos at once

## Examples

### Example 1: Single Video Analysis

**Input:**
```json
{
  "urls": ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
}
```

**Output:** Full JSON brief with executive summary, key signals, strategic implications, direct quotes, and citations for the single video.

### Example 2: Multiple Videos

**Input:**
```json
{
  "urls": [
    "https://www.youtube.com/watch?v=VIDEO1",
    "https://youtube.com/shorts/SHORT1",
    "https://youtu.be/VIDEO2"
  ]
}
```

**Output:** Comprehensive analysis across all three transcripts with `[T1]`, `[T2]`, `[T3]` citations throughout.

### Example 3: YouTube Short

**Input:**
```json
{
  "urls": ["https://youtube.com/shorts/s4YV_316_iM?si=k9a8iu4XOnhLvpQ0"]
}
```

**Output:** Standard brief format analyzing the Short video content (query parameters automatically removed).

## Security Considerations

1. **No API Keys Required:** Uses free public Hugging Face API
2. **No Data Storage:** Transcripts are processed in memory, not stored
3. **Client Privacy:** YouTube URLs are processed server-side, not logged
4. **Rate Limiting:** Public API rate limits prevent abuse

## Future Enhancements

Potential improvements for future versions:

1. **Multiple Language Support:** Extend beyond English transcripts
2. **Custom Analysis Prompts:** Allow users to specify analysis focus areas
3. **Video Comparison:** Direct comparison mode for similar videos
4. **Export Formats:** PDF, Word, Markdown export options
5. **Saved Analyses:** Store previous briefs for reference
6. **Batch Processing:** Queue large numbers of videos
7. **Scheduled Analysis:** Automatically analyze channels or playlists
8. **Advanced Filtering:** Filter by keywords, topics, or policy areas
