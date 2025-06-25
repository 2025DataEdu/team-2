
import React from 'react';
import PathRecommendationHeader from './PathRecommendationHeader';
import AIAnalysisCard from './AIAnalysisCard';
import AIRecommendedPathGrid from './AIRecommendedPathGrid';
import { useAIRecommendedPaths } from '@/hooks/useAIRecommendedPaths';

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

      {/* AI 추천 경로 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-green-700">🤖 AI 맞춤 추천 경로 (실제 데이터)</h3>
        <AIRecommendedPathGrid 
          paths={recommendedPaths}
          isLoading={isLoading}
          onPathSelect={onPathSelect}
          selectedDifficulties={selectedDifficulties}
        />
      </div>
    </div>
  );
};

export default WalkingPathRecommendations;
