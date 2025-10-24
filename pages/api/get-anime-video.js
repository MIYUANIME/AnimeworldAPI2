import { getAnimeVideoUrl } from '../../animeworld-video-extractor';

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const { animeTitle, season, episode } = req.query;

  // Validate required parameters
  if (!animeTitle || !season || !episode) {
    return res.status(400).json({ 
      error: 'Missing required parameters: animeTitle, season, and episode are required.' 
    });
  }

  // Validate numeric parameters
  const seasonNum = parseInt(season, 10);
  const episodeNum = parseInt(episode, 10);

  if (isNaN(seasonNum) || isNaN(episodeNum) || seasonNum <= 0 || episodeNum <= 0) {
    return res.status(400).json({ 
      error: 'Season and episode must be positive integers.' 
    });
  }

  try {
    // Extract the video URL using our function
    const videoUrl = await getAnimeVideoUrl(animeTitle, seasonNum, episodeNum);
    
    if (!videoUrl) {
      return res.status(404).json({ 
        error: 'Video not found for the specified episode.' 
      });
    }
    
    // Return the video URL
    res.status(200).json({ 
      success: true,
      animeTitle,
      season: seasonNum,
      episode: episodeNum,
      videoUrl 
    });
  } catch (error) {
    console.error('Error fetching video URL:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video URL. Please try again later.' 
    });
  }
}