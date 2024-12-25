import React from 'react';
import { Gift, Sparkles, Stars } from 'lucide-react';

const GiftDisplay = ({ presents }) => {
  const getDisplayStyle = () => {
    if (presents >= 800000) {
      return "bg-gradient-to-r from-purple-500 via-gold-400 to-pink-500 animate-pulse";
    }
    if (presents >= 100000) {
      return "bg-gradient-to-r from-gold-200 to-yellow-400";
    }
    if (presents >= 1000) {
      return "bg-gradient-to-r from-red-400 to-green-400";
    }
    return "bg-green-50";
  };

  const getIconDisplay = () => {
    if (presents === 0) {
      return (
        <div className="text-gray-400 animate-bounce">
          <Gift size={40} />
        </div>
      );
    }

    if (presents >= 100000) {
      return (
        <div className="flex flex-wrap justify-center gap-2 animate-bounce">
          {[...Array(Math.min(5, Math.floor(presents/100000)))].map((_, i) => (
            <Stars key={i} className="text-yellow-500" size={40} />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2">
        {[...Array(Math.min(10, presents))].map((_, i) => (
          <Gift 
            key={i} 
            className={`text-red-600 ${i % 2 === 0 ? 'animate-bounce' : 'animate-pulse'}`}
            size={32}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`text-center space-y-4 p-6 rounded-lg ${getDisplayStyle()}`}>
      <div className="flex justify-center items-center gap-2">
        {getIconDisplay()}
      </div>
      <h3 className="text-2xl font-bold">
        {presents === 0 ? "No presents this time..." : `${presents.toLocaleString()} Present${presents > 1 ? 's' : ''}!`}
      </h3>
      <div className="text-lg font-medium">
        {presents >= 100000 && (
          <div className="flex justify-center gap-1 animate-pulse">
            <Sparkles className="text-yellow-500" />
            <span>RARE FIND!</span>
            <Sparkles className="text-yellow-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftDisplay;