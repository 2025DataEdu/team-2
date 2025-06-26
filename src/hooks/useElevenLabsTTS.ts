
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useElevenLabsTTS = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = async (text: string, apiKey: string) => {
    try {
      // Halley 목소리 사용 - 젊고 활기찬 여성 목소리
      const voiceId = 'oWAxZDx7w5VEj9dCyTzz'; // Halley voice - 젊고 활기찬 목소리
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5', // 빠른 모델 사용
          voice_settings: {
            stability: 0.7, // 약간 다양한 톤
            similarity_boost: 0.8, // 원래 목소리 특성 유지
            style: 0.9, // 높은 감정 표현
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API 오류: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return audioUrl;
    } catch (error) {
      console.error('ElevenLabs TTS 오류:', error);
      throw error;
    }
  };

  const speakText = async (text: string, apiKey?: string) => {
    if (!apiKey) {
      toast({
        title: "API 키 필요",
        description: "ElevenLabs API 키를 설정해주세요",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPlaying(true);
      setIsPaused(false);
      
      toast({
        title: "🎤 Halley 목소리로 변환 중...",
        description: "젊고 활기찬 목소리로 만들어드리고 있어요!",
      });

      const audioUrl = await generateSpeech(text, apiKey);
      
      // 기존 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // 오디오 로딩 최적화
      audio.preload = 'auto';

      audio.onplay = () => {
        toast({
          title: "🎵 Halley 목소리로 재생 중",
          description: "젊고 활기찬 목소리를 들어보세요!",
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "✨ 재생 완료",
          description: "Halley 목소리는 어떠셨나요? 더 들으시려면 다시 눌러주세요!",
        });
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        toast({
          title: "재생 오류",
          description: "음성 재생 중 문제가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "음성 생성 실패",
        description: "Halley 목소리 생성에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const pauseResumeSpeech = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
        setIsPaused(false);
        toast({
          title: "🎵 재생 재개",
          description: "계속 들어보세요!",
        });
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 일시 정지",
          description: "언제든 다시 재생할 수 있어요!",
        });
      }
    }
  };

  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "🛑 재생 중지",
        description: "음성 재생을 중지했습니다.",
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

export default useElevenLabsTTS;
