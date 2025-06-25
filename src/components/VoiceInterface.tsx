
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
      speakText('안녕하세요! 문제정의 템플릿 작성을 도와드리겠습니다.');
    } else if (transcript.includes('도움말') || transcript.includes('도움')) {
      speakText('각 항목에 대해 설명해드릴까요? 사용자 유형, 발목 잡는 부분, 도구와 환경, 구체적 결핍, 현재 해결방식, AI 개입 포인트에 대해 물어보세요.');
    } else if (transcript.includes('사용자')) {
      speakText('사용자 유형은 이 서비스를 사용할 대상을 명확히 정의하는 항목입니다.');
    } else if (transcript.includes('발목')) {
      speakText('발목 잡는 부분은 현재 사용자가 겪고 있는 주요 문제점들을 설명하는 항목입니다.');
    } else if (transcript.includes('완료') || transcript.includes('저장')) {
      speakText('템플릿이 저장되었습니다. 수고하셨습니다!');
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
        <div className="bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <Badge variant="outline" className="mb-2">음성 인식 결과</Badge>
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
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? '🛑' : '🎤'}
        </Button>
        
        <Button
          onClick={() => speakText('음성 도우미가 활성화되었습니다. 무엇을 도와드릴까요?')}
          variant="outline"
          className="rounded-full w-14 h-14"
        >
          🔊
        </Button>
      </div>
    </div>
  );
};

export default VoiceInterface;
