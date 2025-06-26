
import React from 'react';
import WeatherInfo from '@/components/WeatherInfo';
import LocationInfo from '@/components/LocationInfo';
import { useHealthProfile } from '@/hooks/useHealthProfile';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => void;
  searchByAddress: (address: string) => Promise<void>;
}

interface InfoCardsProps {
  userProfile: UserProfile | null;
  onEditProfile: () => void;
  location: LocationData;
}

const InfoCards = ({ userProfile, onEditProfile, location }: InfoCardsProps) => {
  const { healthProfile, isLoading: healthLoading, error: healthError } = useHealthProfile();

  return (
    <div className="space-y-6 mb-8">
      {/* 기존 정보 카드들 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeatherInfo />
        <LocationInfo 
          latitude={location.latitude}
          longitude={location.longitude}
          address={location.address}
          isLoading={location.isLoading}
          error={location.error}
          getCurrentLocation={location.getCurrentLocation}
          searchByAddress={location.searchByAddress}
        />
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-900 mb-3">📋 건강 프로필</h3>
            
            {healthLoading && (
              <div className="text-sm text-gray-500">건강 정보를 불러오는 중...</div>
            )}
            
            {healthError && (
              <div className="text-sm text-red-500">건강 정보를 불러올 수 없습니다.</div>
            )}
            
            {healthProfile && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>이름:</span>
                  <span>{healthProfile.이름 || '정보없음'}</span>
                </div>
                <div className="flex justify-between">
                  <span>나이:</span>
                  <span>{healthProfile.나이 ? `${healthProfile.나이}세` : '정보없음'}</span>
                </div>
                <div className="flex justify-between">
                  <span>성별:</span>
                  <span>{healthProfile.성별 || '정보없음'}</span>
                </div>
                <div className="flex justify-between">
                  <span>체중:</span>
                  <span>{healthProfile['체중(kg)'] ? `${healthProfile['체중(kg)']}kg` : '정보없음'}</span>
                </div>
                <div className="flex justify-between">
                  <span>혈압:</span>
                  <span>
                    {healthProfile['수축기 혈압'] && healthProfile['이완기 혈압'] 
                      ? `${healthProfile['수축기 혈압']}/${healthProfile['이완기 혈압']}mmHg`
                      : '정보없음'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>운동빈도(주당):</span>
                  <span>{healthProfile['운동 빈도(회/주)'] ? `${healthProfile['운동 빈도(회/주)']}회/주` : '정보없음'}</span>
                </div>
                <div className="flex justify-between">
                  <span>운동시간(주당):</span>
                  <span>{healthProfile['주당 운동 시간(시간)'] ? `${healthProfile['주당 운동 시간(시간)'].toFixed(2)}시간/주` : '정보없음'}</span>
                </div>
                {healthProfile['진단 질병'] && (
                  <div className="flex justify-between">
                    <span>진단질병:</span>
                    <span className="text-red-600">{healthProfile['진단 질병']}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
