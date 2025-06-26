
import { RealWalkingPath, UserProfile } from '@/types/walkingPath';
import { 
  getDifficultyFromLevel, 
  getElevationFromDifficulty, 
  getFeatures, 
  getAmenities, 
  getRecommendationReason, 
  getNearbyFood 
} from './pathDataHelpers';

export const convertToWalkingPath = (path: RealWalkingPath, userProfile: UserProfile, index: number) => {
  return {
    id: path.CoursCode,
    name: path.CoursName || path.CorusDetailName || '산책로',
    distance: path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 2.5,
    duration: parseInt(path.CoursTime?.replace(/[^0-9]/g, '') || '0') || Math.round((path.CoursDetailLength || 2.5) * 15),
    difficulty: getDifficultyFromLevel(path.CoursLv) as 'easy' | 'medium' | 'hard',
    elevation: getElevationFromDifficulty(path.CoursLv),
    rating: 4.0 + Math.random() * 1.0, // 4.0-5.0 랜덤 평점
    features: getFeatures(path),
    description: path.ADIT_DC || `${path.SIGNGU_NM || '지역'}의 아름다운 산책로입니다.`,
    amenities: getAmenities(path),
    recommendationReason: getRecommendationReason(path, userProfile, index),
    nearbyFood: getNearbyFood(index),
    realPath: true,
    originalData: path
  };
};
