
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useElevenLabsTTS } from './useElevenLabsTTS';
import { useBrowserTTS } from './useBrowserTTS';
import { transformToChildlikeText } from '@/utils/speechTextTransform';

export const useSpeechSynthesis = () => {
  const { toast } = useToast();
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('sk_bd4c994d18130506af1073635b71783520c7f5688ee9ecc1');
  
  const elevenLabsTTS = useElevenLabsTTS();
  const browserTTS = useBrowserTTS();

  // 컴포넌트 마운트시 자동으로 ElevenLabs 활성화
  useEffect(() => {
    if (elevenLabsApiKey) {
      setUseElevenLabs(true);
      toast({
        title: "🎀 와와! 5살 여아 목소리 준비됐어!",
        description: "진짜진짜 귀여운 목소리로 말해줄 수 있어! 빨리빨리! 헤헤헷~",
      });
    }
  }, []);

  // ElevenLabs API 키 설정 함수
  const setApiKey = (apiKey: string) => {
    setElevenLabsApiKey(apiKey);
    setUseElevenLabs(true);
    toast({
      title: "🎀 와와! 진짜 귀여운 목소리 준비됐어!",
      description: "이제 5살 여자아이 목소리로 말해줄 수 있어! 완전 귀여워! 헤헤헷~",
    });
  };

  // 기본 브라우저 TTS로 전환
  const switchToBrowserTTS = () => {
    setUseElevenLabs(false);
    toast({
      title: "기본 목소리로 바꿨어!",
      description: "그래도 귀엽게 말해줄게~ 걱정 마!",
    });
  };

  const speakText = async (text: string) => {
    // 5살 여자아이 말투로 변환
    const childlikeText = transformToChildlikeText(text);

    // ElevenLabs 사용 시 (기본값)
    if (useElevenLabs && elevenLabsApiKey) {
      await elevenLabsTTS.speakText(childlikeText, elevenLabsApiKey);
      return;
    }

    // 기본 브라우저 TTS 사용
    browserTTS.speakText(childlikeText);
  };

  const pauseResumeSpeech = () => {
    if (useElevenLabs) {
      elevenLabsTTS.pauseResumeSpeech();
      return;
    }

    browserTTS.pauseResumeSpeech();
  };

  const stopSpeech = () => {
    if (useElevenLabs) {
      elevenLabsTTS.stopSpeech();
      return;
    }

    browserTTS.stopSpeech();
  };

  return {
    isPlaying: useElevenLabs ? elevenLabsTTS.isPlaying : browserTTS.isPlaying,
    isPaused: useElevenLabs ? elevenLabsTTS.isPaused : browserTTS.isPaused,
    useElevenLabs,
    speakText,
    pauseResumeSpeech,
    stopSpeech,
    setApiKey,
    useBrowserTTS: switchToBrowserTTS,
  };
};
