
import React, { useState } from 'react';
import RealPathCard from './RealPathCard';
import RealPathDetailModal from './RealPathDetailModal';

interface RealWalkingPath {
  CoursCode: string;
  CoursName: string | null;
  CorusDetailName: string | null;
  Address: string | null;
  CoursLength: string | null;
  CoursDetailLength: number | null;
  CoursTime: string | null;
  CoursLv: string | null;
  CoursRoute: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ADIT_DC: string | null;
  Option: string | null;
  Toilet: string | null;
  SIGNGU_NM: string | null;
  CVNTL_NM: string | null;
}

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

interface RealPathGridProps {
  paths: RealWalkingPath[];
  isLoading: boolean;
  onPathSelect: (path: WalkingPath) => void;
}

const RealPathGrid = ({ paths, isLoading, onPathSelect }: RealPathGridProps) => {
  const [selectedPath, setSelectedPath] = useState<RealWalkingPath | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (path: RealWalkingPath) => {
    setSelectedPath(path);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPath(null);
  };

  // 실제 데이터를 AI 형식으로 변환하는 함수
  const convertToAIFormat = (realPath: RealWalkingPath): WalkingPath => {
    const distance = realPath.CoursDetailLength || parseFloat(realPath.CoursLength || '0') || 2;
    const timeStr = realPath.CoursTime || '';
    const duration = timeStr.includes('분') ? parseInt(timeStr) : distance * 15;
    
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (realPath.CoursLv) {
      const level = realPath.CoursLv.toLowerCase();
      if (level.includes('어려움') || level.includes('고급')) difficulty = 'hard';
      else if (level.includes('보통') || level.includes('중급')) difficulty = 'medium';
    }

    const features = [];
    if (realPath.ADIT_DC?.includes('숲')) features.push('숲길');
    if (realPath.ADIT_DC?.includes('강') || realPath.ADIT_DC?.includes('호수')) features.push('강변');
    if (realPath.Toilet === 'Y' || realPath.Toilet === '있음') features.push('화장실');
    if (realPath.Option?.includes('야경')) features.push('야경');

    const amenities = [];
    if (realPath.Toilet === 'Y' || realPath.Toilet === '있음') amenities.push('화장실');
    if (realPath.Option?.includes('주차')) amenities.push('주차장');
    if (realPath.Option?.includes('편의점')) amenities.push('편의점');

    return {
      id: realPath.CoursCode,
      name: realPath.CoursName || realPath.CorusDetailName || '산책로',
      distance: distance,
      duration: duration,
      difficulty,
      elevation: 10, // 기본값
      rating: 4.0, // 기본값
      features,
      description: realPath.ADIT_DC || realPath.CoursRoute || '아름다운 산책로입니다.',
      amenities,
      recommendationReason: `${realPath.SIGNGU_NM || ''}에 위치한 실제 등록된 산책로입니다.`,
      nearbyFood: ['지역 맛집', '카페']
    };
  };

  const handleSelectPath = (realPath: RealWalkingPath) => {
    const convertedPath = convertToAIFormat(realPath);
    onPathSelect(convertedPath);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  if (paths.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">주변에 등록된 산책로가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <RealPathCard 
            key={path.CoursCode} 
            path={path} 
            onSelect={() => handleSelectPath(path)}
            onCardClick={() => handleCardClick(path)}
          />
        ))}
      </div>

      <RealPathDetailModal
        path={selectedPath}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={() => selectedPath && handleSelectPath(selectedPath)}
      />
    </>
  );
};

export default RealPathGrid;
