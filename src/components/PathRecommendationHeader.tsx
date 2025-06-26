
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
    stopSpeech,
    setApiKey,
    useBrowserTTS
  } = useSpeechSynthesis();

  const handleSpeakRecommendationInfo = () => {
    const textToSpeak = `
      안녕하세요! AI 맞춤형 산책로 추천 서비스예요!
      개인의 건강 상태와 실시간 환경 정보를 분석해서 
      가장 적합한 산책로를 추천해드려요.
      원하는 산책로를 선택하시면 상세 정보를 확인하실 수 있어요!
      즐거운 산책 되세요!
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
          onSetApiKey={setApiKey}
          onUseBrowserTTS={useBrowserTTS}
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
