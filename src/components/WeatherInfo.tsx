
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  airQuality: string;
  uvIndex: number;
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
    airQuality: 'good',
    uvIndex: 5,
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
      airQuality: ['good', 'moderate', 'poor'][Math.floor(Math.random() * 3)],
      uvIndex: Math.floor(Math.random() * 8) + 1,
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

  const getAirQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
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

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        {getWeatherIcon(weather.condition)}
        실시간 환경 정보
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>기온:</span>
          <span className="font-semibold text-blue-600">{weather.temperature}°C</span>
        </div>
        <div className="flex justify-between">
          <span>체감온도:</span>
          <span className="font-semibold text-orange-600">{weather.feelsLike}°C</span>
        </div>
        <div className="flex justify-between">
          <span>습도:</span>
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span>풍속:</span>
          <span>{weather.windSpeed}km/h</span>
        </div>
        <div className="flex justify-between">
          <span>대기질:</span>
          <Badge className={`${getAirQualityColor(weather.airQuality)} text-xs`}>
            {weather.airQuality === 'good' ? '좋음' : 
             weather.airQuality === 'moderate' ? '보통' : '나쁨'}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>자외선:</span>
          <span>UV {weather.uvIndex}</span>
        </div>
        <div className="flex justify-between">
          <span>강수확률:</span>
          <span>{weather.precipitationChance}%</span>
        </div>
        <div className="flex justify-between">
          <span>산책 추천도:</span>
          <Badge className={`${getWalkingRecommendationColor(weather.walkingRecommendation)} text-xs`}>
            {weather.walkingRecommendation === 'excellent' ? '최적' :
             weather.walkingRecommendation === 'good' ? '좋음' :
             weather.walkingRecommendation === 'fair' ? '보통' : '주의'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
