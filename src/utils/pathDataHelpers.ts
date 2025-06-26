
import { RealWalkingPath, UserProfile } from '@/types/walkingPath';

export const getDifficultyFromLevel = (level: string | null): string => {
  if (!level) return 'easy';
  const levelLower = level.toLowerCase();
  if (levelLower.includes('쉬움') || levelLower.includes('초급')) return 'easy';
  if (levelLower.includes('보통') || levelLower.includes('중급')) return 'medium';
  if (levelLower.includes('어려움') || levelLower.includes('고급')) return 'hard';
  return 'easy';
};

export const getElevationFromDifficulty = (level: string | null): number => {
  if (!level) return 0;
  const levelLower = level.toLowerCase();
  if (levelLower.includes('어려움') || levelLower.includes('고급')) return Math.floor(Math.random() * 50) + 30;
  if (levelLower.includes('보통') || levelLower.includes('중급')) return Math.floor(Math.random() * 30) + 10;
  return Math.floor(Math.random() * 15);
};

export const getFeatures = (path: RealWalkingPath): string[] => {
  const features = [];
  if (path.Option?.includes('화장실') || path.Toilet === 'Y') features.push('화장실');
  if (path.SIGNGU_NM) features.push('도시');
  if (path.CoursRoute?.includes('강') || path.CoursName?.includes('강')) features.push('강변');
  if (path.CoursRoute?.includes('산') || path.CoursName?.includes('산')) features.push('산길');
  if (path.CoursRoute?.includes('공원') || path.CoursName?.includes('공원')) features.push('공원');
  
  // 기본 특징 추가
  if (features.length < 2) {
    features.push('산책로', '자연');
  }
  
  return features.slice(0, 4);
};

export const getAmenities = (path: RealWalkingPath): string[] => {
  const amenities = [];
  if (path.Toilet === 'Y') amenities.push('화장실');
  if (path.Option?.includes('주차')) amenities.push('주차장');
  if (path.CVNTL_NM) amenities.push('편의시설');
  
  // 기본 편의시설 추가
  amenities.push('벤치', '안내판');
  
  return amenities.slice(0, 4);
};

export const getRecommendationReason = (path: RealWalkingPath, userProfile: UserProfile, index: number): string => {
  const reasons = [];
  
  if (userProfile.fitnessLevel === 'beginner') {
    reasons.push('초보자에게 적합한');
  } else if (userProfile.fitnessLevel === 'advanced') {
    reasons.push('숙련자에게 도전적인');
  } else {
    reasons.push('중급자에게 적당한');
  }
  
  if (userProfile.walkingGoal === 'health') {
    reasons.push('건강 증진에 효과적인');
  } else if (userProfile.walkingGoal === 'stress') {
    reasons.push('스트레스 해소에 좋은');
  } else if (userProfile.walkingGoal === 'weight') {
    reasons.push('체중 관리에 도움되는');
  } else {
    reasons.push('여가 활동에 적합한');
  }
  
  reasons.push(`${path.SIGNGU_NM || '지역'} 소재의 실제 등록된 산책로입니다.`);
  
  return reasons.join(' ');
};

export const getNearbyFood = (index: number): string[] => {
  const foodOptions = [
    ['카페 드롭탑', '한식당 미락', '치킨집 굽네'],
    ['이탈리안 파스타', '돈까스 전문점', '분식 마당'],
    ['커피빈', '순두부찌개', '족발보쌈']
  ];
  return foodOptions[index % foodOptions.length];
};
