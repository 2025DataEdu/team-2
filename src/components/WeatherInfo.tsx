
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, Eye, Droplets, Gauge, AlertTriangle, ThermometerSun } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  airQuality: string;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  pressure: number;
  feelsLike: number;
  precipitationChance: number;
  pollenLevel: string;
  walkingRecommendation: string;
}

const WeatherInfo = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 8,
    airQuality: 'good',
    uvIndex: 5,
    visibility: 10,
    dewPoint: 15,
    pressure: 1013,
    feelsLike: 24,
    precipitationChance: 20,
    pollenLevel: 'moderate',
    walkingRecommendation: 'excellent'
  });

  useEffect(() => {
    // 실제 환경에서는 실시간 날씨 API를 연동
    const mockWeatherData = {
      temperature: Math.floor(Math.random() * 15) + 15,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 5,
      airQuality: ['good', 'moderate', 'poor'][Math.floor(Math.random() * 3)],
      uvIndex: Math.floor(Math.random() * 8) + 1,
      visibility: Math.floor(Math.random() * 8) + 8,
      dewPoint: Math.floor(Math.random() * 10) + 10,
      pressure: Math.floor(Math.random() * 50) + 990,
      feelsLike: Math.floor(Math.random() * 15) + 15 + 2,
      precipitationChance: Math.floor(Math.random() * 80),
      pollenLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
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

  const getAirQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPollenColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: '낮음', color: 'text-green-600' };
    if (index <= 5) return { level: '보통', color: 'text-yellow-600' };
    if (index <= 7) return { level: '높음', color: 'text-orange-600' };
    return { level: '매우높음', color: 'text-red-600' };
  };

  const uvLevel = getUVLevel(weather.uvIndex);

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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

        {/* 추가 환경 정보 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Eye className="h-3 w-3 text-blue-500" />
              <span className="text-sm font-bold text-blue-600">{weather.visibility}km</span>
            </div>
            <div className="text-xs text-gray-600">가시거리</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Droplets className="h-3 w-3 text-cyan-500" />
              <span className="text-sm font-bold text-cyan-600">{weather.dewPoint}°C</span>
            </div>
            <div className="text-xs text-gray-600">이슬점</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Gauge className="h-3 w-3 text-indigo-500" />
              <span className="text-sm font-bold text-indigo-600">{weather.pressure}hPa</span>
            </div>
            <div className="text-xs text-gray-600">기압</div>
          </div>
        </div>

        {/* 상태 표시 배지들 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <Badge className={`${getAirQualityColor(weather.airQuality)} text-xs mb-1`}>
              {weather.airQuality === 'good' ? '좋음' : 
               weather.airQuality === 'moderate' ? '보통' : '나쁨'}
            </Badge>
            <div className="text-xs text-gray-600">대기질</div>
          </div>

          <div className="text-center">
            <Badge className={`${uvLevel.color} bg-opacity-10 text-xs mb-1`}>
              UV {weather.uvIndex} ({uvLevel.level})
            </Badge>
            <div className="text-xs text-gray-600">자외선</div>
          </div>

          <div className="text-center">
            <Badge className={`${getPollenColor(weather.pollenLevel)} text-xs mb-1`}>
              {weather.pollenLevel === 'low' ? '낮음' : 
               weather.pollenLevel === 'moderate' ? '보통' : '높음'}
            </Badge>
            <div className="text-xs text-gray-600">꽃가루</div>
          </div>

          <div className="text-center">
            <Badge className="bg-blue-100 text-blue-800 text-xs mb-1">
              {weather.precipitationChance}%
            </Badge>
            <div className="text-xs text-gray-600">강수확률</div>
          </div>
        </div>

        {/* 산책 추천도 */}
        <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
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
        
        {/* 종합 권장사항 */}
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-800">
            {weather.temperature > 15 && weather.temperature < 25 && weather.airQuality === 'good' ? 
              '🌤️ 완벽한 산책 날씨입니다! 외부 활동을 즐겨보세요.' :
              weather.temperature < 10 || weather.temperature > 30 ?
              '🌡️ 기온에 주의하여 적절한 복장을 준비하세요.' :
              weather.airQuality === 'poor' ?
              '😷 대기질이 좋지 않으니 마스크 착용을 권장합니다.' :
              '☁️ 실외 활동 시 날씨 변화에 유의하세요.'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherInfo;
