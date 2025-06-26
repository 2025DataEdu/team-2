
import React from 'react';

interface WalkingPath {
  id: string;
  name: string;
  distance: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  elevation: number;
  rating: number;
  features: string[];
  description: string;
  amenities: string[];
  recommendationReason: string;
  nearbyFood: string[];
}

interface PathBasicInfoProps {
  selectedPath: WalkingPath;
}

const PathBasicInfo = ({ selectedPath }: PathBasicInfoProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{selectedPath.name}</h3>
      <p className="text-gray-600 mb-4">{selectedPath.description}</p>
      
      {/* 추천 이유 표시 */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-400">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 선택 이유</h4>
        <p className="text-sm text-blue-700">{selectedPath.recommendationReason}</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>거리:</span>
          <span className="font-medium">{selectedPath.distance.toFixed(2)}km</span>
        </div>
        <div className="flex justify-between">
          <span>예상 시간:</span>
          <span className="font-medium">{selectedPath.duration.toFixed(0)}분</span>
        </div>
        <div className="flex justify-between">
          <span>예상 칼로리:</span>
          <span className="font-medium">{(selectedPath.distance * 50).toFixed(0)}kcal</span>
        </div>
      </div>
    </div>
  );
};

export default PathBasicInfo;
