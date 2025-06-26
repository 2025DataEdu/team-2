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
      
      // 5살 여자아이 목소리를 위한 프롬프트를 텍스트에 추가
      const enhancedText = `Please generate speech in the voice of a 5-year-old girl. Her voice should be high-pitched, soft, and cheerful. The tone should be innocent, curious, and playful—like a child discovering something for the first time. Speak slowly and clearly, with slightly exaggerated expressions. Add subtle giggles, rising intonation at the end of questions, and natural childlike rhythm. The pronunciation should be slightly imperfect, as a real young child might speak, but still understandable. Here's what to say: ${text}`;
      
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
