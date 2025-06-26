
import React, { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import AppHeader from '@/components/AppHeader';
import NavigationButtons from '@/components/NavigationButtons';
import InfoCards from '@/components/InfoCards';
import SelectedPathDetails from '@/components/SelectedPathDetails';
import WalkingPathRecommendations from '@/components/WalkingPathRecommendations';
import VoiceInterface from '@/components/VoiceInterface';
import DifficultyPopover from '@/components/DifficultyPopover';
import PromptDownloader from '@/components/PromptDownloader';
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
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  
  // 중앙에서 위치 상태 관리
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

  const handleEditProfile = () => {
    setCurrentStep('loading');
  };

  if (currentStep === 'loading' || location.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen relative">
      {/* 배경 이미지 레이어 - 런닝하는 사람 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
        }}
      />
      
      {/* 오버레이 - 매우 투명하게 */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <AppHeader />
          
          <NavigationButtons 
            currentStep={currentStep}
            onResetToRecommendations={resetToRecommendations}
            onResetToProfile={resetToProfile}
          />
          
          <PromptDownloader />
          
          <InfoCards 
            userProfile={userProfile}
            onEditProfile={handleEditProfile}
            location={location}
          />

          {currentStep === 'recommendations' && userProfile && (
            <div className="space-y-8">
              <WalkingPathRecommendations 
                userProfile={userProfile} 
                onPathSelect={handlePathSelect}
                userLocation={location.error ? undefined : location}
                selectedDifficulties={selectedDifficulties}
              />
            </div>
          )}

          {currentStep === 'selected' && selectedPath && (
            <SelectedPathDetails selectedPath={selectedPath} />
          )}
          
          {/* 난이도 선택 버튼을 마이크 버튼 왼쪽으로 배치하고 겹치지 않도록 조정 */}
          <div className="fixed bottom-8 right-8 flex items-center gap-3">
            <DifficultyPopover 
              selectedDifficulties={selectedDifficulties}
              onDifficultyChange={setSelectedDifficulties}
            />
            <VoiceInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
