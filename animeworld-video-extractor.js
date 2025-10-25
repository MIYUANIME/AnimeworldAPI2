/**
 * Extracts video URL from AnimeWorld episode page
 * @param {string} animeTitle - The title of the anime
 * @param {number} season - The season number
 * @param {number} episode - The episode number
 * @param {number} option - The language option (0=Hindi, 1=Tamil, 2=Malayalam, 3=English, 4=Japanese)
 * @returns {Promise<string|null>} - The video URL or null if not found
 */
async function getAnimeVideoUrl(animeTitle, season, episode, option = 1) {
  try {
    if (!animeTitle || !season || !episode) {
      throw new Error('Missing required parameters: animeTitle, season, and episode are required');
    }
    
    // Construct the episode URL
    const formattedTitle = animeTitle.toLowerCase().replace(/\s+/g, '-');
    const episodeUrl = `https://watchanimeworld.in/episode/${formattedTitle}-${season}x${episode}/`;
    
    console.log(`Fetching episode: ${animeTitle} Season ${season} Episode ${episode}`);
    console.log(`URL: ${episodeUrl}`);
    
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
    
    // Look for the iframe with data-src attribute in options-1 div
    const optionsRegex = /<div id="options-1"[^>]*>.*?<iframe[^>]*data-src="([^"]+)"[^>]*>.*?<\/div>/is;
    const optionsMatch = html.match(optionsRegex);
    
    if (optionsMatch && optionsMatch[1]) {
      // Get the API URL from the data-src attribute
      const apiUrl = optionsMatch[1].trim();
      
      // Extract the URL for the specified option
      return extractOptionUrl(apiUrl, option);
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
 * Extracts the URL for the specified language option from the data parameter in the API URL
 * @param {string} apiUrl - The API URL with the data parameter
 * @param {number} option - The language option (0=Hindi, 1=Tamil, 2=Malayalam, 3=English, 4=Japanese)
 * @returns {string|null} - The URL for the specified option or null if not found
 */
function extractOptionUrl(apiUrl, option = 1) {
  try {
    // Extract the data parameter from the API URL
    const dataParam = new URL(apiUrl).searchParams.get('data');
    
    if (!dataParam) {
      return null;
    }
    
    // Decode the data parameter (it's base64 encoded JSON)
    // First decode from base64 to string
    const decodedData = atob(dataParam);
    
    // Parse the JSON data
    const jsonData = JSON.parse(decodedData);
    
    // Get the URL for the specified option
    if (jsonData && jsonData.length > option && jsonData[option] && jsonData[option].link) {
      console.log(`Found ${jsonData[option].language} language option`);
      return jsonData[option].link;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting URL for option:', error);
    return null;
  }
}

/**
 * Extracts the option 1 URL from the data parameter in the API URL (legacy function)
 * @param {string} apiUrl - The API URL with the data parameter
 * @returns {string|null} - The option 1 URL or null if not found
 */
function extractOption1Url(apiUrl) {
  return extractOptionUrl(apiUrl, 1);
}

/**
 * Directly extracts the option 1 URL from a data string without requiring anime parameters
 * @param {string} dataString - The data string from the iframe's data-src attribute
 * @returns {string|null} - The option 1 URL or null if not found
 */
function getOption1UrlFromData(dataString) {
  try {
    // Create a mock URL to use the extractOption1Url function
    const mockUrl = `https://watchanimeworld.in/api/player1.php?data=${dataString}`;
    return extractOption1Url(mockUrl);
  } catch (error) {
    console.error('Error extracting option 1 URL from data:', error);
    return null;
  }
}

// Export functions for testing and usage
export {
  getAnimeVideoUrl,
  extractOptionUrl,
  extractOption1Url,
  getOption1UrlFromData
};

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

// Exports are handled at line 85