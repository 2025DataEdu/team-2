
import React from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import PathBasicInfo from './PathBasicInfo';
import PathAmenities from './PathAmenities';
import SpeechControls from './SpeechControls';

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
  const { isPlaying, isPaused, speakText, pauseResumeSpeech, stopSpeech } = useSpeechSynthesis();

  const handleSpeakPathDescription = () => {
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
    
    speakText(textToSpeak);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-green-700">
            🎉 선택된 산책로
          </h2>
          <SpeechControls
            isPlaying={isPlaying}
            isPaused={isPaused}
            onSpeak={handleSpeakPathDescription}
            onPauseResume={pauseResumeSpeech}
            onStop={stopSpeech}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PathBasicInfo selectedPath={selectedPath} />
          <PathAmenities 
            amenities={selectedPath.amenities} 
            nearbyFood={selectedPath.nearbyFood} 
          />
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
