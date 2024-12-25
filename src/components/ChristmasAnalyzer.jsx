import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import GiftDisplay from './GiftDisplay';

const ChristmasAnalyzer = () => {
  const [handle, setHandle] = useState('');
  const [presents, setPresents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGiftReveal, setShowGiftReveal] = useState(false);

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

  const checkFollowing = async (username) => {
    try {
      const response = await fetch(`https://twitter-follow-checker.vercel.app/api/check?username=${username}&target=tobiasfib`);
      const data = await response.json();
      return data.isFollowing;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  };

  const analyzePosts = async () => {
    setLoading(true);
    try {
      const isFollowing = await checkFollowing(handle);
      
      if (!isFollowing) {
        setError("You need to follow @tobiasfib first to see how many presents you'll get! 🎅");
        setLoading(false);
        return;
      }

      // Calculate presents and show animation
      const presents = calculatePresents();
      setPresents(presents);
      setShowGiftReveal(true);
      
      // After 3 seconds, show leaderboard
      setTimeout(() => {
        setShowGiftReveal(false);
        setShowLeaderboard(true);
      }, 3000);

    } catch (error) {
      setError("Oops! Something went wrong checking your X profile 😅");
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setShowLeaderboard(false);
    setShowGiftReveal(false);
    setPresents(null);
    setHandle('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            {showLeaderboard ? "X-mas Presents Result 🎄" : "How many X-mas presents do you get? 🎁"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showLeaderboard && !showGiftReveal ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter your X handle:
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
              <div className="p-4 rounded-lg bg-green-100 border-2 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="font-medium">@{handle}</span>
                  <span className="font-bold text-red-600">
                    {presents?.toLocaleString()} 🎁
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {getMessageBasedOnScore(presents)}
                </div>
              </div>
              
              <button
                onClick={handleReset}
                className="w-full mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Check Again
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChristmasAnalyzer;