/**
 * Test script for AnimeWorld video URL extractor
 * This script can be run directly with Node.js to test the functionality
 */

// Import required modules
const https = require('https');
const http = require('http');
const url = require('url');

/**
 * Extracts video URL from AnimeWorld episode page
 * @param {string} animeTitle - The title of the anime
 * @param {number} season - The season number
 * @param {number} episode - The episode number
 * @returns {Promise<string|null>} - The video URL or null if not found
 */
async function getAnimeVideoUrl(animeTitle, season, episode) {
  return new Promise((resolve, reject) => {
    try {
      // Construct the episode URL
      const formattedTitle = animeTitle.toLowerCase().replace(/\s+/g, '-');
      const episodeUrl = `https://watchanimeworld.in/episode/${formattedTitle}-${season}x${episode}/`;
      
      console.log(`Fetching episode page: ${episodeUrl}`);
      
      // Parse the URL to determine which protocol to use
      const parsedUrl = url.parse(episodeUrl);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      // Fetch the episode page
      const request = protocol.get(episodeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }, (response) => {
        let data = '';
        
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          console.log(`Following redirect to: ${response.headers.location}`);
          resolve(getAnimeVideoUrl(animeTitle, season, episode));
          return;
        }
        
        // Handle HTTP errors
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch episode page: ${response.statusCode} ${response.statusMessage}`));
          return;
        }
        
        // Collect the data
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        // Process the complete response
        response.on('end', () => {
          try {
            // Look for the video URL pattern in the HTML
            // This regex looks for the short.icu video URL pattern
            const videoUrlRegex = /https:\/\/short\.icu\/([a-zA-Z0-9]+)/g;
            const matches = [...data.matchAll(videoUrlRegex)];
            
            if (matches.length > 0) {
              // Return the first match (you might want to adjust this logic based on your needs)
              console.log(`Found ${matches.length} video URL(s)`);
              resolve(matches[0][0]);
            } else {
              // Try a more general pattern for video URLs
              const generalVideoRegex = /https?:\/\/[^\s]*\.(mp4|webm|m3u8)/gi;
              const generalMatches = [...data.matchAll(generalVideoRegex)];
              
              if (generalMatches.length > 0) {
                console.log(`Found ${generalMatches.length} general video URL(s)`);
                resolve(generalMatches[0][0]);
              } else {
                console.warn('Video URL not found in HTML. You may need to check network requests.');
                resolve(null);
              }
            }
          } catch (error) {
            reject(error);
          }
        });
      });
      
      // Handle request errors
      request.on('error', (error) => {
        reject(new Error(`Request error: ${error.message}`));
      });
      
      // Set timeout
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Main test function
 */
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node test-animeworld-extractor.js <animeTitle> <season> <episode>');
    console.log('Example: node test-animeworld-extractor.js "naruto" 1 5');
    return;
  }
  
  const animeTitle = args[0];
  const season = parseInt(args[1], 10);
  const episode = parseInt(args[2], 10);
  
  if (isNaN(season) || isNaN(episode)) {
    console.error('Season and episode must be valid numbers');
    return;
  }
  
  console.log(`Testing AnimeWorld video extractor for: ${animeTitle} Season ${season} Episode ${episode}`);
  console.log('---------------------------------------------');
  
  try {
    const startTime = Date.now();
    const videoUrl = await getAnimeVideoUrl(animeTitle, season, episode);
    const endTime = Date.now();
    
    console.log('---------------------------------------------');
    if (videoUrl) {
      console.log(`SUCCESS! Video URL found in ${endTime - startTime}ms:`);
      console.log(videoUrl);
    } else {
      console.log('No video URL found for the specified episode');
    }
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}

// Export the function for use in other modules
module.exports = { getAnimeVideoUrl };
