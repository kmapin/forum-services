import React from 'react';
import { LearningBadge } from '../../../lib/supabase';

interface BadgeProps {
  badge: LearningBadge;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-4xl',
};

export const Badge: React.FC<BadgeProps> = ({
  badge,
  earned = false,
  size = 'md',
  showDetails = false,
}) => {
  return (
    <div className={`flex flex-col items-center ${showDetails ? 'space-y-2' : ''}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center
          ${earned 
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-200' 
            : 'bg-gray-200 grayscale opacity-50'
          }
          transition-all duration-300
          ${earned ? 'hover:scale-110 cursor-pointer' : ''}
        `}
        title={badge.description}
      >
        <span className={earned ? '' : 'opacity-50'}>{badge.icon}</span>
      </div>
      {showDetails && (
        <div className="text-center">
          <p className={`text-sm font-medium ${earned ? 'text-gray-900' : 'text-gray-400'}`}>
            {badge.name}
          </p>
          {earned && (
            <p className="text-xs text-teal-600">+{badge.points} pts</p>
          )}
        </div>
      )}
    </div>
  );
};
