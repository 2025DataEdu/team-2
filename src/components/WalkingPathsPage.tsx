
import React, { useState } from 'react';
import { useWalkingPaths } from '@/hooks/useWalkingPaths';
import { useLocation } from '@/hooks/useLocation';
import WalkingPathMap from './WalkingPathMap';
import WalkingPathDetailModal from './WalkingPathDetailModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Route, Loader2 } from 'lucide-react';
import { WalkingPathData, TraditionalMarketData } from '@/hooks/useWalkingPaths';

const WalkingPathsPage = () => {
  const location = useLocation();
  const { walkingPaths, traditionalMarkets, isLoading, error } = useWalkingPaths(
    location.error ? undefined : location
  );
  const [selectedPath, setSelectedPath] = useState<WalkingPathData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nearbyMarkets, setNearbyMarkets] = useState<TraditionalMarketData[]>([]);

  const findNearbyMarkets = (pathLat: number, pathLng: number, maxDistance = 5) => {
    return traditionalMarkets
      .filter(market => market.경위도X좌표 && market.경위도Y좌표)
      .map(market => {
        const distance = getDistance(
          pathLat, pathLng,
          market.경위도Y좌표!, market.경위도X좌표!
        );
        return { market, distance };
      })
      .filter(item => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map(item => item.market);
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handlePathClick = (path: WalkingPathData) => {
    const markets = path.Latitude && path.Longitude 
      ? findNearbyMarkets(path.Latitude, path.Longitude)
      : [];
    
    setSelectedPath(path);
    setNearbyMarkets(markets);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">산책로 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">데이터를 불러오는 중 오류가 발생했습니다:</p>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2 flex items-center gap-2">
            <Route className="h-8 w-8" />
            내 주변 산책로
          </h1>
          <p className="text-gray-600">
            지도에서 산책로를 클릭하여 상세 정보를 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  산책로 지도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WalkingPathMap
                  walkingPaths={walkingPaths}
                  traditionalMarkets={traditionalMarkets}
                  userLocation={location.error ? undefined : location}
                  onPathClick={handlePathClick}
                  className="w-full h-96"
                />
              </CardContent>
            </Card>
          </div>

          {/* 통계 정보 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">총 산책로</span>
                    <span className="font-bold text-green-600">{walkingPaths.length}개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">전통시장</span>
                    <span className="font-bold text-orange-600">{traditionalMarkets.length}개</span>
                  </div>
                  {location.address && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">현재 위치</p>
                      <p className="font-medium">{location.address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">사용법</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex-shrink-0 mt-0.5"></div>
                    <p>녹색 마커: 산책로 위치</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 mt-0.5"></div>
                    <p>파란색 마커: 현재 위치</p>
                  </div>
                  <p className="text-gray-600">
                    산책로 마커를 클릭하면 상세 정보와 주변 전통시장 정보를 확인할 수 있습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <WalkingPathDetailModal
          path={selectedPath}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          nearbyMarkets={nearbyMarkets}
        />
      </div>
    </div>
  );
};

export default WalkingPathsPage;
