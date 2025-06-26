
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, ThermometerSun } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  precipitationChance: number;
  walkingRecommendation: string;
}

const WeatherInfo = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 8,
    feelsLike: 24,
    precipitationChance: 20,
    walkingRecommendation: 'excellent'
  });

  useEffect(() => {
    // 실제 환경에서는 실시간 날씨 API를 연동
    const mockWeatherData = {
      temperature: Math.floor(Math.random() * 15) + 15,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 5,
      feelsLike: Math.floor(Math.random() * 15) + 15 + 2,
      precipitationChance: Math.floor(Math.random() * 80),
      walkingRecommendation: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)]
    };
    setWeather(mockWeatherData);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-500" />;
      default: return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getWalkingRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getWeatherIcon(weather.condition)}
          실시간 환경 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 기본 날씨 정보 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{weather.temperature}°C</div>
            <div className="text-xs text-gray-600">기온</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ThermometerSun className="h-3 w-3 text-orange-500" />
              <span className="text-lg font-bold text-orange-600">{weather.feelsLike}°C</span>
            </div>
            <div className="text-xs text-gray-600">체감온도</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{weather.humidity}%</div>
            <div className="text-xs text-gray-600">습도</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Wind className="h-3 w-3" />
              <span className="text-lg font-bold text-gray-700">{weather.windSpeed}km/h</span>
            </div>
            <div className="text-xs text-gray-600">풍속</div>
          </div>
        </div>

        {/* 산책 추천도 */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">🚶‍♂️ 산책 추천도</span>
            <Badge className={`${getWalkingRecommendationColor(weather.walkingRecommendation)}`}>
              {weather.walkingRecommendation === 'excellent' ? '최적' :
               weather.walkingRecommendation === 'good' ? '좋음' :
               weather.walkingRecommendation === 'fair' ? '보통' : '주의'}
            </Badge>
          </div>
          <div className="text-xs text-gray-600">
            기온 {weather.temperature}°C, 체감 {weather.feelsLike}°C로 산책하기 {weather.walkingRecommendation === 'excellent' || weather.walkingRecommendation === 'good' ? '좋은' : '보통인'} 조건입니다.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherInfo;
