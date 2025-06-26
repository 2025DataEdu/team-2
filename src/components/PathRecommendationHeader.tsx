
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import SpeechControls from './SpeechControls';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface PathRecommendationHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const PathRecommendationHeader = ({
  onRefresh,
  isLoading
}: PathRecommendationHeaderProps) => {
  const { 
    isPlaying, 
    isPaused, 
    useElevenLabs,
    speakText, 
    pauseResumeSpeech, 
    stopSpeech
  } = useSpeechSynthesis();

  const handleSpeakRecommendationInfo = () => {
    const textToSpeak = `
      안녕! 나는 AI 산책로 추천 서비스야!
      너의 건강 상태랑 지금 날씨를 보고서 
      제일 좋은 산책길을 골라줄게!
      원하는 산책길을 누르면 자세한 이야기를 들을 수 있어!
      재밌게 산책하자! 에헤헷~
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
          onSpeak={handleSpeakRecommendationInfo}
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
