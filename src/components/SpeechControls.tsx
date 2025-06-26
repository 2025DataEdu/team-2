
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Pause, Play } from 'lucide-react';
import VoiceSettings from './VoiceSettings';

interface SpeechControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  useElevenLabs?: boolean;
  onSpeak: () => void;
  onPauseResume: () => void;
  onStop: () => void;
  onSetApiKey?: (apiKey: string) => void;
  onUseBrowserTTS?: () => void;
}

const SpeechControls = ({
  isPlaying,
  isPaused,
  useElevenLabs = false,
  onSpeak,
  onPauseResume,
  onStop,
  onSetApiKey,
  onUseBrowserTTS,
}: SpeechControlsProps) => {
  return (
    <div className="flex gap-2 items-center">
      {onSetApiKey && onUseBrowserTTS && (
        <VoiceSettings
          onSetApiKey={onSetApiKey}
          onUseBrowserTTS={onUseBrowserTTS}
          useElevenLabs={useElevenLabs}
        />
      )}
      
      {!isPlaying ? (
        <Button
          onClick={onSpeak}
          variant="outline"
          className={`flex items-center gap-2 ${
            useElevenLabs 
              ? 'bg-purple-50 hover:bg-purple-100 border-purple-300'
              : 'bg-pink-50 hover:bg-pink-100 border-pink-300'
          }`}
        >
          <Volume2 className={`h-4 w-4 ${useElevenLabs ? 'text-purple-600' : 'text-pink-600'}`} />
          {useElevenLabs ? '🎤 아이유 목소리로 듣기' : '🎀 귀여운 목소리로 듣기'}
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
