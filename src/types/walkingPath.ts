
export interface RealWalkingPath {
  CoursCode: string;
  CoursName: string | null;
  CoursDetailLength: number | null;
  CoursLength: string | null;
  CoursTime: string | null;
  CoursLv: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ADIT_DC: string | null;
  Option: string | null;
  Toilet: string | null;
  SIGNGU_NM: string | null;
  CVNTL_NM: string | null;
  Address: string | null;
  CorusDetailName: string | null;
  CoursRoute: string | null;
}

// 거리 계산이 포함된 경로 타입 추가
export interface RealWalkingPathWithDistance extends RealWalkingPath {
  calculatedDistance: number;
}

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

export interface UseAIRecommendedPathsProps {
  userProfile: UserProfile;
  userLocation?: UserLocation;
}
