
import React, { useState } from 'react';
import WalkingPathCard from './WalkingPathCard';
import PathDetailModal from './PathDetailModal';
import { ExerciseRecommendation, WalkingSpeed } from '@/utils/exerciseRecommendation';

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

interface AIRecommendedPathGridProps {
  paths: WalkingPath[];
  isLoading: boolean;
  onPathSelect: (path: WalkingPath) => void;
  selectedDifficulties: string[];
  exerciseRecommendation?: ExerciseRecommendation | null;
  walkingSpeed?: WalkingSpeed | null;
}

const AIRecommendedPathGrid = ({ 
  paths, 
  isLoading, 
  onPathSelect, 
  selectedDifficulties,
  exerciseRecommendation,
  walkingSpeed
}: AIRecommendedPathGridProps) => {
  const [selectedPath, setSelectedPath] = useState<WalkingPath | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (path: WalkingPath) => {
    setSelectedPath(path);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPath(null);
  };

  // 운동강도에 따른 경로 필터링
  const getFilteredPathsByIntensity = () => {
    if (!exerciseRecommendation) return paths;
    
    return paths.filter(path => {
      switch (exerciseRecommendation.intensity) {
        case 'low':
          return path.difficulty === 'easy' || (path.difficulty === 'medium' && path.elevation < 20);
        case 'moderate':
          return path.difficulty === 'easy' || path.difficulty === 'medium';
        case 'high':
          return true; // 모든 난이도 가능
        default:
          return true;
      }
    });
  };

  // 난이도 필터링 적용
  const intensityFilteredPaths = getFilteredPathsByIntensity();
  const filteredPaths = selectedDifficulties.length === 0 
    ? intensityFilteredPaths 
    : intensityFilteredPaths.filter(path => selectedDifficulties.includes(path.difficulty));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* 로딩 그리드 - 3개 한줄 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* 운동강도 기반 필터링 안내 */}
        {exerciseRecommendation && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            📋 {exerciseRecommendation.intensityKr} 운동강도에 적합한 경로만 표시합니다.
          </div>
        )}

        {/* 3개 한 줄에 표시되는 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <WalkingPathCard 
              key={path.id} 
              path={path} 
              onSelect={onPathSelect}
              onCardClick={handleCardClick}
              walkingSpeed={walkingSpeed}
            />
          ))}
        </div>

        {filteredPaths.length === 0 && selectedDifficulties.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">선택한 난이도에 맞는 경로가 없습니다.</p>
          </div>
        )}

        {filteredPaths.length === 0 && exerciseRecommendation && selectedDifficulties.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {exerciseRecommendation.intensityKr} 운동강도에 적합한 경로가 없습니다.
            </p>
          </div>
        )}

        {paths.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">추천할 수 있는 산책로가 없습니다.</p>
          </div>
        )}
      </div>

      <PathDetailModal
        path={selectedPath}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={onPathSelect}
      />
    </>
  );
};

export default AIRecommendedPathGrid;
