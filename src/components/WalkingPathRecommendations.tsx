import React, { useEffect } from 'react';
import PathRecommendationHeader from './PathRecommendationHeader';
import AIAnalysisCard from './AIAnalysisCard';
import AIRecommendedPathGrid from './AIRecommendedPathGrid';
import { useAIRecommendedPaths } from '@/hooks/useAIRecommendedPaths';
import { usePathRecommendations } from '@/hooks/usePathRecommendations';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { getWalkingSpeed } from '@/utils/exerciseRecommendation';
import { WalkingPath, UserProfile } from '@/types/walkingPath';

interface WalkingPathRecommendationsProps {
  userProfile: UserProfile;
  onPathSelect: (path: WalkingPath) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  selectedDifficulties: string[];
  onRefreshRef?: (refreshFn: () => void) => void;
}

const WalkingPathRecommendations = ({
  userProfile,
  onPathSelect,
  userLocation,
  selectedDifficulties,
  onRefreshRef
}: WalkingPathRecommendationsProps) => {
  const {
    recommendedPaths,
    isLoading,
    generateRecommendations
  } = useAIRecommendedPaths({
    userProfile,
    userLocation
  });

  // usePathRecommendations 훅 추가
  const {
    recommendedPaths: pathRecommendations,
    isLoading: isPathLoading,
    generateRecommendations: generatePathRecommendations
  } = usePathRecommendations({
    userProfile,
    userLocation
  });

  // 건강 프로필 가져오기
  const {
    healthProfile
  } = useHealthProfile();

  // 건강정보 기반 걷기 속도 계산
  const walkingSpeed = healthProfile ? getWalkingSpeed(healthProfile) : null;

  // 통합 새로고침 함수
  const handleRefresh = () => {
    console.log('=== 수동 새로고침 함수 호출됨 ===');
    console.log('현재 위치 정보:', userLocation);
    generateRecommendations();
    generatePathRecommendations();
    console.log('=== 수동 추천 경로 새로고침 완료 ===');
  };

  // 부모 컴포넌트에 새로고침 함수 전달
  useEffect(() => {
    if (onRefreshRef) {
      console.log('새로고침 함수를 부모에 전달');
      onRefreshRef(handleRefresh);
    }
  }, [onRefreshRef]);
  
  return (
    <div className="w-full space-y-6">
      <PathRecommendationHeader onRefresh={handleRefresh} isLoading={isLoading || isPathLoading} />

      <AIAnalysisCard userProfile={userProfile} userLocation={userLocation} />

      {/* 건강정보 기반 추천 속도 표시 */}
      {walkingSpeed && (
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
          <div className="text-sm font-body text-green-800">
            <strong className="font-accent font-semibold">💓 맞춤형 운동 가이드:</strong> {walkingSpeed.intensityKr} 강도로 
            걷기 {walkingSpeed.walkingSpeed}, 조깅 {walkingSpeed.joggingSpeed} 속도를 권장합니다.
            <br />
            <strong className="font-accent font-semibold">목표 심박수:</strong> {walkingSpeed.heartRateRange.min}-{walkingSpeed.heartRateRange.max} BPM 
            ({walkingSpeed.recommendedPace})
          </div>
        </div>
      )}

      {/* AI 추천 경로 */}
      <div>
        <h3 className="text-xl font-card font-semibold mb-4 text-zinc-50">
          🤖 AI 맞춤 추천 경로 {recommendedPaths.length > 0 && `(${recommendedPaths.length}개)`}
        </h3>
        <AIRecommendedPathGrid 
          paths={recommendedPaths} 
          isLoading={isLoading} 
          onPathSelect={onPathSelect} 
          selectedDifficulties={selectedDifficulties} 
          walkingSpeed={walkingSpeed} 
        />
      </div>
    </div>
  );
};

export default WalkingPathRecommendations;
