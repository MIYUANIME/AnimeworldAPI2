// Test script for extracting option 1 URL from data-src attribute
import { extractOption1Url } from './animeworld-video-extractor.js';

// Test with the example URL provided
const testUrl = "https://watchanimeworld.in/api/player1.php?data=W3sibGFuZ3VhZ2UiOiJIaW5kaSIsImxpbmsiOiJodHRwczpcL1wvc2hvcnQuaWN1XC9IX1p4YU9DeFAifSx7Imxhbmd1YWdlIjoiVGFtaWwiLCJsaW5rIjoiaHR0cHM6XC9cL3Nob3J0LmljdVwvVnBpZk5VVDVVIn0seyJsYW5ndWFnZSI6Ik1hbGF5YWxhbSIsImxpbmsiOiJodHRwczpcL1wvc2hvcnQuaWN1XC9OM3lGamFwVVMifSx7Imxhbmd1YWdlIjoiRW5nbGlzaCIsImxpbmsiOiJodHRwczpcL1wvc2hvcnQuaWN1XC9uOHlRR3FCZDcifSx7Imxhbmd1YWdlIjoiSmFwYW5lc2UiLCJsaW5rIjoiaHR0cHM6XC9cL3Nob3J0LmljdVwvcjhOcE5vTDU5In1d";

// Run the test
const option1Url = extractOption1Url(testUrl);
console.log('Option 1 URL (Tamil):', option1Url);

// Test with HTML extraction
function testHtmlExtraction() {
  const testHtml = `<div id="options-1" class="video aa-tb hdd"> 
    <iframe data-src="https://watchanimeworld.in/api/player1.php?data=W3sibGFuZ3VhZ2UiOiJIaW5kaSIsImxpbmsiOiJodHRwczpcL1wvc2hvcnQuaWN1XC9IX1p4YU9DeFAifSx7Imxhbmd1YWdlIjoiVGFtaWwiLCJsaW5rIjoiaHR0cHM6XC9cL3Nob3J0LmljdVwvVnBpZk5VVDVVIn0seyJsYW5ndWFnZSI6Ik1hbGF5YWxhbSIsImxpbmsiOiJodHRwczpcL1wvc2hvcnQuaWN1XC9OM3lGamFwVVMifSx7Imxhbmd1YWdlIjoiRW5nbGlzaCIsImxpbmsiOiJodHRwczpcL1wvc2hvcnQuaWN1XC9uOHlRR3FCZDcifSx7Imxhbmd1YWdlIjoiSmFwYW5lc2UiLCJsaW5rIjoiaHR0cHM6XC9cL3Nob3J0LmljdVwvcjhOcE5vTDU5In1d" frameborder="0" scrolling="no" allow="autoplay; encrypted-media" allowfullscreen=""></iframe> 
  </div>`;
  
  // Extract the data-src URL from the HTML
  const optionsRegex = /<div id="options-1"[^>]*>.*?<iframe[^>]*data-src="([^"]+)"[^>]*>.*?<\/div>/is;
  const optionsMatch = testHtml.match(optionsRegex);
  
  if (optionsMatch && optionsMatch[1]) {
    const apiUrl = optionsMatch[1].trim();
    const extractedUrl = extractOption1Url(apiUrl);
    console.log('Extracted from HTML - Option 1 URL (Tamil):', extractedUrl);
  } else {
    console.error('Failed to extract data-src URL from HTML');
  }
}

testHtmlExtraction();