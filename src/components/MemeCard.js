import React from 'react';
import VoteButtons from './VoteButtons';
import './Card.css';

function MemeCard({ meme, onVote, votes = {} }) {
  if (!meme) {
    return null;
  }

  // Construct full URL - if it's already absolute, use it; otherwise prepend API base URL
  const imageUrl = meme.url.startsWith('http') 
    ? meme.url 
    : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${meme.url}`;

  const voteKey = `meme-${meme.id}`;
  const initialVote = votes[voteKey] || null;

  return (
    <div className="card">
      <h2>😄 Fun Crypto Meme</h2>
      <div className="meme-content">
        <h3>{meme.title}</h3>
        <img 
          src={imageUrl} 
          alt={meme.title}
          className="meme-image"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div className="meme-placeholder" style={{ display: 'none' }}>
          <p>🎭 {meme.title}</p>
          <p className="meme-note">(Image failed to load)</p>
        </div>
      </div>
      <VoteButtons
        targetType="meme"
        targetId={meme.id}
        onVote={onVote}
        initialVote={initialVote}
      />
    </div>
  );
}

export default MemeCard;

