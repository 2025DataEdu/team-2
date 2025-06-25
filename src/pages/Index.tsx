
import React, { useState } from 'react';
import UserProfileForm from '@/components/UserProfileForm';
import WeatherInfo from '@/components/WeatherInfo';
import WalkingPathRecommendations from '@/components/WalkingPathRecommendations';
import VoiceInterface from '@/components/VoiceInterface';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

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
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'profile' | 'recommendations' | 'selected'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedPath, setSelectedPath] = useState<WalkingPath | null>(null);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep('recommendations');
  };

  const handlePathSelect = (path: WalkingPath) => {
    setSelectedPath(path);
    setCurrentStep('selected');
  };

  const resetToProfile = () => {
    setCurrentStep('profile');
    setUserProfile(null);
    setSelectedPath(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🚶‍♀️ AI 맞춤형 산책길 추천 서비스
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            개인의 건강 상태와 실시간 환경 정보를 분석하여 
            가장 적합한 산책로를 추천해드리는 스마트 서비스입니다.
          </p>
        </div>

        {currentStep !== 'profile' && (
          <div className="mb-6">
            <Button 
              onClick={resetToProfile}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              처음부터 다시하기
            </Button>
          </div>
        )}

        {currentStep === 'profile' && (
          <div className="space-y-8">
            <WeatherInfo />
            <UserProfileForm onProfileSubmit={handleProfileSubmit} />
          </div>
        )}

        {currentStep === 'recommendations' && userProfile && (
          <div className="space-y-8">
            <WeatherInfo />
            <WalkingPathRecommendations 
              userProfile={userProfile} 
              onPathSelect={handlePathSelect}
            />
          </div>
        )}

        {currentStep === 'selected' && selectedPath && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                🎉 선택된 산책로
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedPath.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedPath.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>거리:</span>
                      <span className="font-medium">{selectedPath.distance}km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예상 시간:</span>
                      <span className="font-medium">{selectedPath.duration}분</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예상 칼로리:</span>
                      <span className="font-medium">{Math.round(selectedPath.distance * 50)}kcal</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">주변 편의시설</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedPath.amenities.map((amenity, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 text-center">
                  🌟 즐거운 산책 되세요! 안전한 산책을 위해 충분한 수분 섭취를 잊지 마세요.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <VoiceInterface />
      </div>
    </div>
  );
};

export default Index;
