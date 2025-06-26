
import { useState, useEffect } from 'react';
import { geocodeAddress } from '@/utils/geocoding';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  isLoading: boolean;
  error: string | null;
}

interface UseLocationOptions {
  onLocationChange?: (location: { latitude: number; longitude: number; address: string }) => void;
}

export const useLocation = (options?: UseLocationOptions) => {
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    address: '',
    isLoading: true,
    error: null
  });

  // 위치 업데이트 헬퍼 함수
  const updateLocation = (newLocation: Omit<LocationData, 'isLoading' | 'error'>) => {
    console.log('updateLocation 호출됨:', newLocation);
    
    setLocation(prev => {
      // 위치가 실제로 변경되었는지 확인
      const hasChanged = 
        prev.latitude !== newLocation.latitude || 
        prev.longitude !== newLocation.longitude || 
        prev.address !== newLocation.address;
        
      if (hasChanged) {
        console.log('위치 변경 감지됨, 콜백 호출 예정:', newLocation);
        
        // 위치 변경 콜백 호출
        if (options?.onLocationChange) {
          console.log('위치 변경 콜백 호출:', newLocation);
          // 다음 렌더링 사이클에서 콜백 호출
          setTimeout(() => {
            options.onLocationChange!(newLocation);
          }, 0);
        }
      }
      
      return {
        ...newLocation,
        isLoading: false,
        error: null
      };
    });
  };

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
          
          const newLocation = {
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
            address: mockAddress
          };
          
          console.log('getCurrentLocation 완료:', newLocation);
          updateLocation(newLocation);
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
        
        const defaultLocation = {
          latitude: Number((37.5665).toFixed(6)),
          longitude: Number((126.9780).toFixed(6)),
          address: '서울특별시 중구 (기본 위치)'
        };
        
        setLocation({
          ...defaultLocation,
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
        console.log('주소 검색 결과:', result);
        const newLocation = {
          latitude: Number(result.latitude.toFixed(6)),
          longitude: Number(result.longitude.toFixed(6)),
          address: result.formattedAddress
        };
        
        console.log('searchByAddress 완료:', newLocation);
        updateLocation(newLocation);
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
