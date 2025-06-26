
import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  isLoading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    address: '',
    isLoading: true,
    error: null
  });

  // 주소로 위치 변경하는 함수
  const changeLocationByAddress = async (address: string) => {
    setLocation(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 실제 환경에서는 Google Geocoding API나 다른 지오코딩 서비스 사용
      // 여기서는 mock 데이터로 처리
      const mockCoordinates = getMockCoordinates(address);
      
      setLocation({
        latitude: mockCoordinates.lat,
        longitude: mockCoordinates.lng,
        address: address,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: '주소를 찾을 수 없습니다.'
      }));
    }
  };

  // Mock 좌표 생성 함수 (실제로는 지오코딩 API 사용)
  const getMockCoordinates = (address: string) => {
    // 서울 지역별 대략적인 좌표
    if (address.includes('강남')) {
      return { lat: 37.4979, lng: 127.0276 };
    } else if (address.includes('홍대') || address.includes('마포')) {
      return { lat: 37.5563, lng: 126.9233 };
    } else if (address.includes('명동') || address.includes('중구')) {
      return { lat: 37.5636, lng: 126.9832 };
    } else if (address.includes('부산')) {
      return { lat: 35.1796, lng: 129.0756 };
    } else if (address.includes('대구')) {
      return { lat: 35.8714, lng: 128.6014 };
    } else {
      // 기본값: 서울 시청
      return { lat: 37.5665, lng: 126.9780 };
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: '이 브라우저는 위치 서비스를 지원하지 않습니다.'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding으로 주소 가져오기 (실제 환경에서는 Google Maps API 등 사용)
          const mockAddress = `서울시 ${latitude > 37.55 ? '강북구' : '강남구'} ${longitude > 127.0 ? '동쪽' : '서쪽'} 지역`;
          
          setLocation({
            latitude: Number(latitude.toFixed(2)),
            longitude: Number(longitude.toFixed(2)),
            address: mockAddress,
            isLoading: false,
            error: null
          });
        } catch (error) {
          setLocation(prev => ({
            ...prev,
            isLoading: false,
            error: '주소를 가져오는데 실패했습니다.'
          }));
        }
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근 권한이 거부되었습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청이 시간 초과되었습니다.';
            break;
        }
        
        // 에러 시 기본 위치 (서울 시청) 사용
        setLocation({
          latitude: Number((37.5665).toFixed(2)),
          longitude: Number((126.9780).toFixed(2)),
          address: '서울특별시 중구 (기본 위치)',
          isLoading: false,
          error: errorMessage
        });
      }
    );
  }, []);

  return {
    ...location,
    changeLocationByAddress
  };
};
