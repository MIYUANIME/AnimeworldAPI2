import { useState, useEffect } from 'react';

const AnimeVideoPlayer = ({ animeTitle, season, episode }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideoUrl() {
      // Reset state
      setVideoUrl(null);
      setError(null);
      
      // Validate inputs
      if (!animeTitle || !season || !episode) {
        setError('Missing anime title, season, or episode');
        return;
      }

      setLoading(true);
      
      try {
        // Call our API route
        const response = await fetch(`/api/get-anime-video?animeTitle=${encodeURIComponent(animeTitle)}&season=${season}&episode=${episode}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setVideoUrl(data.videoUrl);
        } else {
          setError(data.error || 'Failed to fetch video');
        }
      } catch (err) {
        console.error('Error fetching video URL:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if we have all required parameters
    if (animeTitle && season && episode) {
      fetchVideoUrl();
    }
  }, [animeTitle, season, episode]);

  if (loading) {
    return (
      <div className="video-player-container">
        <div className="loading">Loading video...</div>
        <style jsx>{`
          .video-player-container {
            width: 100%;
            text-align: center;
            padding: 2rem;
          }
          .loading {
            font-size: 1.2rem;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-player-container">
        <div className="error">Error: {error}</div>
        <style jsx>{`
          .video-player-container {
            width: 100%;
            text-align: center;
            padding: 2rem;
          }
          .error {
            font-size: 1.2rem;
            color: #e74c3c;
          }
        `}</style>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="video-player-container">
        <div className="no-video">No video available for this episode</div>
        <style jsx>{`
          .video-player-container {
            width: 100%;
            text-align: center;
            padding: 2rem;
          }
          .no-video {
            font-size: 1.2rem;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <video 
        controls 
        width="100%" 
        height="auto"
        style={{ maxWidth: '800px' }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="video-info">
        <h3>{animeTitle}</h3>
        <p>Season {season}, Episode {episode}</p>
      </div>
      
      <style jsx>{`
        .video-player-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
        }
        .video-info {
          margin-top: 1rem;
          text-align: center;
        }
        .video-info h3 {
          margin: 0;
          font-size: 1.5rem;
        }
        .video-info p {
          margin: 0.5rem 0 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default AnimeVideoPlayer;