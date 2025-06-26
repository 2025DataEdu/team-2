
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
      안녕하세요! 저는 AI 산책로 추천 시스템입니다.
      여러분의 건강 상태와 현재 날씨 정보를 종합적으로 분석하여
      최적의 산책 경로를 추천해드리고 있어요.
      각 산책로를 클릭하시면 상세한 정보와 함께
      맞춤형 안내를 들으실 수 있습니다.
      함께 건강한 산책을 즐겨보세요!
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
