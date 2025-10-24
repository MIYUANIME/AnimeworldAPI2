# AnimeWorld Video Extractor

This project provides a solution for extracting video URLs from the AnimeWorld website (watchanimeworld.in) and playing them in a Next.js application.

## Project Structure

```
.
├── animeworld-video-extractor.js    # Main video extraction function
├── components/
│   └── AnimeVideoPlayer.js          # React component for video playback
├── pages/
│   ├── api/
│   │   └── get-anime-video.js       # Next.js API route for video URL extraction
│   ├── watch.js                     # Example page with form and player
│   ├── index.js                     # Home page
│   └── _app.js                      # Next.js app component
├── styles/
│   └── globals.css                  # Global CSS styles
├── test-animeworld-extractor.js     # Standalone test script
├── package.json                     # Project dependencies and scripts
├── vercel.json                      # Vercel deployment configuration
└── .gitignore                       # Git ignore file
```

## Prerequisites

Before you can run the server, make sure you have the following installed:

1. [Node.js](https://nodejs.org/) (version 14 or higher)
2. npm (comes with Node.js) or yarn

## Installation

1. Clone or download this project to your local machine
2. Open a terminal in the project directory
3. Install the dependencies:

```bash
npm install
```

## Starting the Development Server

To start the localhost:3000 server:

```bash
npm run dev
```

This will start the Next.js development server on http://localhost:3000

## Testing the Solution

### 1. Using the Web Interface

Once the server is running:

1. Open your browser and go to http://localhost:3000
2. Click on "Watch Anime" to go to the video player page
3. Enter an anime title, season number, and episode number
4. Click "Watch Episode" to fetch and play the video

### 2. Using the API Directly

You can also test the API endpoint directly:

1. Open your browser and go to:
   ```
   http://localhost:3000/api/get-anime-video?animeTitle=naruto&season=1&episode=5
   ```
2. You should see a JSON response with the video URL:
   ```json
   {
     "success": true,
     "animeTitle": "naruto",
     "season": 1,
     "episode": 5,
     "videoUrl": "https://play.zephyrflick.top/video/7e8dae845c0913d1bff36953378df627"
   }
   ```

### 3. Using the Standalone Test Script

You can test the video extraction functionality without running the web server:

```bash
# Test with specific parameters
node test-animeworld-extractor.js "naruto" 1 5

# Or use the npm script
npm run test:example
```

## Building for Production

To build the project for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deploying to Vercel

This project is ready to be deployed to Vercel. Here's how:

### Method 1: Using Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Deploy the project:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your deployment

### Method 2: Using Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel](https://vercel.com) and sign up or log in
3. Click "New Project"
4. Import your Git repository
5. Vercel will automatically detect the Next.js framework
6. Click "Deploy" and wait for the build to complete

### Method 3: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign up or log in
2. Click "New Project"
3. Click "Import Third-Party Git Repository"
4. Enter the Git repository URL
5. Configure the project settings (Vercel will auto-detect most settings)
6. Click "Deploy"

## How It Works

1. **URL Construction**: The system constructs a URL in the format `https://watchanimeworld.in/episode/{animeTitle}-{season}x{episode}/`

2. **Page Fetching**: It fetches the episode page content using HTTP requests

3. **Video URL Extraction**: It parses the HTML to find video URLs matching the pattern `https://play.zephyrflick.top/video/{Id}`

4. **Playback**: The extracted video URL is used in an HTML5 video player

## Troubleshooting

### Common Issues

1. **"Failed to fetch episode page"**: The anime/season/episode might not exist, or the website might be down
2. **"Video not found"**: The website structure might have changed
3. **CORS errors**: These should be handled by the API route, but if you're using the function directly in browser, you might encounter them

### Testing Different Animes

Try these examples:
- Naruto, Season 1, Episode 1: `naruto`, `1`, `1`
- One Piece, Season 1, Episode 1: `one-piece`, `1`, `1`
- Attack on Titan, Season 1, Episode 1: `attack-on-titan`, `1`, `1`

## Legal Notice

This project is for educational purposes only. Make sure to respect the terms of service of the websites you interact with and comply with applicable laws in your jurisdiction.