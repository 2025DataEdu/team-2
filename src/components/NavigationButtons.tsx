
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: string;
  onResetToRecommendations: () => void;
  onResetToProfile: () => void;
}

const NavigationButtons = ({ 
  currentStep, 
  onResetToRecommendations, 
  onResetToProfile 
}: NavigationButtonsProps) => {
  return (
    <div className="mb-6 flex gap-2">
      {currentStep === 'selected' && (
        <Button 
          onClick={onResetToRecommendations}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          다른 경로 보기
        </Button>
      )}
      <Button 
        onClick={onResetToProfile}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        새로운 분석 시작
      </Button>
    </div>
  );
};

export default NavigationButtons;
