// Test script for the updated Hindi-only API endpoint
import { getAnimeVideoUrl } from './animeworld-video-extractor.js';

async function testHindiAPI() {
  console.log('Testing Hindi API with anime: naruto, Season: 1, Episode: 1');
  
  try {
    // Test with Hindi option (0)
    const hindiUrl = await getAnimeVideoUrl('naruto', 1, 1, 0);
    
    console.log('API Response:');
    console.log({
      success: true,
      data: {
        anime: 'naruto',
        season: 1,
        episode: 1,
        language: 'Hindi',
        videoUrl: hindiUrl
      }
    });
    
    if (hindiUrl) {
      console.log('\nTest Result: SUCCESS - Hindi URL retrieved successfully');
    } else {
      console.log('\nTest Result: FAILED - Could not retrieve Hindi URL');
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the test
testHindiAPI();