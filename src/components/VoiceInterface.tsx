
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ko-KR';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "음성 인식 오류",
          description: "음성 인식 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "음성 인식 미지원",
        description: "이 브라우저는 음성 인식을 지원하지 않습니다.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript('');
      recognition.start();
      toast({
        title: "음성 인식 시작",
        description: "말씀하세요...",
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = () => {
    if (transcript.includes('안녕') || transcript.includes('반가워')) {
      speakText('안녕하세요! AI 맞춤형 산책길 추천 서비스입니다. 어떤 도움이 필요하신가요?');
    } else if (transcript.includes('도움말') || transcript.includes('도움')) {
      speakText('산책길 추천 서비스의 문제정의 템플릿 작성을 도와드리겠습니다. 사용자 유형, 현재 문제점, 개발 도구, 부족한 기능, 현재 해결방식, AI 개입 포인트에 대해 물어보세요.');
    } else if (transcript.includes('사용자')) {
      speakText('사용자 유형은 이 산책길 추천 서비스를 사용할 대상을 명확히 정의하는 항목입니다. 누구나 이용할 수 있는 일반 시민을 대상으로 합니다.');
    } else if (transcript.includes('발목') || transcript.includes('문제')) {
      speakText('발목 잡는 부분은 현재 사용자가 산책을 할 때 겪고 있는 주요 문제점들을 설명합니다. 날씨 확인, 코스 탐색의 어려움 등이 있습니다.');
    } else if (transcript.includes('도구') || transcript.includes('기술')) {
      speakText('개발 도구와 환경은 이 서비스를 만들기 위해 사용할 기술들입니다. ChatGPT, Lovable, Supabase 등을 활용합니다.');
    } else if (transcript.includes('결핍') || transcript.includes('부족')) {
      speakText('구체적 결핍은 현재 산책로 정보에서 부족한 부분들입니다. 난이도, 경사도, 개인 맞춤 추천 등이 부족합니다.');
    } else if (transcript.includes('해결') || transcript.includes('방식')) {
      speakText('현재 해결방식은 사람들이 지금 산책로를 찾는 방법들입니다. 지도 앱 검색, 블로그 후기 확인 등을 사용합니다.');
    } else if (transcript.includes('AI') || transcript.includes('인공지능')) {
      speakText('AI 개입 포인트는 인공지능이 제공할 핵심 가치입니다. 실시간 환경 정보와 개인 건강 데이터를 바탕으로 맞춤형 산책로를 추천합니다.');
    } else if (transcript.includes('완료') || transcript.includes('저장')) {
      speakText('산책길 추천 서비스 템플릿이 저장되었습니다. 수고하셨습니다!');
    } else if (transcript.includes('산책') || transcript.includes('추천')) {
      speakText('이 서비스는 개인별 건강 상태와 실시간 환경 정보를 분석하여 가장 적합한 산책로를 추천해드립니다.');
    }
  };

  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceCommand();
    }
  }, [transcript, isListening]);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
      {transcript && (
        <div className="bg-white rounded-lg shadow-lg p-3 max-w-xs border-l-4 border-green-400">
          <Badge variant="outline" className="mb-2 text-green-700 border-green-300">음성 인식 결과</Badge>
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? "destructive" : "default"}
          className={`rounded-full w-14 h-14 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isListening ? '🛑' : '🎤'}
        </Button>
        
        <Button
          onClick={() => speakText('AI 맞춤형 산책길 추천 서비스의 음성 도우미가 활성화되었습니다. 무엇을 도와드릴까요?')}
          variant="outline"
          className="rounded-full w-14 h-14 border-green-300 hover:bg-green-50"
        >
          🔊
        </Button>
      </div>
    </div>
  );
};

export default VoiceInterface;
