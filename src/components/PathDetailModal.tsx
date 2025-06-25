
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp, Heart, Star, Lightbulb, UtensilsCrossed } from 'lucide-react';

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
  nearbyFood: string[];
}

interface PathDetailModalProps {
  path: WalkingPath | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: WalkingPath) => void;
}

const PathDetailModal = ({ path, isOpen, onClose, onSelect }: PathDetailModalProps) => {
  if (!path) return null;

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

  const handleSelect = () => {
    onSelect(path);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{path.name}</DialogTitle>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{path.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge className={getDifficultyColor(path.difficulty)}>
              {getDifficultyText(path.difficulty)}
            </Badge>
            {path.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-600">{path.description}</p>
          
          {/* 추천 이유 섹션 */}
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-blue-800 mb-2">💡 추천 이유</div>
                <p className="text-sm text-blue-700">{path.recommendationReason}</p>
              </div>
            </div>
          </div>
          
          {/* 기본 정보 그리드 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">거리</div>
                <div className="font-medium">{path.distance.toFixed(2)}km</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">예상 시간</div>
                <div className="font-medium">{Math.round(path.duration)}분</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">경사</div>
                <div className="font-medium">{path.elevation.toFixed(1)}m</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-sm text-gray-600">예상 칼로리</div>
                <div className="font-medium">{Math.round(path.distance * 50)}kcal</div>
              </div>
            </div>
          </div>

          {/* 편의시설 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🏢 주변 편의시설</h4>
            <div className="flex gap-2 flex-wrap">
              {path.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* 근처 맛집/디저트 */}
          <div>
            <div className="flex items-center gap-2 font-medium text-gray-900 mb-3">
              <UtensilsCrossed className="h-5 w-5 text-orange-600" />
              근처 맛집 & 디저트
            </div>
            <div className="flex gap-2 flex-wrap">
              {path.nearbyFood.map((food, index) => (
                <Badge key={index} variant="outline" className="text-sm bg-orange-50 text-orange-700 border-orange-200">
                  {food}
                </Badge>
              ))}
            </div>
          </div>

          {/* 선택 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSelect}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              이 경로 선택하기
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PathDetailModal;
