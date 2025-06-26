
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
  const { 
    isPlaying, 
    isPaused, 
    useElevenLabs,
    speakText, 
    pauseResumeSpeech, 
    stopSpeech
  } = useSpeechSynthesis();

  const handleSpeakPathDescription = () => {
    const textToSpeak = `
      골라진 산책길: ${selectedPath.name}!
      ${selectedPath.description}
      
      길이는 ${selectedPath.distance.toFixed(2)}킬로미터야! 
      걸리는 시간은 ${selectedPath.duration.toFixed(0)}분 정도야!
      칼로리는 ${(selectedPath.distance * 50).toFixed(0)}칼로리나 빠져! 대단하지?
      
      왜 골랐냐면~ ${selectedPath.recommendationReason}
      
      근처 편의시설은 ${selectedPath.amenities.join(', ')}가 있어!
      
      맛집으로는 ${selectedPath.nearbyFood.join(', ')}를 추천할게! 맛있을 거야~
      
      재밌게 산책하고 물 많이 마셔! 에헤헷~
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
            useElevenLabs={useElevenLabs}
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
            🌟 재밌게 산책해! 물 많이 마시는 거 잊지 마~ 에헤헷!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectedPathDetails;
