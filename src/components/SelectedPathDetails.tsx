
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
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
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        toast({
          title: "음성 재생 시작",
          description: "선택된 산책로 정보를 음성으로 들려드립니다.",
        });
      };

      utterance.onend = () => {
        toast({
          title: "음성 재생 완료",
          description: "산책로 정보 음성 재생이 완료되었습니다.",
        });
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        toast({
          title: "음성 재생 오류",
          description: "음성 재생 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      };

      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "음성 재생 미지원",
        description: "이 브라우저는 음성 재생을 지원하지 않습니다.",
        variant: "destructive",
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
          <Button
            onClick={speakPathDescription}
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-300"
          >
            <Volume2 className="h-4 w-4 text-blue-600" />
            음성으로 듣기
          </Button>
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
