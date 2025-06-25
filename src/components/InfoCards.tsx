
import React from 'react';
import { Button } from '@/components/ui/button';
import WeatherInfo from '@/components/WeatherInfo';
import LocationInfo from '@/components/LocationInfo';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface InfoCardsProps {
  userProfile: UserProfile | null;
  onEditProfile: () => void;
}

const InfoCards = ({ userProfile, onEditProfile }: InfoCardsProps) => {
  return (
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
                <span>{userProfile.preferredDistance[0].toFixed(2)}km</span>
              </div>
            </div>
            <Button 
              onClick={onEditProfile}
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
  );
};

export default InfoCards;
