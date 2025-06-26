
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PathRecommendationHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const PathRecommendationHeader = ({
  onRefresh,
  isLoading
}: PathRecommendationHeaderProps) => {
  const { toast } = useToast();

  const speakRecommendationInfo = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const textToSpeak = `
        AI 맞춤형 산책로 추천 서비스입니다.
        개인의 건강 상태와 실시간 환경 정보를 분석하여 
        가장 적합한 산책로를 추천해드립니다.
        원하는 산책로를 선택하시면 상세 정보를 확인하실 수 있습니다.
      `;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        toast({
          title: "음성 안내 시작",
          description: "서비스 소개를 음성으로 들려드립니다.",
        });
      };

      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "음성 재생 미지원",
        description: "이 브라우저는 음성 재생을 지원하지 않습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-card font-bold text-zinc-50">
        🎯 맞춤형 산책로 추천
      </h2>
      <div className="flex gap-2">
        <Button
          onClick={speakRecommendationInfo}
          variant="outline"
          className="flex items-center gap-2 font-accent bg-blue-50 hover:bg-blue-100 border-blue-300"
        >
          <Volume2 className="h-4 w-4 text-blue-600" />
          음성 안내
        </Button>
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
