
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, TrendingUp, Heart, Star, Lightbulb } from 'lucide-react';

interface WalkingPath {
  id: string;
  name: string;
  distance: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  elevation: number;
  rating: number;
  features: string[];
  description: string;
  amenities: string[];
  recommendationReason: string;
}

interface WalkingPathCardProps {
  path: WalkingPath;
  onSelect: (path: WalkingPath) => void;
}

const WalkingPathCard = ({ path, onSelect }: WalkingPathCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return '보통';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{path.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{path.rating}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className={getDifficultyColor(path.difficulty)}>
            {getDifficultyText(path.difficulty)}
          </Badge>
          {path.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 text-sm">{path.description}</p>
        
        {/* 추천 이유 섹션 추가 */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-400">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-blue-800 mb-1">추천 이유</div>
              <p className="text-sm text-blue-700">{path.recommendationReason}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{path.distance}km</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm">{path.duration}분</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span className="text-sm">경사 {path.elevation}m</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-600" />
            <span className="text-sm">칼로리 {Math.round(path.distance * 50)}kcal</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">주변 편의시설</div>
          <div className="flex gap-2 flex-wrap">
            {path.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => onSelect(path)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          이 경로 선택하기
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalkingPathCard;
