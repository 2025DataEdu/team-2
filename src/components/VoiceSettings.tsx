
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Mic } from 'lucide-react';

interface VoiceSettingsProps {
  onSetApiKey: (apiKey: string) => void;
  onUseBrowserTTS: () => void;
  useElevenLabs: boolean;
}

const VoiceSettings = ({ onSetApiKey, onUseBrowserTTS, useElevenLabs }: VoiceSettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSetApiKey(apiKey.trim());
      setShowSettings(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowSettings(!showSettings)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        음성 설정
      </Button>
      
      {showSettings && (
        <Card className="absolute top-12 right-0 w-80 z-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              음성 설정
            </CardTitle>
            <CardDescription>
              아이유 목소리를 사용하려면 ElevenLabs API 키가 필요해요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="apiKey">ElevenLabs API 키</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="API 키를 입력하세요"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                🎤 아이유 목소리 활성화
              </Button>
            </form>
            
            <div className="border-t pt-3">
              <Button 
                onClick={onUseBrowserTTS} 
                variant="outline" 
                className="w-full"
              >
                기본 음성 사용
              </Button>
            </div>
            
            {useElevenLabs && (
              <div className="text-sm text-green-600 text-center">
                ✅ 아이유 목소리 활성화됨
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceSettings;
