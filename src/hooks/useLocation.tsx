
import { useState, useEffect } from 'react';
import { geocodeAddress } from '@/utils/geocoding';

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

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: '이 브라우저는 위치 서비스를 지원하지 않습니다.'
      }));
      return;
    }

    setLocation(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const mockAddress = `서울시 ${latitude > 37.55 ? '강북구' : '강남구'} ${longitude > 127.0 ? '동쪽' : '서쪽'} 지역`;
          
          setLocation({
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
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
        
        setLocation({
          latitude: Number((37.5665).toFixed(6)),
          longitude: Number((126.9780).toFixed(6)),
          address: '서울특별시 중구 (기본 위치)',
          isLoading: false,
          error: errorMessage
        });
      }
    );
  };

  // 주소로 위치 검색
  const searchByAddress = async (address: string) => {
    if (!address.trim()) return;

    setLocation(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await geocodeAddress(address);
      
      if (result) {
        setLocation({
          latitude: Number(result.latitude.toFixed(6)),
          longitude: Number(result.longitude.toFixed(6)),
          address: result.formattedAddress,
          isLoading: false,
          error: null
        });
      } else {
        setLocation(prev => ({
          ...prev,
          isLoading: false,
          error: '주소를 찾을 수 없습니다. 다른 주소로 시도해보세요.'
        }));
      }
    } catch (error) {
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: '주소 검색 중 오류가 발생했습니다.'
      }));
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    ...location,
    getCurrentLocation,
    searchByAddress
  };
};
