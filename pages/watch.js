import { useState } from 'react';
import AnimeVideoPlayer from '../components/AnimeVideoPlayer';

export default function WatchPage() {
  const [animeTitle, setAnimeTitle] = useState('');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setAnimeTitle('');
    setSeason('');
    setEpisode('');
  };

  return (
    <div className="container">
      <h1>Anime World Video Player</h1>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="animeTitle">Anime Title:</label>
            <input
              type="text"
              id="animeTitle"
              value={animeTitle}
              onChange={(e) => setAnimeTitle(e.target.value)}
              placeholder="e.g., naruto, one-piece"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="season">Season:</label>
            <input
              type="number"
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="episode">Episode:</label>
            <input
              type="number"
              id="episode"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              min="1"
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Watch Episode
          </button>
        </form>
      ) : (
        <div className="video-section">
          <div className="video-header">
            <h2>{animeTitle.replace(/-/g, ' ')}</h2>
            <button onClick={handleReset} className="back-btn">
              ← Back to Form
            </button>
          </div>
          
          <AnimeVideoPlayer 
            animeTitle={animeTitle}
            season={parseInt(season)}
            episode={parseInt(episode)}
          />
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }
        
        .form {
          max-width: 500px;
          margin: 0 auto;
          background: #f5f5f5;
          padding: 2rem;
          border-radius: 8px;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #444;
        }
        
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .submit-btn:hover {
          background: #0051cc;
        }
        
        .video-section {
          margin-top: 2rem;
        }
        
        .video-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .video-header h2 {
          margin: 0;
          text-transform: capitalize;
        }
        
        .back-btn {
          padding: 0.5rem 1rem;
          background: #eee;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .back-btn:hover {
          background: #ddd;
        }
        
        @media (max-width: 600px) {
          .container {
            padding: 1rem;
          }
          
          .form {
            padding: 1rem;
          }
          
          .video-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .back-btn {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}