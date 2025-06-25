
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

const LocationInfo = () => {
  const { latitude, longitude, address, isLoading, error } = useLocation();

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
          현재 위치 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">주소:</span>
            <span className="font-medium">{address}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">위도:</span>
            <span className="font-medium">{latitude.toFixed(6)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">경도:</span>
            <span className="font-medium">{longitude.toFixed(6)}</span>
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
