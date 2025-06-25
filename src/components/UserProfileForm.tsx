
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface UserProfileFormProps {
  onProfileSubmit: (profile: UserProfile) => void;
}

const UserProfileForm = ({ onProfileSubmit }: UserProfileFormProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    fitnessLevel: '',
    preferredDistance: [2],
    healthConditions: '',
    walkingGoal: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fitnessLevel || !profile.walkingGoal) {
      toast({
        title: "필수 정보 누락",
        description: "체력 수준과 산책 목표를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }
    onProfileSubmit(profile);
    toast({
      title: "프로필 저장 완료",
      description: "맞춤형 산책로를 추천해드리겠습니다.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-green-700">
          개인 건강 정보 입력
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="age">나이</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                min="10"
                max="100"
              />
            </div>
            
            <div>
              <Label htmlFor="fitnessLevel">체력 수준</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, fitnessLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="체력 수준을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">초급 (평소 운동 안함)</SelectItem>
                  <SelectItem value="intermediate">중급 (가끔 운동함)</SelectItem>
                  <SelectItem value="advanced">고급 (정기적으로 운동함)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>선호 산책 거리: {profile.preferredDistance[0]}km</Label>
            <Slider
              value={profile.preferredDistance}
              onValueChange={(value) => setProfile(prev => ({ ...prev, preferredDistance: value }))}
              max={10}
              min={0.5}
              step={0.5}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="walkingGoal">산책 목표</Label>
            <Select onValueChange={(value) => setProfile(prev => ({ ...prev, walkingGoal: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="산책 목표를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">건강 증진</SelectItem>
                <SelectItem value="weight">체중 관리</SelectItem>
                <SelectItem value="stress">스트레스 해소</SelectItem>
                <SelectItem value="leisure">여가 활동</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="healthConditions">건강 상태 (선택사항)</Label>
            <Input
              id="healthConditions"
              placeholder="예: 무릎 통증, 고혈압 등"
              value={profile.healthConditions}
              onChange={(e) => setProfile(prev => ({ ...prev, healthConditions: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            맞춤형 산책로 추천받기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
