
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useSpeechSynthesis = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // 기존 음성이 재생 중이면 중지
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
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
        setIsPlaying(true);
        setIsPaused(false);
        toast({
          title: "🎀 귀여운 음성 재생 시작",
          description: "선택된 산책로 정보를 귀여운 목소리로 들려드려요!",
        });
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        toast({
          title: "🌸 음성 재생 완료",
          description: "산책로 정보 음성 재생이 완료되었어요!",
        });
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        toast({
          title: "😅 음성 재생 오류",
          description: "음성 재생 중 오류가 발생했어요.",
          variant: "destructive",
        });
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "음성 재생 미지원",
        description: "이 브라우저는 음성 재생을 지원하지 않습니다.",
        variant: "destructive",
      });
    }
  };

  const pauseResumeSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        toast({
          title: "🎵 음성 재생 재개",
          description: "음성 재생을 다시 시작해요!",
        });
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 음성 재생 일시정지",
          description: "음성 재생을 잠시 멈췄어요.",
        });
      }
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
      toast({
        title: "🛑 음성 재생 중지",
        description: "음성 재생을 중지했어요.",
      });
    }
  };

  return {
    isPlaying,
    isPaused,
    speakText,
    pauseResumeSpeech,
    stopSpeech,
  };
};
