
import React, { useState, useEffect } from 'react';
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

  // 컴포넌트가 마운트될 때 자동으로 API 키 설정
  useEffect(() => {
    const elevenLabsApiKey = 'sk_bd4c994d18130506af1073635b71783520c7f5688ee9ecc1';
    onSetApiKey(elevenLabsApiKey);
    setApiKey(elevenLabsApiKey);
  }, [onSetApiKey]);

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
              현재 Anika 목소리를 사용하고 있습니다 - 자연스럽고 표현력 있는 여성 목소리에요!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="apiKey">ElevenLabs API 키</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="API 키를 입력해주세요"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                🎤 Anika 목소리 설정하기
              </Button>
            </form>
            
            <div className="border-t pt-3">
              <Button 
                onClick={onUseBrowserTTS} 
                variant="outline" 
                className="w-full"
              >
                기본 목소리 사용하기
              </Button>
            </div>
            
            {useElevenLabs && (
              <div className="text-sm text-green-600 text-center">
                ✅ Anika 목소리 준비 완료! 자연스럽고 표현력 있는 목소리로 들려드릴게요~
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceSettings;
