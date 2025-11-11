import React, { useState, useEffect } from 'react';
import './VoteButtons.css';

function VoteButtons({ targetType, targetId, onVote, initialVote = null }) {
  const [activeVote, setActiveVote] = useState(initialVote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update activeVote when initialVote changes (e.g., after page reload)
  useEffect(() => {
    setActiveVote(initialVote);
  }, [initialVote]);

  const handleVote = async (vote) => {
    // Don't do anything if clicking the same active button
    if (activeVote === vote) {
      return;
    }

    // Set active vote immediately for instant feedback
    setActiveVote(vote);
    setIsSubmitting(true);

    try {
      if (onVote) {
        await onVote(targetType, targetId, vote);
      }
    } catch (err) {
      // Revert on error
      setActiveVote(initialVote);
      console.error('Failed to submit vote:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vote-buttons">
      <button
        onClick={() => handleVote(1)}
        className={`vote-btn up ${activeVote === 1 ? 'active' : ''} ${isSubmitting ? 'submitting' : ''}`}
        title="Thumbs up"
        disabled={isSubmitting}
      >
        <span className="vote-icon">👍</span>
        {activeVote === 1 && <span className="vote-check">✓</span>}
      </button>
      <button
        onClick={() => handleVote(-1)}
        className={`vote-btn down ${activeVote === -1 ? 'active' : ''} ${isSubmitting ? 'submitting' : ''}`}
        title="Thumbs down"
        disabled={isSubmitting}
      >
        <span className="vote-icon">👎</span>
        {activeVote === -1 && <span className="vote-check">✓</span>}
      </button>
    </div>
  );
}

export default VoteButtons;

