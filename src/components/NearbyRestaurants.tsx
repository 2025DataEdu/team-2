
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Users, Settings } from 'lucide-react';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';
import { useLocation } from '@/hooks/useLocation';

interface NearbyRestaurantsProps {
  title?: string;
}

const NearbyRestaurants = ({ title = "내 주변 맛집" }: NearbyRestaurantsProps) => {
  const [selectedRadius, setSelectedRadius] = useState<number>(5000); // 기본 5km
  const userLocation = useLocation();
  
  const { places, loading, error } = useGooglePlaces({ 
    latitude: userLocation.latitude, 
    longitude: userLocation.longitude,
    radius: selectedRadius
  });

  // 사용자 위치와의 거리 계산 함수 (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

  // 거리 계산 후 가까운 순으로 정렬하여 상위 3개만 선택
  const getTopNearestPlaces = () => {
    if (!userLocation.latitude || !userLocation.longitude || places.length === 0) {
      return [];
    }

    const placesWithDistance = places.map(place => ({
      ...place,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.geometry.location.lat,
        place.geometry.location.lng
      )
    }));

    // 거리순으로 정렬하여 상위 3개만 반환
    return placesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  const nearestPlaces = getTopNearestPlaces();

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '₩'.repeat(level);
  };

  const getPlaceType = (types: string[]) => {
    if (types.includes('bakery') || types.includes('cafe')) return '카페/디저트';
    if (types.includes('restaurant')) return '음식점';
    return '맛집';
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        )}
        <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // 위치 정보 로딩 중
  if (userLocation.isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="text-sm text-gray-500">위치 정보를 가져오는 중...</div>
      </div>
    );
  }

  // 위치 정보 오류
  if (userLocation.error) {
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="text-sm text-red-500">위치 정보를 가져올 수 없습니다: {userLocation.error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || nearestPlaces.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            🍽️ {title}
          </h4>
          <Select value={selectedRadius.toString()} onValueChange={(value) => setSelectedRadius(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">1km</SelectItem>
              <SelectItem value="3000">3km</SelectItem>
              <SelectItem value="5000">5km</SelectItem>
              <SelectItem value="10000">10km</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-500">
          {selectedRadius / 1000}km 반경 내 맛집 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          🍽️ {title}
          <Badge variant="outline" className="text-xs">
            상위 {nearestPlaces.length}개
          </Badge>
        </h4>
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-400" />
          <Select value={selectedRadius.toString()} onValueChange={(value) => setSelectedRadius(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">1km</SelectItem>
              <SelectItem value="3000">3km</SelectItem>
              <SelectItem value="5000">5km</SelectItem>
              <SelectItem value="10000">10km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3">
        {nearestPlaces.map((place, index) => (
          <div key={place.place_id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                <h5 className="font-medium text-gray-900 line-clamp-1">{place.name}</h5>
              </div>
              <div className="flex gap-2 ml-2 flex-shrink-0">
                <Badge variant="secondary" className="text-xs">
                  {getPlaceType(place.types)}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium text-blue-600">
                  {place.distance.toFixed(1)}km
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              {renderStars(place.rating)}
              <span className="text-xs text-gray-500">
                ({place.user_ratings_total}개 리뷰)
              </span>
            </div>
            
            {place.vicinity && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600 line-clamp-1">{place.vicinity}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              {place.price_level && (
                <span className="text-sm font-medium text-green-600">
                  {getPriceLevel(place.price_level)}
                </span>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7"
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;
                  window.open(url, '_blank');
                }}
              >
                지도에서 보기
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        📍 현재 위치: {userLocation.address}
      </div>
    </div>
  );
};

export default NearbyRestaurants;
