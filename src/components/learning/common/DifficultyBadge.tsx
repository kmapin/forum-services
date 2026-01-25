import React from 'react';
import { DifficultyLevel } from '../../../lib/supabase';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  size?: 'sm' | 'md';
}

const levelConfig = {
  beginner: {
    label: 'Débutant',
    color: 'bg-green-100 text-green-800 border-green-200',
    dots: 1,
  },
  intermediate: {
    label: 'Intermédiaire',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dots: 2,
  },
  advanced: {
    label: 'Avancé',
    color: 'bg-red-100 text-red-800 border-red-200',
    dots: 3,
  },
};

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  level,
  size = 'md',
}) => {
  const config = levelConfig[level];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border
        ${config.color}
        ${size === 'sm' ? 'text-xs' : 'text-sm'}
      `}
    >
      <span className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={`
              w-1.5 h-1.5 rounded-full
              ${i < config.dots ? 'bg-current' : 'bg-current opacity-20'}
            `}
          />
        ))}
      </span>
      <span className="font-medium">{config.label}</span>
    </span>
  );
};
