
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TraditionalMarket {
  코드: string;
  시장명: string;
  시장유형: string;
  도로명주소: string;
  지번주소: string;
  시도: string;
  시군구: string;
  경위도X좌표: number;
  경위도Y좌표: number;
  시장전용고객주차장_보유여부: string;
  화재감지기보유여부: string;
  스프링쿨러보유여부: string;
  아케이드보유여부: string;
  distance?: number;
}

interface NearbyMarketRecommendationProps {
  userLocation: { latitude: number; longitude: number; address: string };
}

const NearbyMarketRecommendation = ({ userLocation }: NearbyMarketRecommendationProps) => {
  const [nearbyMarkets, setNearbyMarkets] = useState<TraditionalMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<TraditionalMarket | null>(null);

  // 두 지점 간 거리 계산 (km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    const fetchNearbyMarkets = async () => {
      try {
        const { data, error } = await supabase
          .from('전통시장현황')
          .select('*')
          .not('경위도X좌표', 'is', null)
          .not('경위도Y좌표', 'is', null);

        if (error) {
          console.error('Error fetching markets:', error);
          return;
        }

        // 거리 계산 및 정렬
        const marketsWithDistance = data.map(market => ({
          ...market,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            market.경위도Y좌표,
            market.경위도X좌표
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // 가장 가까운 3개만

        setNearbyMarkets(marketsWithDistance);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyMarkets();
  }, [userLocation]);

  const getMarketFeatures = (market: TraditionalMarket) => {
    const features = [];
    if (market.시장전용고객주차장_보유여부 === 'O') features.push('주차장');
    if (market.화재감지기보유여부 === 'O') features.push('화재감지기');
    if (market.스프링쿨러보유여부 === 'O') features.push('스프링쿨러');
    if (market.아케이드보유여부 === 'O') features.push('아케이드');
    return features;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            근처 전통시장 찾는 중...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <MapPin className="h-5 w-5" />
            📍 근처 전통시장 추천
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nearbyMarkets.map((market) => (
              <div key={market.코드} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{market.시장명}</h3>
                    <p className="text-sm text-gray-600">{market.시장유형}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{market.distance?.toFixed(2)}km</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>도보 {Math.round((market.distance || 0) * 12)}분</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-1">
                    📍 {market.도로명주소 || market.지번주소}
                  </p>
                  <p className="text-xs text-gray-500">
                    {market.시도} {market.시군구}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap mb-3">
                  {getMarketFeatures(market).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button 
                  onClick={() => setSelectedMarket(market)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Info className="h-4 w-4 mr-2" />
                  상세 정보 보기
                </Button>
              </div>
            ))}

            {nearbyMarkets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">근처에 전통시장 정보를 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 모달 */}
      {selectedMarket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl">{selectedMarket.시장명}</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedMarket.시장유형}</p>
                </div>
                <Button 
                  onClick={() => setSelectedMarket(null)}
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">거리</div>
                    <div className="font-medium">{selectedMarket.distance?.toFixed(2)}km</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">도보 시간</div>
                    <div className="font-medium">{Math.round((selectedMarket.distance || 0) * 12)}분</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">🏢 주소</h4>
                <p className="text-sm">{selectedMarket.도로명주소 || selectedMarket.지번주소}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedMarket.시도} {selectedMarket.시군구}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">🏪 편의시설</h4>
                <div className="flex gap-2 flex-wrap">
                  {getMarketFeatures(selectedMarket).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {feature}
                    </Badge>
                  ))}
                  {getMarketFeatures(selectedMarket).length === 0 && (
                    <p className="text-sm text-gray-500">편의시설 정보가 없습니다.</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setSelectedMarket(null)}
                  className="w-full"
                >
                  닫기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NearbyMarketRecommendation;
