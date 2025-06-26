
export interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface WalkingPath {
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

export interface UseAIRecommendedPathsProps {
  userProfile: UserProfile;
  userLocation?: UserLocation;
}
