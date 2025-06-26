
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useElevenLabsTTS = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = async (text: string, apiKey: string) => {
    try {
      // 5살 여자아이에게 가장 적합한 목소리 - Lily 사용 (더 어리고 순수한 느낌)
      const voiceId = 'pFZP5JQG7iQjIQuC4Bku'; // Lily voice - 진짜 5살 여자아이 목소리
      
      // 5살 여자아이 목소리를 위한 한국어 프롬프트를 텍스트에 추가
      const enhancedText = `당신은 5살 여자아이입니다. 높고 부드럽고 귀여운 목소리로 말해주세요. 목소리는 순수하고 호기심 많고 장난스러워야 합니다 - 마치 처음 뭔가를 발견한 어린아이처럼요. 천천히 그리고 명확하게 말하되, 살짝 과장된 표현을 사용하세요. 자연스러운 어린아이 특유의 웃음소리나 의문문 끝의 올라가는 억양, 그리고 자연스러운 어린이 리듬을 추가해주세요. 발음은 진짜 어린 아이처럼 살짝 부정확하되, 여전히 알아들을 수 있게 해주세요. 다음 내용을 한국어로 말해주세요: ${text}`;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: enhancedText,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.25, // 더 불안정하게 해서 5살 아이의 천진난만함
            similarity_boost: 0.75, // 더 변화무쌍하게
            style: 1.0, // 최대 감정 표현
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
        title: "🎀 헤헷! 5살 여아 목소리 만드는 중...",
        description: "진짜진짜 귀여운 목소리로 바꿔줄게! 짠!",
      });

      const audioUrl = await generateSpeech(text, apiKey);
      
      // 기존 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.preload = 'auto';

      audio.onplay = () => {
        toast({
          title: "🎵 우와~ 들어봐!",
          description: "5살 여자아이 목소리쪄! 귀엽지? 헤헷!",
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "✨ 다 말했어~",
          description: "어땠어? 귀여웠지? 또 들을래? 짠!",
        });
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        toast({
          title: "앗! 안 돼!",
          description: "괜찮쪄~ 다시 해볼게! 걱정 마!",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "목소리 만들기 실패했어ㅠㅠ",
        description: "또 해볼게! 진짜 귀여운 목소리로 만들어줄게쪄!",
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
