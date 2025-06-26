
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOptimalVoice } from '@/utils/browserTTSConfig';

export const useBrowserTTS = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // 기존 음성이 재생 중이면 중지
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 목소리 로드 대기 후 설정
      const setVoiceAndSpeak = () => {
        const optimalVoice = getOptimalVoice();
        if (optimalVoice) {
          utterance.voice = optimalVoice;
        }
        
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9; // 조금 빠르게 (5살 아이처럼)
        utterance.pitch = 2.0; // 최대 높은 톤 (5살 여자아이)
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
          toast({
            title: "🎀 헤헤헷! 들어봐봐~",
            description: "5살 여자아이 목소리야! 완전 귀여워!",
          });
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          utteranceRef.current = null;
          toast({
            title: "🌸 다 말했어어!",
            description: "어땠어? 완전 귀여웠지? 히히히헷~",
          });
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          setIsPlaying(false);
          setIsPaused(false);
          utteranceRef.current = null;
          toast({
            title: "😅 앗! 안 돼!",
            description: "다시 해볼게! 걱정 마마~",
            variant: "destructive",
          });
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      };

      // 목소리 로드 확인
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
        };
      } else {
        setVoiceAndSpeak();
      }
    } else {
      toast({
        title: "음성이 안 돼ㅠㅠ",
        description: "이 브라우저는 목소리가 안 나와~",
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
          title: "🎵 다시 들어봐봐!",
          description: "계속 말해줄게~! 히히히~",
        });
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 잠깐만잠깐만!",
          description: "기다려줄게~ 언제든 다시 눌러봐봐!",
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
        title: "🛑 그만 말할게!",
        description: "또 들려줄 거 있으면 말해줘~ 기다릴게!",
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
