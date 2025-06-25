
import React, { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import AppHeader from '@/components/AppHeader';
import NavigationButtons from '@/components/NavigationButtons';
import InfoCards from '@/components/InfoCards';
import SelectedPathDetails from '@/components/SelectedPathDetails';
import WalkingPathRecommendations from '@/components/WalkingPathRecommendations';
import NearbyMarketRecommendation from '@/components/NearbyMarketRecommendation';
import VoiceInterface from '@/components/VoiceInterface';
import WalkingPathsPage from '@/components/WalkingPathsPage';
import { useLocation } from '@/hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState<'loading' | 'recommendations' | 'selected' | 'map'>('loading');
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

  const handleEditProfile = () => {
    setCurrentStep('loading');
  };

  const switchToMap = () => {
    setCurrentStep('map');
  };

  const switchToRecommendations = () => {
    setCurrentStep('recommendations');
  };

  if (currentStep === 'loading' || location.isLoading) {
    return <LoadingScreen />;
  }

  if (currentStep === 'map') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-green-700">산책로 지도</h1>
            <Button 
              onClick={switchToRecommendations}
              variant="outline"
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              추천 목록으로
            </Button>
          </div>
        </div>
        <WalkingPathsPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto py-8 px-4">
        <AppHeader />
        
        <div className="flex justify-between items-center mb-6">
          <NavigationButtons 
            currentStep={currentStep}
            onResetToRecommendations={resetToRecommendations}
            onResetToProfile={resetToProfile}
          />
          
          <Button 
            onClick={switchToMap}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Map className="h-4 w-4" />
            지도 보기
          </Button>
        </div>
        
        <InfoCards 
          userProfile={userProfile}
          onEditProfile={handleEditProfile}
        />

        {/* 근처 전통시장 추천 섹션 추가 */}
        {!location.error && (
          <div className="mb-8">
            <NearbyMarketRecommendation userLocation={location} />
          </div>
        )}

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
          <SelectedPathDetails selectedPath={selectedPath} />
        )}
        
        <VoiceInterface />
      </div>
    </div>
  );
};

export default Index;
