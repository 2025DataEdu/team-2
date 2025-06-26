
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Clock, Calendar, AlertTriangle, BookOpen } from 'lucide-react';
import { ExerciseRecommendation, getIntensityColor } from '@/utils/exerciseRecommendation';

interface ExerciseRecommendationCardProps {
  recommendation: ExerciseRecommendation;
}

const ExerciseRecommendationCard = ({ recommendation }: ExerciseRecommendationCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-green-700 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          맞춤형 운동강도 추천
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 운동강도 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">추천 강도:</span>
          <Badge className={`${getIntensityColor(recommendation.intensity)} font-medium`}>
            {recommendation.intensityKr}
          </Badge>
        </div>

        {/* 심박수 범위 */}
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-blue-800">목표 심박수</span>
          </div>
          <div className="text-lg font-semibold text-blue-900">
            {recommendation.heartRateRange.min} - {recommendation.heartRateRange.max} BPM
          </div>
          <div className="text-xs text-blue-700 mt-1">
            운동 중 맥박이 이 범위 내에 있도록 조절하세요
          </div>
        </div>

        {/* 운동 시간 및 빈도 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-700">운동 시간</div>
              <div className="text-sm text-gray-600">
                {recommendation.duration.min}-{recommendation.duration.max}분
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-700">운동 빈도</div>
              <div className="text-sm text-gray-600">{recommendation.frequency}</div>
            </div>
          </div>
        </div>

        {/* 추천 이유 */}
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-green-800 mb-1">추천 이유</div>
              <p className="text-sm text-green-700 leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* 의학적 근거 */}
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-purple-800 mb-1">의학적 근거</div>
              <p className="text-sm text-purple-700 leading-relaxed">
                {recommendation.medicalBasis}
              </p>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm font-medium text-orange-800">주의사항</div>
          </div>
          <ul className="space-y-2">
            {recommendation.precautions.map((precaution, index) => (
              <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span>{precaution}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 운동 예시 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-800 mb-2">
            {recommendation.intensityKr} 운동 예시
          </div>
          <div className="text-sm text-gray-600">
            {recommendation.intensity === 'low' && '• 평지 걷기, 가벼운 스트레칭, 요가, 천천히 수영'}
            {recommendation.intensity === 'moderate' && '• 빠른 걷기, 가벼운 조깅, 자전거 타기, 계단 오르기'}
            {recommendation.intensity === 'high' && '• 달리기, 등산, 격렬한 스포츠, 고강도 인터벌 운동'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseRecommendationCard;
