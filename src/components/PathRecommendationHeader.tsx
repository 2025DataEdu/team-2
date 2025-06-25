
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PathRecommendationHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const PathRecommendationHeader = ({ onRefresh, isLoading }: PathRecommendationHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">
        🎯 맞춤형 산책로 추천
      </h2>
      <Button 
        onClick={onRefresh} 
        disabled={isLoading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        새로고침
      </Button>
    </div>
  );
};

export default PathRecommendationHeader;
