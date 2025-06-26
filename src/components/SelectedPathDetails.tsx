
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalkingPath {
  id: string;
  name: string;
  distance: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  elevation: number;
  rating: number;
  features: string[];
  description: string;
  amenities: string[];
  recommendationReason: string;
  nearbyFood: string[];
}

interface SelectedPathDetailsProps {
  selectedPath: WalkingPath;
}

const SelectedPathDetails = ({ selectedPath }: SelectedPathDetailsProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getOptimalVoice = () => {
    const voices = speechSynthesis.getVoices();
    
    // 한국어 여성 목소리 우선순위
    const preferredVoices = [
      'Google 한국의', // Google Korean female
      'Microsoft Heami - Korean (Korea)',
      'Microsoft SunHi - Korean (Korea)', 
      'Yuna', // Apple Korean female
      'Kyoko', // Japanese female (fallback)
      'Samantha', // English female (fallback)
    ];

    // 우선순위에 따라 목소리 찾기
    for (const preferredName of preferredVoices) {
      const voice = voices.find(v => 
        v.name.includes(preferredName) || 
        (v.lang.includes('ko') && v.name.toLowerCase().includes('female'))
      );
      if (voice) return voice;
    }

    // 한국어 목소리 중 아무거나
    const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koreanVoice) return koreanVoice;

    // 여성 목소리 중 아무거나
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('girl')
    );
    if (femaleVoice) return femaleVoice;

    return voices[0]; // 기본 목소리
  };

  const speakPathDescription = () => {
    if ('speechSynthesis' in window) {
      // 기존 음성이 재생 중이면 중지
      speechSynthesis.cancel();
      
      // 읽을 텍스트 구성
      const textToSpeak = `
        선택된 산책로: ${selectedPath.name}.
        ${selectedPath.description}
        
        거리는 ${selectedPath.distance.toFixed(2)}킬로미터이고, 
        예상 소요시간은 ${selectedPath.duration.toFixed(0)}분입니다.
        예상 칼로리 소모량은 ${(selectedPath.distance * 50).toFixed(0)}칼로리입니다.
        
        선택 이유: ${selectedPath.recommendationReason}
        
        주변 편의시설로는 ${selectedPath.amenities.join(', ')}이 있습니다.
        
        근처 맛집으로는 ${selectedPath.nearbyFood.join(', ')}을 추천합니다.
        
        즐거운 산책 되세요!
      `;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // 귀여운 여자아이 목소리 설정
      const optimalVoice = getOptimalVoice();
      if (optimalVoice) {
        utterance.voice = optimalVoice;
      }
      
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9; // 조금 더 빠르게 (귀여운 느낌)
      utterance.pitch = 1.2; // 높은 톤 (귀여운 목소리)
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        toast({
          title: "🎀 귀여운 음성 재생 시작",
          description: "선택된 산책로 정보를 귀여운 목소리로 들려드려요!",
        });
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        toast({
          title: "🌸 음성 재생 완료",
          description: "산책로 정보 음성 재생이 완료되었어요!",
        });
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        toast({
          title: "😅 음성 재생 오류",
          description: "음성 재생 중 오류가 발생했어요.",
          variant: "destructive",
        });
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "음성 재생 미지원",
        description: "이 브라우저는 음성 재생을 지원하지 않습니다.",
        variant: "destructive",
      });
    }
  };

  const pauseResumeSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        toast({
          title: "🎵 음성 재생 재개",
          description: "음성 재생을 다시 시작해요!",
        });
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
        toast({
          title: "⏸️ 음성 재생 일시정지",
          description: "음성 재생을 잠시 멈췄어요.",
        });
      }
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
      toast({
        title: "🛑 음성 재생 중지",
        description: "음성 재생을 중지했어요.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-green-700">
            🎉 선택된 산책로
          </h2>
          <div className="flex gap-2">
            {!isPlaying ? (
              <Button
                onClick={speakPathDescription}
                variant="outline"
                className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 border-pink-300"
              >
                <Volume2 className="h-4 w-4 text-pink-600" />
                🎀 귀여운 목소리로 듣기
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseResumeSpeech}
                  variant="outline"
                  className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-300"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 text-yellow-600" />
                      재개
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 text-yellow-600" />
                      일시정지
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopSpeech}
                  variant="outline"
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-300"
                >
                  중지
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{selectedPath.name}</h3>
            <p className="text-gray-600 mb-4">{selectedPath.description}</p>
            
            {/* 추천 이유 표시 */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-400">
              <h4 className="text-sm font-medium text-blue-800 mb-1">💡 선택 이유</h4>
              <p className="text-sm text-blue-700">{selectedPath.recommendationReason}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>거리:</span>
                <span className="font-medium">{selectedPath.distance.toFixed(2)}km</span>
              </div>
              <div className="flex justify-between">
                <span>예상 시간:</span>
                <span className="font-medium">{selectedPath.duration.toFixed(0)}분</span>
              </div>
              <div className="flex justify-between">
                <span>예상 칼로리:</span>
                <span className="font-medium">{(selectedPath.distance * 50).toFixed(0)}kcal</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">주변 편의시설</h4>
            <div className="flex gap-2 flex-wrap mb-4">
              {selectedPath.amenities.map((amenity, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {amenity}
                </span>
              ))}
            </div>
            
            <h4 className="font-semibold mb-2">🍰 근처 맛집 & 디저트</h4>
            <div className="flex gap-2 flex-wrap">
              {selectedPath.nearbyFood.map((food, index) => (
                <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 text-center">
            🌟 즐거운 산책 되세요! 안전한 산책을 위해 충분한 수분 섭취를 잊지 마세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectedPathDetails;
