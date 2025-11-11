import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard, submitFeedback } from '../services/api';
import NewsCard from '../components/NewsCard';
import PricesCard from '../components/PricesCard';
import InsightCard from '../components/InsightCard';
import MemeCard from '../components/MemeCard';
import DashboardHeader from '../components/DashboardHeader';
import DashboardFooter from '../components/DashboardFooter';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { shouldShowContent } from '../utils/contentTypeMapping';
import { getDashboardCache, setDashboardCache } from '../utils/dashboardCache';
import './Dashboard.css';

function Dashboard() {
  const dashboardCache = getDashboardCache();
  const [dashboardData, setDashboardData] = useState(dashboardCache.data);
  const [loading, setLoading] = useState(!dashboardCache.data); // Don't show loading if cached
  const [error, setError] = useState('');
  const [votes, setVotes] = useState({}); // Store votes: { "targetType-targetId": vote }
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchDashboard();
  }, [location.key]);

  const fetchDashboard = async (forceRefresh = false) => {
    // Get fresh cache reference
    const cache = getDashboardCache();
    
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && cache.data && cache.timestamp && 
        (now - cache.timestamp) < cache.CACHE_DURATION) {
      setDashboardData(cache.data);
      // Also set votes from cached data
      setVotes(cache.data.votes || {});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getDashboard();
      console.log('Dashboard data received:', response.data); // Debug log
      console.log('News data:', response.data?.news); // Debug log
      setDashboardCache(response.data);
      setDashboardData(response.data);
      // Update votes state from dashboard response
      setVotes(response.data.votes || {});
      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err); // Debug log
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (targetType, targetId, vote) => {
    try {
      await submitFeedback(targetType, targetId, vote);
      // Update local votes state after successful vote
      const voteKey = `${targetType}-${targetId}`;
      setVotes(prev => ({
        ...prev,
        [voteKey]: vote
      }));
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      throw err; // Re-throw so VoteButtons can handle the error
    }
  };

  const renderDashboardContent = () => {
    if (!dashboardData) return null;

    const preferences = dashboardData.preferences || {};
    const contentTypes = preferences.contentTypes || [];

    // Debug logging
    console.log('Content types:', contentTypes);
    console.log('Should show Market News:', shouldShowContent('Market News', { contentTypes }));
    console.log('News data:', dashboardData.news);


    // dont show the content if the content type is not in the user preferences
    // or if the user has not set any preferences
    return (
      <div className="dashboard-grid">
        {shouldShowContent('Market News', { contentTypes }) && (
          <NewsCard news={dashboardData.news} onVote={handleVote} votes={votes} />
        )}
        
        {shouldShowContent('Charts', { contentTypes }) && (
          <PricesCard prices={dashboardData.prices} onVote={handleVote} votes={votes} />
        )}
        
        {shouldShowContent('Social', { contentTypes }) && (
          <InsightCard insight={dashboardData.insight} onVote={handleVote} votes={votes} />
        )}
        
        {shouldShowContent('Fun', { contentTypes }) && (
          <MemeCard meme={dashboardData.meme} onVote={handleVote} votes={votes} />
        )}
      </div>
    );
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="container">
          <div className="error">{error}</div>
          <button onClick={fetchDashboard} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <DashboardHeader
          userName={user?.name}
          onProfileClick={() => navigate('/profile')}
          onLogout={handleLogout}
        />

        {renderDashboardContent()}

        {dashboardData && (
          <DashboardFooter
            updatedAt={dashboardData.updatedAt}
            onRefresh={() => fetchDashboard(true)}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
