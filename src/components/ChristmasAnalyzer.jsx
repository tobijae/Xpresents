import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import GiftDisplay from './GiftDisplay';

const ChristmasAnalyzer = () => {
  const [handle, setHandle] = useState('');
  const [presents, setPresents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [showGiftReveal, setShowGiftReveal] = useState(false);

  useEffect(() => {
    // If presents are set, show gift reveal first
    if (presents !== null) {
      setShowGiftReveal(true);
      // After 3 seconds, show leaderboard
      const timer = setTimeout(() => {
        setShowGiftReveal(false);
        setShowLeaderboard(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [presents]);

  const analyzePosts = async () => {
    setLoading(true);
    try {
      // Check if user follows @tobiasfib
      const response = await fetch(`https://api.twitter.com/2/users/by/username/${handle}/following?target_username=tobiasfib`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TWITTER_BEARER_TOKEN}`
        }
      });
      
      const data = await response.json();
      
      if (!data.data || data.data.following === false) {
        setError("You need to follow @tobiasfib first to see how many presents you'll get! 🎅");
        setPresents(null);
        setLoading(false);
        return;
      }

      // Calculate presents
      const newPresents = calculatePresents();
      setPresents(newPresents);
      
      // Update results
      const newResult = {
        handle,
        presents: newPresents,
        timestamp: new Date().toISOString()
      };
      setAllResults(prev => [...prev, newResult].sort((a, b) => b.presents - a.presents));
      
      setError(null);
    } catch (error) {
      setError("Oops! Something went wrong checking your X profile 😅");
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const calculatePresents = () => {
    const chance = Math.floor(Math.random() * 1000000);
    // ... rest of calculate presents function ...
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            {showLeaderboard ? "X-mas Presents Leaderboard 🎄" : "How many 𝕏-mas presents do you get? 🎁"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showLeaderboard && !showGiftReveal ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter your 𝕏 dot com handle:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace('@', ''))}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="username"
                  />
                  <button
                    onClick={analyzePosts}
                    disabled={!handle || loading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Checking...
                      </div>
                    ) : "Check"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-center p-4 bg-red-50 rounded-lg text-red-600">
                  {error}
                  <div className="mt-2">
                    <a 
                      href="https://twitter.com/tobiasfib" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Follow @tobiasfib
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : showGiftReveal ? (
            <div className="animate-fadeIn">
              <GiftDisplay presents={presents} />
              <p className="text-center text-gray-600 mt-4 animate-bounce">
                {getMessageBasedOnScore(presents)}
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {allResults.map((result, index) => (
                <div 
                  key={result.handle} 
                  className={`p-4 rounded-lg ${
                    result.handle === handle ? 'bg-green-100 border-2 border-green-500' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {index + 1}. @{result.handle}
                    </span>
                    <span className="font-bold text-red-600">
                      {result.presents.toLocaleString()} 🎁
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getMessageBasedOnScore(result.presents)}
                  </div>
                </div>
              ))}
              
              {presents === 0 && (
                <button
                  onClick={() => {
                    setShowLeaderboard(false);
                    setPresents(null);
                    setHandle('');
                  }}
                  className="w-full mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Check Your Presents
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChristmasAnalyzer;
