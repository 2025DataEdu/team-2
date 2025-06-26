
import React from 'react';
import PathRecommendationHeader from './PathRecommendationHeader';
import AIAnalysisCard from './AIAnalysisCard';
import AIRecommendedPathGrid from './AIRecommendedPathGrid';
import { useAIRecommendedPaths } from '@/hooks/useAIRecommendedPaths';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { getExerciseRecommendation, getWalkingSpeed } from '@/utils/exerciseRecommendation';

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
  userLocation?: { latitude: number; longitude: number; address: string };
  selectedDifficulties: string[];
}

const WalkingPathRecommendations = ({ userProfile, onPathSelect, userLocation, selectedDifficulties }: WalkingPathRecommendationsProps) => {
  const { recommendedPaths, isLoading, generateRecommendations } = useAIRecommendedPaths({
    userProfile,
    userLocation
  });
  
  const { healthProfile } = useHealthProfile();
  const exerciseRecommendation = healthProfile ? getExerciseRecommendation(healthProfile) : null;
  const walkingSpeed = healthProfile ? getWalkingSpeed(healthProfile, exerciseRecommendation) : null;

  return (
    <div className="w-full space-y-6">
      <PathRecommendationHeader 
        onRefresh={generateRecommendations}
        isLoading={isLoading}
      />

      <AIAnalysisCard 
        userProfile={userProfile}
        userLocation={userLocation}
      />

      {/* 속도 및 심박수 정보 */}
      {walkingSpeed && (
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">🏃‍♂️ 권장 운동 속도</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">걷기 속도:</span>
              <span className="ml-2 text-blue-900">{walkingSpeed.walkingSpeed}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">조깅 속도:</span>
              <span className="ml-2 text-blue-900">{walkingSpeed.joggingSpeed}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            💓 목표 심박수: {walkingSpeed.heartRateRange.min}-{walkingSpeed.heartRateRange.max} BPM | 
            강도: <span className="font-medium">{walkingSpeed.intensityKr}</span>
          </div>
        </div>
      )}

      {/* AI 추천 경로 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-green-700">
          🤖 AI 맞춤 추천 경로 
          {exerciseRecommendation && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({exerciseRecommendation.intensityKr} 운동강도 기준)
            </span>
          )}
        </h3>
        <AIRecommendedPathGrid 
          paths={recommendedPaths}
          isLoading={isLoading}
          onPathSelect={onPathSelect}
          selectedDifficulties={selectedDifficulties}
          exerciseRecommendation={exerciseRecommendation}
          walkingSpeed={walkingSpeed}
        />
      </div>
    </div>
  );
};

export default WalkingPathRecommendations;
