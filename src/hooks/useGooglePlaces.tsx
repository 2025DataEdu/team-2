
import { useState, useEffect } from 'react';

interface GooglePlace {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  types: string[];
  vicinity?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  price_level?: number;
}

interface UseGooglePlacesProps {
  latitude: number | null;
  longitude: number | null;
  radius?: number;
  type?: string;
}

export const useGooglePlaces = ({ latitude, longitude, radius = 1000, type = 'restaurant' }: UseGooglePlacesProps) => {
  const [places, setPlaces] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        // Google Places API를 사용하여 근처 맛집과 디저트 검색
        // 실제 구현에서는 백엔드 API를 통해 호출해야 합니다
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=YOUR_GOOGLE_PLACES_API_KEY`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        const data = await response.json();
        
        // 별점 기준으로 정렬 (높은 별점부터)
        const sortedPlaces = data.results
          .filter((place: GooglePlace) => place.rating && place.rating >= 3.5)
          .sort((a: GooglePlace, b: GooglePlace) => (b.rating || 0) - (a.rating || 0));

        setPlaces(sortedPlaces);
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('맛집 정보를 불러오는데 실패했습니다.');
        // 임시 더미 데이터로 대체
        setPlaces(generateDummyPlaces(latitude, longitude));
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [latitude, longitude, radius, type]);

  return { places, loading, error };
};

// 임시 더미 데이터 생성 함수
const generateDummyPlaces = (lat: number, lng: number): GooglePlace[] => {
  const restaurantNames = [
    '맛있는 한식당', '이탈리아 파스타', '일식 전문점', '카페 로스팅',
    '디저트 하우스', '브런치 카페', '치킨 전문점', '분식 맛집',
    '베이커리 카페', '아이스크림 가게', '떡볶이 명가', '피자 레스토랑',
    '중식당', '태국 음식점', '버거 하우스', '도넛 전문점'
  ];

  return restaurantNames.map((name, index) => ({
    place_id: `dummy_${index}`,
    name,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    user_ratings_total: Math.floor(50 + Math.random() * 500),
    types: index % 3 === 0 ? ['bakery', 'cafe'] : ['restaurant', 'food'],
    vicinity: `${name} 근처`,
    geometry: {
      location: {
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01
      }
    },
    price_level: Math.floor(1 + Math.random() * 3)
  }));
};
