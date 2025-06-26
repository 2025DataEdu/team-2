
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
        목소리 설정
      </Button>
      
      {showSettings && (
        <Card className="absolute top-12 right-0 w-80 z-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              목소리 설정
            </CardTitle>
            <CardDescription>
              더 귀여운 목소리를 쓰려면 ElevenLabs API 키가 필요해요!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="apiKey">ElevenLabs API 키</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="API 키를 입력해주세요~"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                🎀 귀여운 목소리 켜기!
              </Button>
            </form>
            
            <div className="border-t pt-3">
              <Button 
                onClick={onUseBrowserTTS} 
                variant="outline" 
                className="w-full"
              >
                기본 목소리 쓰기
              </Button>
            </div>
            
            {useElevenLabs && (
              <div className="text-sm text-green-600 text-center">
                ✅ 귀여운 목소리 준비 완료! 에헤헷~
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceSettings;
