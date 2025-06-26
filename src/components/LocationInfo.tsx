
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Search, Navigation } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

const LocationInfo = () => {
  const { latitude, longitude, address, isLoading, error, getCurrentLocation, searchByAddress } = useLocation();
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    await searchByAddress(searchAddress);
    setIsSearching(false);
  };

  const handleGetCurrentLocation = async () => {
    setSearchAddress(''); // 주소 검색 입력창 초기화
    getCurrentLocation();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddressSearch();
    }
  };

  if (isLoading && !isSearching) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            현재 위치 확인 중...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
          <MapPin className="h-5 w-5" />
          위치 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 주소 검색 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              주소 검색
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="주소를 입력하세요 (예: 서울시 강남구 역삼동)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
                className="flex-1"
              />
              <Button 
                onClick={handleAddressSearch}
                disabled={isSearching || !searchAddress.trim()}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleGetCurrentLocation}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 위치 정보 표시 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">주소:</span>
              <span className="font-medium text-right flex-1 ml-2 text-sm">
                {isSearching ? '검색 중...' : address}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">위도:</span>
              <span className="font-medium">
                {isSearching ? '검색 중...' : latitude.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">경도:</span>
              <span className="font-medium">
                {isSearching ? '검색 중...' : longitude.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInfo;
