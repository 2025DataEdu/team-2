
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { ExerciseRecommendation, getIntensityColor } from '@/utils/exerciseRecommendation';

interface ExerciseRecommendationCardProps {
  recommendation: ExerciseRecommendation;
}

const ExerciseRecommendationCard = ({ recommendation }: ExerciseRecommendationCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-green-700 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          맞춤형 운동강도 추천
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        {/* 운동강도와 심박수를 한 줄에 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">추천 강도:</span>
            <Badge className={`${getIntensityColor(recommendation.intensity)} text-xs`}>
              {recommendation.intensityKr}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold text-blue-900">
              {recommendation.heartRateRange.min}-{recommendation.heartRateRange.max} BPM
            </span>
          </div>
        </div>

        {/* 운동 시간 및 빈도 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-xs text-gray-600">
                {recommendation.duration.min}-{recommendation.duration.max}분
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-xs text-gray-600">{recommendation.frequency}</div>
            </div>
          </div>
        </div>

        {/* 추천 이유 (축약) */}
        <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
          <p className="text-xs text-green-700 leading-relaxed">
            {recommendation.reasoning}
          </p>
        </div>

        {/* 주의사항 (최대 2개만) */}
        <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs font-medium text-orange-800">주의사항</div>
          </div>
          <ul className="space-y-1">
            {recommendation.precautions.slice(0, 2).map((precaution, index) => (
              <li key={index} className="text-xs text-orange-700 flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                <span>{precaution}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseRecommendationCard;
