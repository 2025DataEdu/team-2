
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Search, Navigation } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

const LocationInfo = () => {
  const { latitude, longitude, address, isLoading, error, changeLocationByAddress } = useLocation();
  const [inputAddress, setInputAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressSearch = async () => {
    if (!inputAddress.trim()) return;
    
    setIsSearching(true);
    await changeLocationByAddress(inputAddress.trim());
    setIsSearching(false);
    setInputAddress('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddressSearch();
    }
  };

  if (isLoading) {
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
          {/* 주소 검색 입력칸 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="주소를 입력하세요 (예: 서울시 강남구, 부산시 해운대구)"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleAddressSearch}
              disabled={!inputAddress.trim() || isSearching}
              size="default"
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  검색 중...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  검색
                </>
              )}
            </Button>
          </div>

          {/* 현재 위치 정보 */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Navigation className="h-4 w-4" />
              <span>현재 설정된 위치</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">주소:</span>
              <span className="font-medium">{address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">위도:</span>
              <span className="font-medium">{latitude.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">경도:</span>
              <span className="font-medium">{longitude.toFixed(2)}</span>
            </div>
          </div>

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
