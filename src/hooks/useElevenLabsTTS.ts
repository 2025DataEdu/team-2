
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useElevenLabsTTS = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = async (text: string, apiKey: string) => {
    try {
      // 어린 여자아이 목소리에 가까운 Charlotte 사용
      const voiceId = 'XB0fDUnXU5powFXDhCwa'; // Charlotte voice - 젊고 밝은 여성 목소리
      
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
            stability: 0.60, // 약간 불안정하게 해서 어린아이 느낌
            similarity_boost: 0.90, // 자연스러운 느낌
            style: 0.85, // 높은 감정적 표현력
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
        title: "🎀 귀여운 목소리 만드는 중...",
        description: "와! 진짜 귀여운 목소리로 바꿔줄게~!",
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
          title: "🎵 에헤헷! 들어봐~",
          description: "귀여운 목소리로 말해줄게!",
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "✨ 다 들었어?",
          description: "어땠어? 귀여웠지? 히히~",
        });
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        toast({
          title: "앗! 오류가 났어",
          description: "다시 해볼게! 걱정 마~",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "음성 만들기 실패했어ㅠㅠ",
        description: "API 키가 맞는지 확인해줘! 내가 도와줄게~",
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
          title: "🎵 다시 들어봐!",
          description: "계속 말해줄게~!",
        });
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 잠깐 멈춰!",
          description: "기다려줄게~ 언제든 다시 눌러!",
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
        description: "또 들려줄 거 있으면 말해줘~",
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
