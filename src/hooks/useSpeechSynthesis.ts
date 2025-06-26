
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useSpeechSynthesis = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getOptimalVoice = () => {
    const voices = speechSynthesis.getVoices();
    
    // 진짜 귀여운 여성 목소리 우선순위 (더 세밀한 필터링)
    const preferredVoices = [
      // 한국어 여성 목소리들
      'Microsoft Heami',
      'Microsoft SunHi', 
      'Google 한국의',
      'Yuna',
      // 일본어 여성 목소리들 (더 귀여운 톤)
      'Kyoko',
      'Otoya',
      'Hattori',
      // 영어 여성 목소리들 중 높은 톤
      'Samantha',
      'Victoria',
      'Princess',
      'Kathy',
      'Zoe'
    ];

    // 우선순위에 따라 목소리 찾기
    for (const preferredName of preferredVoices) {
      const voice = voices.find(v => 
        v.name.includes(preferredName) && 
        !v.name.toLowerCase().includes('male') &&
        !v.name.toLowerCase().includes('man')
      );
      if (voice) {
        console.log(`Selected voice: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }

    // 여성 키워드가 포함된 목소리 찾기
    const femaleKeywords = ['female', 'woman', 'girl', '여성', '여자'];
    const femaleVoice = voices.find(v => 
      femaleKeywords.some(keyword => 
        v.name.toLowerCase().includes(keyword)
      ) && !v.name.toLowerCase().includes('male')
    );
    if (femaleVoice) {
      console.log(`Selected female voice: ${femaleVoice.name}`);
      return femaleVoice;
    }

    // 한국어 목소리 중 아무거나
    const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koreanVoice) {
      console.log(`Selected Korean voice: ${koreanVoice.name}`);
      return koreanVoice;
    }

    console.log(`Using default voice: ${voices[0]?.name || 'none'}`);
    return voices[0]; // 기본 목소리
  };

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
        utterance.rate = 0.8; // 더 천천히 (귀여운 느낌)
        utterance.pitch = 1.5; // 더 높은 톤 (진짜 귀여운 목소리)
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
          toast({
            title: "🎀 귀여운 음성 재생 시작",
            description: "진짜 귀여운 목소리로 들려드려요!",
          });
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          utteranceRef.current = null;
          toast({
            title: "🌸 음성 재생 완료",
            description: "음성 재생이 완료되었어요!",
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
