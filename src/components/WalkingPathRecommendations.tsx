
import React from 'react';
import PathRecommendationHeader from './PathRecommendationHeader';
import AIAnalysisCard from './AIAnalysisCard';
import PathGrid from './PathGrid';
import { usePathRecommendations } from '@/hooks/usePathRecommendations';

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
}

const WalkingPathRecommendations = ({ userProfile, onPathSelect, userLocation }: WalkingPathRecommendationsProps) => {
  const { recommendedPaths, isLoading, generateRecommendations } = usePathRecommendations({
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

      <PathGrid 
        paths={recommendedPaths}
        isLoading={isLoading}
        onPathSelect={onPathSelect}
      />
    </div>
  );
};

export default WalkingPathRecommendations;
