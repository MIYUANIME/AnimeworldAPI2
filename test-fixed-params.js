// Test script for the fixed anime parameters functionality
import { getAnimeVideoUrl } from './animeworld-video-extractor.js';

// Test with anime parameters
async function testWithParams() {
  try {
    // Test with Naruto (a popular anime that should be available)
    const animeTitle = "naruto";
    const season = 1;
    const episode = 1;
    
    console.log(`Testing with anime: ${animeTitle}, Season: ${season}, Episode: ${episode}`);
    
    // Get video URL with default option (Tamil)
    const videoUrl = await getAnimeVideoUrl(animeTitle, season, episode);
    console.log("Result:", videoUrl ? "Success!" : "Failed to find video");
    if (videoUrl) console.log("Video URL:", videoUrl);
    
    // Try with different language options
    console.log("\nTesting with Hindi (option 0):");
    const hindiUrl = await getAnimeVideoUrl(animeTitle, season, episode, 0);
    console.log("Hindi URL:", hindiUrl);
    
    console.log("\nTesting with English (option 3):");
    const englishUrl = await getAnimeVideoUrl(animeTitle, season, episode, 3);
    console.log("English URL:", englishUrl);
    
  } catch (error) {
    console.error("Error during test:", error);
  }
}

// Run the test
testWithParams();