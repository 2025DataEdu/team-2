
import React from 'react';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface AIAnalysisCardProps {
  userProfile: UserProfile;
  userLocation?: { latitude: number; longitude: number; address: string };
}

const AIAnalysisCard = ({ userProfile, userLocation }: AIAnalysisCardProps) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
      <div className="text-sm font-body text-green-800">
        <strong className="font-accent font-semibold">🤖 AI 분석 결과:</strong> {userProfile.fitnessLevel === 'beginner' ? '초급자' : userProfile.fitnessLevel === 'intermediate' ? '중급자' : '고급자'} 수준의 
        {userProfile.preferredDistance[0].toFixed(2)}km 코스를 선호하시는 분께 
        {userProfile.walkingGoal === 'health' ? '건강 증진' : 
         userProfile.walkingGoal === 'weight' ? '체중 관리' : 
         userProfile.walkingGoal === 'stress' ? '스트레스 해소' : '여가 활동'} 목적의 
        최적 경로를 추천합니다.
        {userLocation && (
          <span> 📍 현재 위치({userLocation.address}) 기준으로 접근성을 고려했습니다.</span>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisCard;
