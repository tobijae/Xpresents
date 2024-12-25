import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import GiftDisplay from './GiftDisplay';

const ChristmasAnalyzer = () => {
  const [handle, setHandle] = useState('');
  const [presents, setPresents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculatePresents = () => {
    const chance = Math.floor(Math.random() * 1000000);
    
    if (chance === 999999) { // 0.0001% chance (ultra rare)
      return Math.floor(Math.random() * (1000000 - 800000) + 800000);
    } else if (chance === 999998) { // 0.0001% chance
      return Math.floor(Math.random() * (800000 - 500000) + 500000);
    } else if (chance >= 999990) { // 0.0008% chance
      return Math.floor(Math.random() * (500000 - 100000) + 100000);
    } else if (chance >= 999900) { // 0.009% chance
      return Math.floor(Math.random() * (100000 - 10000) + 10000);
    } else if (chance >= 999000) { // 0.09% chance
      return Math.floor(Math.random() * (10000 - 1000) + 1000);
    } else if (chance >= 990000) { // 0.9% chance
      return Math.floor(Math.random() * (1000 - 100) + 100);
    } else if (chance >= 900000) { // 9% chance
      return Math.floor(Math.random() * (100 - 20) + 20);
    } else {
      const lowerChance = Math.floor(Math.random() * 100);
      if (lowerChance >= 90) return Math.floor(Math.random() * (20 - 10) + 10);
      if (lowerChance >= 70) return Math.floor(Math.random() * (10 - 5) + 5);
      if (lowerChance >= 40) return Math.floor(Math.random() * 5) + 1;
      return 0;
    }
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

      const presents = calculatePresents();
      setPresents(presents);
      setError(null);

    } catch (error) {
      setError("Oops! Something went wrong checking your X profile 😅");
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            How many 𝕏 presents do you get? 🎁
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter your x dot com handle:
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

            {presents !== null && !error && (
              <>
                <GiftDisplay presents={presents} />
                <p className="text-center text-gray-600">
                  {getMessageBasedOnScore(presents)}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChristmasAnalyzer;