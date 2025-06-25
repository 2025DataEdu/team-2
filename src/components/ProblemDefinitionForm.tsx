
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProblemData {
  targetUser: string;
  painPoint: string;
  tools: string;
  goals: string;
  currentMethod: string;
  points: string;
}

const ProblemDefinitionForm = () => {
  const [formData, setFormData] = useState<ProblemData>({
    targetUser: '',
    painPoint: '',
    tools: '',
    goals: '',
    currentMethod: '',
    points: ''
  });

  const handleInputChange = (field: keyof ProblemData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Problem Definition Data:', formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Badge variant="secondary" className="bg-purple-600 text-white px-4 py-2 text-sm font-medium">
          Template
        </Badge>
        <h1 className="text-2xl font-bold text-gray-900">문제정의 템플릿</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-gray-900 text-white">
          <div className="grid grid-cols-2 gap-4">
            <CardTitle className="text-lg">항목</CardTitle>
            <CardTitle className="text-lg">내용</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* 사용자 유형 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">사용자 유형</Label>
              </div>
              <div>
                <Input
                  placeholder="누구나 / 일반 시민"
                  value={formData.targetUser}
                  onChange={(e) => handleInputChange('targetUser', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* 발목 잡는 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">발목 잡는</Label>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="스마트폰으로 날씨, 미세먼지 확인"
                  value={formData.painPoint}
                  onChange={(e) => handleInputChange('painPoint', e.target.value)}
                  className="w-full mb-2"
                />
                <p className="text-sm text-gray-500">
                  지도 앱을 통해 공원이나 산책로 탐색<br/>
                  건기 앱(삼성 헬스, 나이키 런 클럽 등) 결합 수 기록<br/>
                  자주 가는 코스만 반복적으로 이용
                </p>
              </div>
            </div>

            {/* 도구/환경 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">도구/환경</Label>
              </div>
              <div>
                <Input
                  placeholder="ChatGPT, lovable & supabase"
                  value={formData.tools}
                  onChange={(e) => handleInputChange('tools', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* 구체 결핍 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">구체 결핍</Label>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="실천론에 대한 정성적 정보(중점, 준점도, 경사 등) 부족"
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  className="w-full mb-2"
                />
                <p className="text-sm text-gray-500">
                  현재 기분이나 건강 상태에 맞는 코스 추천 기능 부재<br/>
                  실시간 날씨/대기질과 연동된 코스 선택 기능 부족<br/>
                  주변 상체로 정보를 전문적으로 제공해주는 서비스 부재
                </p>
              </div>
            </div>

            {/* 현재 해결방식 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">현재 해결방식</Label>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="지도 앱으로 근처 산책로 검색"
                  value={formData.currentMethod}
                  onChange={(e) => handleInputChange('currentMethod', e.target.value)}
                  className="w-full mb-2"
                />
                <p className="text-sm text-gray-500">
                  커뮤니티 후기나 블로그를 통해 추천 코스 탐색<br/>
                  날씨 앱으로 미세먼지/기온 확인 후 산력 여부 판단
                </p>
              </div>
            </div>

            {/* AI개입 포인트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">AI개입 포인트</Label>
              </div>
              <div>
                <Input
                  placeholder="현재 환경(날씨, 습도, 일조량 등) 및 건강 정보(개인 운동능력) 기반으로 상체로 추천"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', e.target.value)}
                  className="w-full mb-2"
                />
                <p className="text-sm text-gray-500">
                  산력로 설명(역사, 식생, 주변여건 등)과 주변 환경(메점, 화장실 등) 제공(영상 시간, 관계 등을 종합 등)
                </p>
              </div>
            </div>

            <div className="p-6">
              <Button type="submit" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white">
                템플릿 저장하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemDefinitionForm;
