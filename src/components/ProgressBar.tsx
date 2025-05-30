import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  total: number;
  showText?: boolean;
  className?: string;
  progressColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  showText = true,
  className = '',
  progressColor = 'bg-primary-500',
}) => {
  const percent = Math.min(Math.max((progress / total) * 100, 0), 100);

  return (
    <div className={`${className}`}>
      {showText && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Progress</span>
          <span className="text-gray-300">
            {progress} / {total}
          </span>
        </div>
      )}
      <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${progressColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;