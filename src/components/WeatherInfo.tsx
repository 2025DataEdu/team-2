
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  airQuality: string;
  uvIndex: number;
}

const WeatherInfo = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 8,
    airQuality: 'good',
    uvIndex: 5
  });

  useEffect(() => {
    // 실제 환경에서는 실시간 날씨 API를 연동
    const mockWeatherData = {
      temperature: Math.floor(Math.random() * 15) + 15,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 15) + 5,
      airQuality: ['good', 'moderate', 'poor'][Math.floor(Math.random() * 3)],
      uvIndex: Math.floor(Math.random() * 8) + 1
    };
    setWeather(mockWeatherData);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getWeatherIcon(weather.condition)}
          실시간 환경 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weather.temperature}°C</div>
            <div className="text-sm text-gray-600">기온</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{weather.humidity}%</div>
            <div className="text-sm text-gray-600">습도</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Wind className="h-4 w-4" />
              <span className="text-xl font-bold text-gray-700">{weather.windSpeed}km/h</span>
            </div>
            <div className="text-sm text-gray-600">풍속</div>
          </div>
          
          <div className="text-center">
            <Badge className={getAirQualityColor(weather.airQuality)}>
              {weather.airQuality === 'good' ? '좋음' : 
               weather.airQuality === 'moderate' ? '보통' : '나쁨'}
            </Badge>
            <div className="text-sm text-gray-600 mt-1">대기질</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            🌤️ 산책하기 {weather.temperature > 15 && weather.temperature < 25 && weather.airQuality === 'good' ? '좋은' : '보통인'} 날씨입니다
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherInfo;
