
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useElevenLabsTTS = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = async (text: string, apiKey: string) => {
    try {
      // 5살 여자아이에게 가장 적합한 목소리 - Charlotte 사용 (더 어리고 귀여운 느낌)
      const voiceId = 'XB0fDUnXU5powFXDhCwa'; // Charlotte voice - 5살 여자아이 목소리
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5', // 더 빠른 모델로 변경
          voice_settings: {
            stability: 0.35, // 더 불안정하게 해서 5살 아이의 자연스러운 느낌
            similarity_boost: 0.85, // 조금 낮춰서 더 변화무쌍하게
            style: 1.0, // 최대 감정적 표현력
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
        title: "API 키 필요해요!",
        description: "ElevenLabs API 키를 설정해주세요~",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPlaying(true);
      setIsPaused(false);
      
      toast({
        title: "🎀 5살 여아 목소리 만드는 중...",
        description: "진짜진짜 귀여운 목소리로 바꿔줄게! 빨리빨리!",
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
          title: "🎵 야호! 들어봐봐~",
          description: "5살 여자아이 목소리야! 진짜 귀엽지? 히히히~",
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "✨ 어땠어어땠어?",
          description: "진짜 귀여웠지? 또 들을래? 헤헤헤헷~",
        });
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        toast({
          title: "앗! 안 돼!",
          description: "괜찮아괜찮아! 다시 해볼게~ 걱정 마!",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "목소리 만들기 실패했어ㅠㅠ",
        description: "또 해볼게! 진짜 귀여운 목소리로 만들어줄게!",
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
          title: "🎵 다시 들어봐봐!",
          description: "계속 말해줄게~! 히히~",
        });
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 잠깐만!",
          description: "기다려줄게~ 언제든 다시 눌러봐!",
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

export default useElevenLabsTTS;
