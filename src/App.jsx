import { useState } from 'react';
import aviationTopics from './aviationTopics';
import './App.css';

const LOCAL_UNSPLASH_ACCESS_KEY = typeof window !== 'undefined' ? window.__UNSPLASH_ACCESS_KEY__ : '';
const UNSPLASH_ACCESS_KEY = LOCAL_UNSPLASH_ACCESS_KEY || import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
const MAX_TAGS = 4;
const MAX_HISTORY_ITEMS = 4;

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [currentTags, setCurrentTags] = useState([]);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomImage = async (currentBanList) => {
    const bans = currentBanList ?? banList;
    const topic = aviationTopics[Math.floor(Math.random() * aviationTopics.length)];

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(topic)}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.errors?.[0] || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const allTags = (data.tags || []).map((t) => t.title);
      const fetchedTags = allTags.slice(-MAX_TAGS);

      if (fetchedTags.some((tag) => bans.includes(tag))) {
        return fetchRandomImage(bans);
      }

      setCurrentImage({ url: data.urls.regular, description: data.alt_description || data.description || topic });
      setCurrentTags(fetchedTags);
      setHistory((prev) =>
        [{ url: data.urls.thumb, description: data.alt_description || data.description || topic }, ...prev].slice(0, MAX_HISTORY_ITEMS)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscover = () => {
    setLoading(true);
    setError(null);
    fetchRandomImage();
  };

  const handleBanTag = (tag) => {
    setBanList((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  };

  const handleUnbanTag = (tag) => {
    setBanList((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="app-container">
      {/* Left Column: History */}
      <aside className="column history-column">
        <h2>🕑 History</h2>
        {history.length === 0 ? (
          <p className="empty-hint">Your recently viewed images will appear here.</p>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="history-item">
              <img src={item.url} alt={item.description} />
              <p>{item.description}</p>
            </div>
          ))
        )}
      </aside>

      {/* Center Column: Main Stage */}
      <main className="column center-column">
        <header className="app-header">
          <h1>✈️ Windows on the World</h1>
          <p className="subtitle">Discover stunning aviation photography</p>
        </header>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="main-stage">
          {currentImage ? (
            <img
              className="main-image"
              src={currentImage.url}
              alt={currentImage.description}
            />
          ) : (
            <div className="placeholder">
              <span>Click <strong>Discover!</strong> to load your first image</span>
            </div>
          )}
        </div>

        {currentTags.length > 0 && (
          <div className="tags-grid">
            {currentTags.map((tag) => (
              <button
                key={tag}
                className={`tag-btn${banList.includes(tag) ? ' banned' : ''}`}
                onClick={() => handleBanTag(tag)}
                title="Click to ban this tag"
              >
                🏷️ {tag}
              </button>
            ))}
          </div>
        )}

        <button
          className="discover-btn"
          onClick={handleDiscover}
          disabled={loading}
        >
          {loading ? '⏳ Loading...' : '🔀 Discover!'}
        </button>
      </main>

      {/* Right Column: Ban List */}
      <aside className="column banlist-column">
        <h2>🚫 Ban List</h2>
        {banList.length === 0 ? (
          <p className="empty-hint">Click a tag below the image to ban it.</p>
        ) : (
          banList.map((tag) => (
            <button
              key={tag}
              className="ban-item"
              onClick={() => handleUnbanTag(tag)}
              title="Click to unban"
            >
              ✕ {tag}
            </button>
          ))
        )}
      </aside>
    </div>
  );
}

export default App;
