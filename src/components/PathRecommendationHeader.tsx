
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

  const getOptimalVoice = () => {
    const voices = speechSynthesis.getVoices();
    
    // 한국어 여성 목소리 우선순위
    const preferredVoices = [
      'Google 한국의', // Google Korean female
      'Microsoft Heami - Korean (Korea)',
      'Microsoft SunHi - Korean (Korea)', 
      'Yuna', // Apple Korean female
      'Kyoko', // Japanese female (fallback)
      'Samantha', // English female (fallback)
    ];

    // 우선순위에 따라 목소리 찾기
    for (const preferredName of preferredVoices) {
      const voice = voices.find(v => 
        v.name.includes(preferredName) || 
        (v.lang.includes('ko') && v.name.toLowerCase().includes('female'))
      );
      if (voice) return voice;
    }

    // 한국어 목소리 중 아무거나
    const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koreanVoice) return koreanVoice;

    // 여성 목소리 중 아무거나
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('girl')
    );
    if (femaleVoice) return femaleVoice;

    return voices[0]; // 기본 목소리
  };

  const speakRecommendationInfo = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const textToSpeak = `
        안녕하세요! AI 맞춤형 산책로 추천 서비스예요!
        개인의 건강 상태와 실시간 환경 정보를 분석해서 
        가장 적합한 산책로를 추천해드려요.
        원하는 산책로를 선택하시면 상세 정보를 확인하실 수 있어요!
        즐거운 산책 되세요!
      `;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // 귀여운 여자아이 목소리 설정
      const optimalVoice = getOptimalVoice();
      if (optimalVoice) {
        utterance.voice = optimalVoice;
      }
      
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9; // 조금 더 빠르게 (귀여운 느낌)
      utterance.pitch = 1.2; // 높은 톤 (귀여운 목소리)
      utterance.volume = 1;

      utterance.onstart = () => {
        toast({
          title: "🎀 귀여운 음성 안내 시작",
          description: "서비스 소개를 귀여운 목소리로 들려드려요!",
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
          className="flex items-center gap-2 font-accent bg-pink-50 hover:bg-pink-100 border-pink-300"
        >
          <Volume2 className="h-4 w-4 text-pink-600" />
          🎀 귀여운 음성 안내
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
