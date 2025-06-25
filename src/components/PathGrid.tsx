
import React, { useState, useEffect } from 'react';
import WalkingPathCard from './WalkingPathCard';
import DifficultyFilter from './DifficultyFilter';
import { Button } from '@/components/ui/button';

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

interface PathGridProps {
  paths: WalkingPath[];
  isLoading: boolean;
  onPathSelect: (path: WalkingPath) => void;
}

const PathGrid = ({ paths, isLoading, onPathSelect }: PathGridProps) => {
  const [filteredPaths, setFilteredPaths] = useState<WalkingPath[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  // 난이도 필터링 적용
  useEffect(() => {
    if (selectedDifficulties.length === 0) {
      setFilteredPaths(paths);
    } else {
      setFilteredPaths(paths.filter(path => 
        selectedDifficulties.includes(path.difficulty)
      ));
    }
  }, [paths, selectedDifficulties]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <DifficultyFilter 
          selectedDifficulties={selectedDifficulties}
          onDifficultyChange={setSelectedDifficulties}
        />
      </div>
      
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPaths.map((path) => (
            <WalkingPathCard 
              key={path.id} 
              path={path} 
              onSelect={onPathSelect}
            />
          ))}
          {filteredPaths.length === 0 && selectedDifficulties.length > 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">선택한 난이도에 맞는 경로가 없습니다.</p>
              <Button 
                onClick={() => setSelectedDifficulties([])}
                variant="outline"
                className="mt-2"
              >
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathGrid;
