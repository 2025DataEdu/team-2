
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useElevenLabsTTS = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = async (text: string, apiKey: string) => {
    try {
      // 아이유와 비슷한 목소리 특성을 가진 음성 ID (여성, 부드러운 톤)
      const voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria voice - 부드럽고 따뜻한 여성 목소리
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75, // 안정적인 목소리
            similarity_boost: 0.85, // 자연스러운 느낌
            style: 0.6, // 감정적 표현력
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
        description: "ElevenLabs API 키를 설정해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPlaying(true);
      setIsPaused(false);
      
      toast({
        title: "🎤 아이유 목소리 생성 중...",
        description: "아이유와 비슷한 목소리로 변환하고 있어요!",
      });

      const audioUrl = await generateSpeech(text, apiKey);
      
      // 기존 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        toast({
          title: "🎵 아이유 목소리 재생",
          description: "아이유와 비슷한 목소리로 들려드려요!",
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "✨ 재생 완료",
          description: "음성 재생이 완료되었어요!",
        });
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        toast({
          title: "재생 오류",
          description: "음성 재생 중 오류가 발생했어요.",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "음성 생성 실패",
        description: "아이유 목소리 생성에 실패했어요. API 키를 확인해주세요.",
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
          description: "아이유 목소리 재생을 다시 시작해요!",
        });
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 재생 일시정지",
          description: "아이유 목소리 재생을 잠시 멈췄어요.",
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
        description: "아이유 목소리 재생을 중지했어요.",
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
