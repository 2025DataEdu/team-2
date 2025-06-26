
import React, { useEffect } from 'react';
import PathRecommendationHeader from './PathRecommendationHeader';
import AIAnalysisCard from './AIAnalysisCard';
import AIRecommendedPathGrid from './AIRecommendedPathGrid';
import { useAIRecommendedPaths } from '@/hooks/useAIRecommendedPaths';
import { usePathRecommendations } from '@/hooks/usePathRecommendations';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { getWalkingSpeed } from '@/utils/exerciseRecommendation';

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

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

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
    console.log('=== handleRefresh 함수 호출됨 ===');
    console.log('현재 위치 정보:', userLocation);
    generateRecommendations();
    generatePathRecommendations();
    console.log('=== 추천 경로 새로고침 완료 ===');
  };

  // 부모 컴포넌트에 새로고침 함수 전달
  useEffect(() => {
    if (onRefreshRef) {
      console.log('새로고침 함수를 부모에 전달');
      onRefreshRef(handleRefresh);
    }
  }, [onRefreshRef]);

  // 위치 변경 감지 및 강제 새로고침 - 더 정확한 감지
  useEffect(() => {
    console.log('=== WalkingPathRecommendations: 위치 변경 감지 useEffect ===');
    console.log('userLocation 변경됨:', userLocation);
    console.log('timestamp:', new Date().toISOString());
    
    // 위치 정보가 있고 유효할 때만 새로고침
    if (userLocation && 
        userLocation.latitude && 
        userLocation.longitude && 
        userLocation.address) {
      console.log('=== 유효한 위치 정보 감지, 강제 새로고침 실행 ===');
      handleRefresh();
    }
  }, [
    userLocation?.latitude, 
    userLocation?.longitude, 
    userLocation?.address,
    userProfile // userProfile 변경시에도 새로고침
  ]);
  
  return (
    <div className="w-full space-y-6">
      <PathRecommendationHeader onRefresh={handleRefresh} isLoading={isLoading || isPathLoading} />

      <AIAnalysisCard userProfile={userProfile} userLocation={userLocation} />

      {/* 위치 정보 디버깅 표시 */}
      {userLocation && (
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
          <div className="text-sm font-body text-blue-800">
            <strong className="font-accent font-semibold">📍 현재 분석 위치:</strong> {userLocation.address}
            <br />
            <strong className="font-accent font-semibold">좌표:</strong> {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            <br />
            <span className="text-xs text-blue-600">위치가 변경되면 추천 경로가 자동으로 업데이트됩니다.</span>
          </div>
        </div>
      )}

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
