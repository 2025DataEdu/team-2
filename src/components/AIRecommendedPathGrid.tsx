
import React, { useState } from 'react';
import WalkingPathCard from './WalkingPathCard';
import PathDetailModal from './PathDetailModal';
import DifficultyFilter from './DifficultyFilter';

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
}

const AIRecommendedPathGrid = ({ paths, isLoading, onPathSelect }: AIRecommendedPathGridProps) => {
  const [selectedPath, setSelectedPath] = useState<WalkingPath | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const handleCardClick = (path: WalkingPath) => {
    setSelectedPath(path);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPath(null);
  };

  // 난이도 필터링 적용
  const filteredPaths = selectedDifficulties.length === 0 
    ? paths 
    : paths.filter(path => selectedDifficulties.includes(path.difficulty));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* 난이도 필터 */}
        <div className="w-full max-w-sm">
          <DifficultyFilter 
            selectedDifficulties={selectedDifficulties}
            onDifficultyChange={setSelectedDifficulties}
          />
        </div>
        
        {/* 로딩 그리드 - 3개만 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {/* 난이도 필터를 상단에 배치 */}
        <div className="w-full max-w-sm">
          <DifficultyFilter 
            selectedDifficulties={selectedDifficulties}
            onDifficultyChange={setSelectedDifficulties}
          />
        </div>
        
        {/* 3개 한 줄에 표시되는 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <WalkingPathCard 
              key={path.id} 
              path={path} 
              onSelect={onPathSelect}
              onCardClick={handleCardClick}
            />
          ))}
        </div>

        {filteredPaths.length === 0 && selectedDifficulties.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">선택한 난이도에 맞는 경로가 없습니다.</p>
            <button 
              onClick={() => setSelectedDifficulties([])}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              필터 초기화
            </button>
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
