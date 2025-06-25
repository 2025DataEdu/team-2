
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

interface NearbyRestaurantsProps {
  latitude: number | null;
  longitude: number | null;
  title?: string;
}

const NearbyRestaurants = ({ latitude, longitude, title = "근처 맛집 & 디저트" }: NearbyRestaurantsProps) => {
  const [showMore, setShowMore] = useState(false);
  const { places, loading, error } = useGooglePlaces({ latitude, longitude });

  const displayedPlaces = showMore ? places : places.slice(0, 6);

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
        ))}
        <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || places.length === 0) {
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">근처 맛집 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        🍽️ {title}
        <Badge variant="outline" className="text-xs">
          {places.length}개 발견
        </Badge>
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayedPlaces.map((place) => (
          <div key={place.place_id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-medium text-gray-900 line-clamp-1">{place.name}</h5>
              <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                {getPlaceType(place.types)}
              </Badge>
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
      
      {places.length > 6 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2"
          >
            {showMore ? (
              <>
                접기 <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                더보기 ({places.length - 6}개 더) <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NearbyRestaurants;
