
import React from 'react';
import { MapPin } from 'lucide-react';
import MiniMap from './MiniMap';

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
  nearbyMarkets?: string[]; // 전통시장 정보 추가
  latitude?: number; // 위치 정보 추가
  longitude?: number;
}

interface SelectedPathDetailsProps {
  selectedPath: WalkingPath;
}

const SelectedPathDetails = ({ selectedPath }: SelectedPathDetailsProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          🎉 선택된 산책로
        </h2>
        
        {/* 지도 섹션 추가 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">📍 위치</h3>
          <MiniMap 
            latitude={selectedPath.latitude} 
            longitude={selectedPath.longitude} 
            pathName={selectedPath.name}
            className="w-full h-48"
          />
        </div>

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
                <span className="font-medium">{selectedPath.distance.toFixed(2)}km</span>
              </div>
              <div className="flex justify-between">
                <span>예상 시간:</span>
                <span className="font-medium">{selectedPath.duration.toFixed(0)}분</span>
              </div>
              <div className="flex justify-between">
                <span>예상 칼로리:</span>
                <span className="font-medium">{(selectedPath.distance * 50).toFixed(0)}kcal</span>
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

            {/* 근처 전통시장 정보 추가 */}
            {selectedPath.nearbyMarkets && selectedPath.nearbyMarkets.length > 0 && (
              <>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  🏪 근처 전통시장
                </h4>
                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedPath.nearbyMarkets.map((market, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                      {market}
                    </span>
                  ))}
                </div>
              </>
            )}
            
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
  );
};

export default SelectedPathDetails;
