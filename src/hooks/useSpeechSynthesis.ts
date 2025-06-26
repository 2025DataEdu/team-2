
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useElevenLabsTTS } from './useElevenLabsTTS';

export const useSpeechSynthesis = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [useElevenLabs, setUseElevenLabs] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const elevenLabsTTS = useElevenLabsTTS();

  // ElevenLabs API 키 설정 함수
  const setApiKey = (apiKey: string) => {
    setElevenLabsApiKey(apiKey);
    setUseElevenLabs(true);
    toast({
      title: "🎀 와! 귀여운 목소리 준비됐어!",
      description: "이제 진짜 귀여운 목소리로 말해줄 수 있어! 에헤헷~",
    });
  };

  // 기본 브라우저 TTS로 전환
  const useBrowserTTS = () => {
    setUseElevenLabs(false);
    toast({
      title: "기본 목소리로 바꿨어!",
      description: "그래도 귀엽게 말해줄게~ 걱정 마!",
    });
  };

  const getOptimalVoice = () => {
    const voices = speechSynthesis.getVoices();
    
    // 어린 여자아이 목소리에 가까운 순서대로 정렬
    const preferredVoices = [
      // 한국어 여성 목소리들 (높은 톤)
      'Microsoft Heami',
      'Microsoft SunHi', 
      'Google 한국의',
      'Yuna',
      // 일본어 여성 목소리들 (어린 느낌)
      'Kyoko',
      'Otoya',
      'Hattori',
      // 영어 여성 목소리들 중 어린 톤
      'Samantha',
      'Victoria',
      'Alice',
      'Princess',
      'Kathy',
      'Zoe',
      'Karen'
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

  const transformToChildlikeText = (text: string) => {
    // 7살 여자아이 말투로 변환 - 더 귀엽고 자연스럽게
    let childText = text
      // 기본 존댓말을 친근한 반말로
      .replace(/안녕하세요/g, '안녕! 반가워~')
      .replace(/추천해드려요/g, '추천해줄게!')
      .replace(/확인하실 수 있어요/g, '확인해봐~')
      .replace(/산책하세요/g, '산책해!')
      .replace(/드릴게요/g, '줄게!')
      .replace(/해주세요/g, '해줘~')
      
      // 딱딱한 표현을 부드럽게
      .replace(/소요시간은/g, '걸리는 시간은')
      .replace(/칼로리입니다/g, '칼로리야!')
      .replace(/편의시설로는/g, '편의시설은')
      .replace(/맛집으로는/g, '맛집은')
      .replace(/선택된/g, '골라진')
      .replace(/산책로:/g, '산책길!')
      .replace(/이유:/g, '왜냐하면~')
      .replace(/거리는/g, '길이는')
      .replace(/예상/g, '아마')
      .replace(/주변/g, '근처')
      .replace(/있습니다/g, '있어!')
      .replace(/추천합니다/g, '추천해!')
      
      // 어미 변환 - 더 다양하고 귀엽게
      .replace(/습니다/g, '어~')
      .replace(/입니다/g, '야!')
      .replace(/해요/g, '해!')
      .replace(/이에요/g, '이야~')
      .replace(/예요/g, '야!')
      .replace(/니다/g, '어!');

    // 감탄사와 리듬감 추가
    const exclamations = ['우와~', '에헤헷!', '짱!', '오호호~', '야호~'];
    const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
    
    // 문장 시작에 감탄사 추가 (가끔)
    if (Math.random() > 0.7 && !childText.includes('안녕')) {
      childText = randomExclamation + ' ' + childText;
    }
    
    // 문장 끝에 귀여운 표현 추가
    if (!childText.includes('에헤헷') && !childText.includes('히히')) {
      const endings = ['에헤헷~', '히히~', '호호~', '우후후~'];
      const randomEnding = endings[Math.floor(Math.random() * endings.length)];
      if (Math.random() > 0.6) {
        childText = childText + ' ' + randomEnding;
      }
    }

    // 중요한 부분 강조
    childText = childText
      .replace(/([0-9]+)킬로미터/g, '$1킬로미터나!')
      .replace(/([0-9]+)분/g, '$1분이면 돼!')
      .replace(/([0-9]+)칼로리/g, '$1칼로리나 빠져! 대단하지?');

    // 문장에 자연스러운 쉼표와 감정 추가
    childText = childText
      .replace(/근처/g, '근처에는~ ')
      .replace(/맛집은/g, '맛집은~ ')
      .replace(/편의시설은/g, '편의시설은~ ')
      .replace(/왜냐하면~/g, '왜냐하면~ ');

    return childText;
  };

  const speakText = async (text: string) => {
    // 7살 여자아이 말투로 변환
    const childlikeText = transformToChildlikeText(text);

    // ElevenLabs 사용 시
    if (useElevenLabs && elevenLabsApiKey) {
      await elevenLabsTTS.speakText(childlikeText, elevenLabsApiKey);
      setIsPlaying(elevenLabsTTS.isPlaying);
      setIsPaused(elevenLabsTTS.isPaused);
      return;
    }

    // 기본 브라우저 TTS 사용
    if ('speechSynthesis' in window) {
      // 기존 음성이 재생 중이면 중지
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(childlikeText);
      
      // 목소리 로드 대기 후 설정
      const setVoiceAndSpeak = () => {
        const optimalVoice = getOptimalVoice();
        if (optimalVoice) {
          utterance.voice = optimalVoice;
        }
        
        utterance.lang = 'ko-KR';
        utterance.rate = 0.85; // 조금 느리게 (더 귀엽게)
        utterance.pitch = 1.9; // 매우 높은 톤 (7살 여자아이)
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
          toast({
            title: "🎀 에헤헷! 들어봐~",
            description: "귀여운 목소리로 말해줄게!",
          });
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          utteranceRef.current = null;
          toast({
            title: "🌸 다 말했어!",
            description: "어땠어? 귀여웠지? 히히~",
          });
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          setIsPlaying(false);
          setIsPaused(false);
          utteranceRef.current = null;
          toast({
            title: "😅 앗! 뭔가 잘못됐어",
            description: "다시 해볼게! 걱정 마~",
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
    if (useElevenLabs) {
      elevenLabsTTS.pauseResumeSpeech();
      setIsPlaying(elevenLabsTTS.isPlaying);
      setIsPaused(elevenLabsTTS.isPaused);
      return;
    }

    if ('speechSynthesis' in window) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        toast({
          title: "🎵 다시 들어봐!",
          description: "계속 말해줄게~",
        });
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 잠깐 멈춰!",
          description: "기다려줄게~ 언제든 다시 눌러!",
        });
      }
    }
  };

  const stopSpeech = () => {
    if (useElevenLabs) {
      elevenLabsTTS.stopSpeech();
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
      toast({
        title: "🛑 그만 말할게!",
        description: "또 들려줄 거 있으면 말해줘~",
      });
    }
  };

  return {
    isPlaying: useElevenLabs ? elevenLabsTTS.isPlaying : isPlaying,
    isPaused: useElevenLabs ? elevenLabsTTS.isPaused : isPaused,
    useElevenLabs,
    speakText,
    pauseResumeSpeech,
    stopSpeech,
    setApiKey,
    useBrowserTTS,
  };
};
