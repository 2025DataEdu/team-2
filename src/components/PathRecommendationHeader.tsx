
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import SpeechControls from './SpeechControls';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface PathRecommendationHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  userProfile?: UserProfile;
  userLocation?: { latitude: number; longitude: number; address: string };
}

const PathRecommendationHeader = ({
  onRefresh,
  isLoading,
  userProfile,
  userLocation
}: PathRecommendationHeaderProps) => {
  const { 
    isPlaying, 
    isPaused, 
    useElevenLabs,
    speakText, 
    pauseResumeSpeech, 
    stopSpeech
  } = useSpeechSynthesis();

  const handleSpeakAIAnalysis = () => {
    if (!userProfile) {
      speakText("AI 분석 정보가 없어서 말해줄 수 없어~");
      return;
    }

    const fitnessLevelKr = userProfile.fitnessLevel === 'beginner' ? '초급자' : 
                          userProfile.fitnessLevel === 'intermediate' ? '중급자' : '고급자';
    
    const walkingGoalKr = userProfile.walkingGoal === 'health' ? '건강 증진' : 
                         userProfile.walkingGoal === 'weight' ? '체중 관리' : 
                         userProfile.walkingGoal === 'stress' ? '스트레스 해소' : '여가 활동';

    const textToSpeak = `
      AI 분석 결과를 말해줄게!
      
      ${fitnessLevelKr} 수준의 ${userProfile.preferredDistance[0].toFixed(2)}킬로미터 코스를 좋아하는 분이구나!
      ${walkingGoalKr} 목적으로 운동하려는 거지?
      
      ${userProfile.age}살이고~ ${userProfile.healthConditions ? `${userProfile.healthConditions} 있다고 했으니까` : '특별한 건강 문제는 없구나!'}
      
      ${userLocation ? `현재 위치는 ${userLocation.address}이니까 접근하기 좋은 곳으로 골라줄게!` : ''}
      
      이런 조건들을 다 고려해서 제일 좋은 산책길을 추천해줄게! 완전 딱 맞을 거야!
    `;
    
    speakText(textToSpeak);
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-card font-bold text-zinc-50">
        🎯 맞춤형 산책로 추천
      </h2>
      <div className="flex gap-2">
        <SpeechControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          useElevenLabs={useElevenLabs}
          onSpeak={handleSpeakAIAnalysis}
          onPauseResume={pauseResumeSpeech}
          onStop={stopSpeech}
        />
        <Button 
          onClick={onRefresh} 
          disabled={isLoading} 
          variant="outline" 
          className="flex items-center gap-2 font-accent"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>
    </div>
  );
};

export default PathRecommendationHeader;
