/**
 * Extracts video URL from AnimeWorld episode page
 * @param {string} animeTitle - The title of the anime
 * @param {number} season - The season number
 * @param {number} episode - The episode number
 * @returns {Promise<string|null>} - The video URL or null if not found
 */
async function getAnimeVideoUrl(animeTitle, season, episode) {
  try {
    // Construct the episode URL
    const formattedTitle = animeTitle.toLowerCase().replace(/\s+/g, '-');
    const episodeUrl = `https://watchanimeworld.in/episode/${formattedTitle}-${season}x${episode}/`;
    
    // Fetch the episode page
    const response = await fetch(episodeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch episode page: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Look for the video URL pattern in the HTML
    // This regex looks for the short.icu video URL pattern
    const videoUrlRegex = /https:\/\/short\.icu\/([a-zA-Z0-9]+)/g;
    const matches = [...html.matchAll(videoUrlRegex)];
    
    if (matches.length > 0) {
      // Return the first match (you might want to adjust this logic based on your needs)
      return matches[0][0];
    }
    
    // If not found in HTML, we might need to check network requests
    // This would require parsing embedded JavaScript or making additional requests
    // For a more robust solution, you might need to use Puppeteer or similar
    console.warn('Video URL not found in HTML. You may need to check network requests.');
    return null;
    
  } catch (error) {
    console.error('Error extracting video URL:', error);
    return null;
  }
}

/**
 * Alternative approach using Puppeteer for more complex scraping
 * This would be used in a Node.js environment, not directly in browser
 */
async function getAnimeVideoUrlWithPuppeteer(animeTitle, season, episode) {
  // This is a conceptual example - you would need to install puppeteer
  // npm install puppeteer
  
  /*
  const puppeteer = require('puppeteer');
  
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Construct the episode URL
    const formattedTitle = animeTitle.toLowerCase().replace(/\s+/g, '-');
    const episodeUrl = `https://watchanimeworld.in/episode/${formattedTitle}-${season}x${episode}/`;
    
    // Navigate to the episode page
    await page.goto(episodeUrl, { waitUntil: 'networkidle2' });
    
    // Wait for and capture network requests
    const videoUrl = await page.evaluate(() => {
      // This would need to be customized based on how the site loads the video
      // Look for XHR requests to zephyrflick
      return new Promise((resolve) => {
        setTimeout(() => {
          // Fallback if not found
          resolve(null);
        }, 5000);
        
        // Listen for network requests (simplified)
        // In practice, you'd need to intercept requests
      });
    });
    
    await browser.close();
    return videoUrl;
  } catch (error) {
    console.error('Error with Puppeteer:', error);
    return null;
  }
  */
}

// Example usage in a Next.js component or API route:
/*
export default function AnimePlayer({ animeTitle, season, episode }) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const url = await getAnimeVideoUrl(animeTitle, season, episode);
        setVideoUrl(url);
      } catch (error) {
        console.error('Error fetching video URL:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (animeTitle && season && episode) {
      fetchVideoUrl();
    }
  }, [animeTitle, season, episode]);
  
  if (loading) return <div>Loading video...</div>;
  
  if (!videoUrl) return <div>Video not found</div>;
  
  return (
    <div>
      <video controls width="100%">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
*/

// Example usage in a Next.js API route:
/*
export default async function handler(req, res) {
  const { animeTitle, season, episode } = req.query;
  
  if (!animeTitle || !season || !episode) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  try {
    const videoUrl = await getAnimeVideoUrl(animeTitle, parseInt(season), parseInt(episode));
    
    if (!videoUrl) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.status(200).json({ videoUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video URL' });
  }
}
*/

// Export the main function
export { getAnimeVideoUrl };