import React from 'react';
import { Star, Trophy, Target } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore = 100,
  showIcon = true,
  size = 'md',
  animate = false,
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getIcon = () => {
    if (percentage === 100) return <Trophy className="text-yellow-500" />;
    if (percentage >= 80) return <Star className="text-green-500" />;
    return <Target className="text-gray-500" />;
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  return (
    <div className={`flex items-center gap-2 ${animate ? 'animate-pulse' : ''}`}>
      {showIcon && (
        <span style={{ width: iconSizes[size], height: iconSizes[size] }}>
          {React.cloneElement(getIcon(), { size: iconSizes[size] })}
        </span>
      )}
      <span className={`font-bold ${sizeClasses[size]} ${getScoreColor()}`}>
        {score}
        {maxScore !== 100 && (
          <span className="text-gray-400 font-normal">/{maxScore}</span>
        )}
      </span>
    </div>
  );
};
