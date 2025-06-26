
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Pause, Play } from 'lucide-react';

interface SpeechControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onSpeak: () => void;
  onPauseResume: () => void;
  onStop: () => void;
}

const SpeechControls = ({
  isPlaying,
  isPaused,
  onSpeak,
  onPauseResume,
  onStop,
}: SpeechControlsProps) => {
  return (
    <div className="flex gap-2">
      {!isPlaying ? (
        <Button
          onClick={onSpeak}
          variant="outline"
          className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 border-pink-300"
        >
          <Volume2 className="h-4 w-4 text-pink-600" />
          🎀 귀여운 목소리로 듣기
        </Button>
      ) : (
        <>
          <Button
            onClick={onPauseResume}
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
            onClick={onStop}
            variant="outline"
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-300"
          >
            중지
          </Button>
        </>
      )}
    </div>
  );
};

export default SpeechControls;
