
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number | null;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  allowHalfStars?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  className,
  allowHalfStars = false
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const starClass = sizeClasses[size];

  const handleStarClick = (starIndex: number, isHalf: boolean = false) => {
    if (readonly || !onRatingChange) return;
    
    const newRating = allowHalfStars && isHalf ? starIndex - 0.5 : starIndex;
    onRatingChange(newRating);
  };

  const handleStarHover = (starIndex: number, isHalf: boolean = false) => {
    if (readonly) return;
    
    const newHoverRating = allowHalfStars && isHalf ? starIndex - 0.5 : starIndex;
    setHoverRating(newHoverRating);
  };

  const getStarState = (starIndex: number) => {
    const currentRating = hoverRating ?? rating ?? 0;
    
    if (currentRating >= starIndex) {
      return 'full';
    } else if (currentRating >= starIndex - 0.5) {
      return 'half';
    } else {
      return 'empty';
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const starState = getStarState(star);
        
        return (
          <div
            key={star}
            className="relative"
            onMouseLeave={() => !readonly && setHoverRating(null)}
          >
            {allowHalfStars && !readonly ? (
              // Interactive half-star support
              <div className="relative">
                {/* Left half (for half star) */}
                <div
                  className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                  onClick={() => handleStarClick(star, true)}
                  onMouseEnter={() => handleStarHover(star, true)}
                  title={`Rate ${star - 0.5} star${star - 0.5 !== 1 ? 's' : ''}`}
                />
                {/* Right half (for full star) */}
                <div
                  className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                  onClick={() => handleStarClick(star, false)}
                  onMouseEnter={() => handleStarHover(star, false)}
                  title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                />
                {/* Star visual */}
                <div className="relative">
                  <Star
                    className={cn(
                      starClass,
                      'fill-gray-200 text-gray-300'
                    )}
                  />
                  {starState === 'half' && (
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                      <Star
                        className={cn(
                          starClass,
                          'fill-yellow-400 text-yellow-400'
                        )}
                      />
                    </div>
                  )}
                  {starState === 'full' && (
                    <Star
                      className={cn(
                        starClass,
                        'fill-yellow-400 text-yellow-400 absolute top-0 left-0'
                      )}
                    />
                  )}
                </div>
              </div>
            ) : (
              // Simple full-star only (readonly or no half-star support)
              <button
                type="button"
                disabled={readonly}
                onClick={() => handleStarClick(star, false)}
                className={cn(
                  'transition-colors relative',
                  !readonly && 'hover:scale-110 cursor-pointer',
                  readonly && 'cursor-default'
                )}
                title={readonly ? undefined : `Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <Star
                  className={cn(
                    starClass,
                    'fill-gray-200 text-gray-300'
                  )}
                />
                {starState === 'half' && (
                  <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                    <Star
                      className={cn(
                        starClass,
                        'fill-yellow-400 text-yellow-400'
                      )}
                    />
                  </div>
                )}
                {starState === 'full' && (
                  <Star
                    className={cn(
                      starClass,
                      'fill-yellow-400 text-yellow-400 absolute top-0 left-0'
                    )}
                  />
                )}
              </button>
            )}
          </div>
        );
      })}
      {rating && (
        <span className="ml-2 text-sm text-gray-600">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
