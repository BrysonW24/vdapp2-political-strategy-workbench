export const isValidYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/
  return youtubeRegex.test(url)
}

export const extractYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export const validateUrlArray = (urls: string[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!Array.isArray(urls)) {
    return { valid: false, errors: ['URLs must be provided as an array'] }
  }
  
  if (urls.length === 0) {
    return { valid: false, errors: ['At least one URL is required'] }
  }
  
  urls.forEach((url, index) => {
    if (!url || url.trim() === '') {
      errors.push('URL at position ' + (index + 1) + ' is empty')
    } else if (!isValidYouTubeUrl(url)) {
      errors.push('URL at position ' + (index + 1) + ' is not a valid YouTube URL')
    }
  })
  
  return { valid: errors.length === 0, errors }
}

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const isValidCategory = (category: string): boolean => {
  const validCategories = ['all', 'central-banking', 'ai-governance', 'fintech', 'regulation', 'customer-experience']
  return validCategories.includes(category)
}
