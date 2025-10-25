// Test script for fetching anime video URL with parameters
import { getAnimeVideoUrl } from './animeworld-video-extractor.js';

// Anime parameters
const animeTitle = "naruto";
const season = 1;
const episode = 1;

// Run the test with anime parameters
async function testWithAnimeParams() {
  console.log(`Fetching video URL for ${animeTitle} Season ${season} Episode ${episode}...`);
  
  try {
    const videoUrl = await getAnimeVideoUrl(animeTitle, season, episode);
    
    if (videoUrl) {
      console.log('Success! Video URL:', videoUrl);
    } else {
      console.log('No video URL found for the specified anime.');
    }
  } catch (error) {
    console.error('Error fetching video URL:', error);
  }
}

// Run the test
testWithAnimeParams();