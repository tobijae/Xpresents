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

  // Load previous results on mount
  useEffect(() => {
    const stored = localStorage.getItem('xPresentsResults');
    if (stored) {
      setAllResults(JSON.parse(stored));
    }
  }, []);

  const calculatePresents = () => {
    const chance = Math.floor(Math.random() * 1000000);
    
    if (chance === 999999) return Math.floor(Math.random() * (1000000 - 800000) + 800000);
    if (chance === 999998) return Math.floor(Math.random() * (800000 - 500000) + 500000);
    if (chance >= 999990) return Math.floor(Math.random() * (500000 - 100000) + 100000);
    if (chance >= 999900) return Math.floor(Math.random() * (100000 - 10000) + 10000);
    if (chance >= 999000) return Math.floor(Math.random() * (10000 - 1000) + 1000);
    if (chance >= 990000) return Math.floor(Math.random() * (1000 - 100) + 100);
    if (chance >= 900000) return Math.floor(Math.random() * (100 - 20) + 20);
    
    const lowerChance = Math.floor(Math.random() * 100);
    if (lowerChance >= 90) return Math.floor(Math.random() * (20 - 10) + 10);
    if (lowerChance >= 70) return Math.floor(Math.random() * (10 - 5) + 5);
    if (lowerChance >= 40) return Math.floor(Math.random() * 5) + 1;
    return 0;
  };

  const analyzePosts = () => {
    setLoading(true);
    
    // Check if handle already exists
    if (allResults.some(result => result.handle.toLowerCase() === handle.toLowerCase())) {
      setError("This handle has already checked their presents! 🎅");
      setLoading(false);
      return;
    }

    const presents = calculatePresents();
    const newResult = {
      handle,
      presents,
      timestamp: new Date().toISOString()
    };

    const updatedResults = [...allResults, newResult].sort((a, b) => b.presents - a.presents);
    setAllResults(updatedResults);
    localStorage.setItem('xPresentsResults', JSON.stringify(updatedResults));
    
    setPresents(presents);
    setShowLeaderboard(true);
    setLoading(false);
  };

  const getMessageBasedOnScore = (score) => {
    if (score >= 800000) return "LEGENDARY!!! 🌟 You've hit the jackpot! Santa's entire workshop is yours!";
    if (score >= 500000) return "IMPOSSIBLE! 🎇 You're Santa's favorite this millennium!";
    if (score >= 100000) return "ULTRA RARE! 🌠 You've been blessed by Santa's magic!";
    if (score >= 10000) return "EPIC! ⭐ Santa's elves worked overtime for you!";
    if (score >= 1000) return "AMAZING! 🎄 You've made Santa's VIP list!";
    if (score >= 100) return "Wonderful! 🎁 Santa really likes you!";
    if (score >= 10) return "Pretty good! 🎅 Santa's checking his list twice for you!";
    if (score >= 5) return "Not bad! 🎄 You're on Santa's good list!";
    if (score >= 1) return "Well... 🤔 At least you got something!";
    return "Oh no! 😅 Someone's been naughty this year!";
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
          {!showLeaderboard ? (
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
                    {loading ? "Checking..." : "Check"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-center p-4 bg-red-50 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {presents !== null && (
                <>
                  <GiftDisplay presents={presents} />
                  <p className="text-center text-gray-600">
                    {getMessageBasedOnScore(presents)}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
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
              
              {!presents && (
                <button
                  onClick={() => setShowLeaderboard(false)}
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
