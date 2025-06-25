
import React, { useState, useEffect } from 'react';
import UserProfileForm from '@/components/UserProfileForm';
import WeatherInfo from '@/components/WeatherInfo';
import LocationInfo from '@/components/LocationInfo';
import WalkingPathRecommendations from '@/components/WalkingPathRecommendations';
import VoiceInterface from '@/components/VoiceInterface';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

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
  recommendationReason: string;
  nearbyFood: string[];
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'loading' | 'recommendations' | 'selected'>('loading');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedPath, setSelectedPath] = useState<WalkingPath | null>(null);
  const location = useLocation();

  // 자동으로 건강 정보 로드 및 추천 생성
  useEffect(() => {
    if (!location.isLoading && !userProfile) {
      // 자동으로 가상 프로필 생성
      const autoProfiles = [
        {
          age: 35,
          fitnessLevel: 'intermediate',
          preferredDistance: [3],
          healthConditions: '가벼운 무릎 통증',
          walkingGoal: 'health'
        },
        {
          age: 28,
          fitnessLevel: 'beginner',
          preferredDistance: [2],
          healthConditions: '',
          walkingGoal: 'stress'
        },
        {
          age: 45,
          fitnessLevel: 'advanced',
          preferredDistance: [4.5],
          healthConditions: '고혈압',
          walkingGoal: 'weight'
        }
      ];
      
      const randomProfile = autoProfiles[Math.floor(Math.random() * autoProfiles.length)];
      setUserProfile(randomProfile);
      setCurrentStep('recommendations');
    }
  }, [location.isLoading, userProfile]);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep('recommendations');
  };

  const handlePathSelect = (path: WalkingPath) => {
    setSelectedPath(path);
    setCurrentStep('selected');
  };

  const resetToRecommendations = () => {
    setCurrentStep('recommendations');
    setSelectedPath(null);
  };

  const resetToProfile = () => {
    setCurrentStep('loading');
    setUserProfile(null);
    setSelectedPath(null);
  };

  if (currentStep === 'loading' || location.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🤖 AI가 분석 중입니다...
          </h2>
          <p className="text-gray-600">
            위치 정보와 건강 데이터를 바탕으로 맞춤형 산책로를 준비하고 있습니다.
          </p>
        </div>
      </div>
    );
  }

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

        <div className="mb-6 flex gap-2">
          {currentStep === 'selected' && (
            <Button 
              onClick={resetToRecommendations}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              다른 경로 보기
            </Button>
          )}
          <Button 
            onClick={resetToProfile}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            새로운 분석 시작
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <WeatherInfo />
          <LocationInfo />
          <div className="lg:col-span-1">
            {userProfile && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-900 mb-3">📋 현재 프로필</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>나이:</span>
                    <span>{userProfile.age}세</span>
                  </div>
                  <div className="flex justify-between">
                    <span>체력:</span>
                    <span>{userProfile.fitnessLevel === 'beginner' ? '초급' : userProfile.fitnessLevel === 'intermediate' ? '중급' : '고급'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>선호 거리:</span>
                    <span>{userProfile.preferredDistance[0]}km</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setCurrentStep('loading')}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  프로필 수정
                </Button>
              </div>
            )}
          </div>
        </div>

        {currentStep === 'recommendations' && userProfile && (
          <div className="space-y-8">
            <WalkingPathRecommendations 
              userProfile={userProfile} 
              onPathSelect={handlePathSelect}
              userLocation={location.error ? undefined : location}
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
                  
                  {/* 추천 이유 표시 */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-400">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">💡 선택 이유</h4>
                    <p className="text-sm text-blue-700">{selectedPath.recommendationReason}</p>
                  </div>
                  
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
                  <div className="flex gap-2 flex-wrap mb-4">
                    {selectedPath.amenities.map((amenity, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="font-semibold mb-2">🍰 근처 맛집 & 디저트</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedPath.nearbyFood.map((food, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {food}
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
