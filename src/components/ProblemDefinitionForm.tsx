
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

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
    targetUser: '누구나 / 일반 시민',
    painPoint: '스마트폰으로 날씨, 미세먼지 확인',
    tools: 'ChatGPT, Lovable & Supabase',
    goals: '산책로에 대한 정성적 정보(난이도, 경사도, 거리 등) 부족',
    currentMethod: '지도 앱으로 근처 산책로 검색',
    points: '현재 환경(날씨, 습도, 일조량 등) 및 건강 정보(개인 운동능력) 기반으로 산책로 추천'
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
        <Badge variant="secondary" className="bg-green-600 text-white px-4 py-2 text-sm font-medium">
          산책길 추천 서비스
        </Badge>
        <h1 className="text-2xl font-bold text-gray-900">문제정의 템플릿</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-green-800 text-white">
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
                <p className="text-sm text-gray-500 mt-1">서비스를 이용할 대상층</p>
              </div>
              <div>
                <Textarea
                  placeholder="누구나 / 일반 시민"
                  value={formData.targetUser}
                  onChange={(e) => handleInputChange('targetUser', e.target.value)}
                  className="w-full resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* 발목 잡는 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">발목 잡는</Label>
                <p className="text-sm text-gray-500 mt-1">현재 사용자가 겪는 문제점</p>
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="스마트폰으로 날씨, 미세먼지 확인"
                  value={formData.painPoint}
                  onChange={(e) => handleInputChange('painPoint', e.target.value)}
                  className="w-full resize-none"
                  rows={3}
                />
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    • 지도 앱을 통해 공원이나 산책로 탐색<br/>
                    • 건강 앱(삼성 헬스, 나이키 런 클럽 등) 운동 기록<br/>
                    • 자주 가는 코스만 반복적으로 이용<br/>
                    • 날씨와 개인 컨디션을 고려한 맞춤 추천 부재
                  </p>
                </div>
              </div>
            </div>

            {/* 도구/환경 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">도구/환경</Label>
                <p className="text-sm text-gray-500 mt-1">개발에 사용할 기술 스택</p>
              </div>
              <div>
                <Input
                  placeholder="ChatGPT, Lovable & Supabase"
                  value={formData.tools}
                  onChange={(e) => handleInputChange('tools', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* 구체적 결핍 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">구체적 결핍</Label>
                <p className="text-sm text-gray-500 mt-1">현재 부족한 정보나 기능</p>
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="산책로에 대한 정성적 정보(난이도, 경사도, 거리 등) 부족"
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  className="w-full resize-none"
                  rows={3}
                />
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    • 현재 기분이나 건강 상태에 맞는 코스 추천 기능 부재<br/>
                    • 실시간 날씨/대기질과 연동된 코스 선택 기능 부족<br/>
                    • 주변 편의시설 정보를 전문적으로 제공해주는 서비스 부재<br/>
                    • 개인별 운동 능력과 목표에 맞는 맞춤형 추천 부족
                  </p>
                </div>
              </div>
            </div>

            {/* 현재 해결방식 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">현재 해결방식</Label>
                <p className="text-sm text-gray-500 mt-1">사용자들이 현재 사용하는 방법</p>
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="지도 앱으로 근처 산책로 검색"
                  value={formData.currentMethod}
                  onChange={(e) => handleInputChange('currentMethod', e.target.value)}
                  className="w-full resize-none"
                  rows={3}
                />
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    • 커뮤니티 후기나 블로그를 통해 추천 코스 탐색<br/>
                    • 날씨 앱으로 미세먼지/기온 확인 후 산책 여부 판단<br/>
                    • 지인 추천이나 SNS를 통한 정보 수집<br/>
                    • 직접 방문하여 시행착오를 통한 코스 발견
                  </p>
                </div>
              </div>
            </div>

            {/* AI개입 포인트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <Label className="text-base font-medium text-gray-700">AI개입 포인트</Label>
                <p className="text-sm text-gray-500 mt-1">AI가 제공할 핵심 가치</p>
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="현재 환경(날씨, 습도, 일조량 등) 및 건강 정보(개인 운동능력) 기반으로 산책로 추천"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', e.target.value)}
                  className="w-full resize-none"
                  rows={4}
                />
                <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-400">
                  <p className="text-sm text-green-800 leading-relaxed">
                    <strong>핵심 AI 기능:</strong><br/>
                    • 실시간 날씨/대기질 데이터와 개인 건강정보 매칭<br/>
                    • 산책로 난이도, 거리, 경사도 분석 및 개인별 맞춤 추천<br/>
                    • 주변 편의시설(휴게소, 화장실, 카페 등) 정보 제공<br/>
                    • 산책로 특색(역사, 풍경, 계절별 볼거리) 설명<br/>
                    • 개인 운동 목표와 체력 수준에 따른 최적 코스 제안
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3">
                  템플릿 저장하기
                </Button>
                <Button type="button" variant="outline" className="flex-1 py-3">
                  초기화
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 서비스 목표</h3>
        <p className="text-gray-700 leading-relaxed">
          개인별 건강 상태, 운동 능력, 그리고 실시간 환경 정보를 종합하여 
          <span className="font-semibold text-green-600"> 가장 적합한 산책로를 추천</span>하는 
          AI 기반 맞춤형 산책길 안내 서비스를 구축합니다.
        </p>
      </div>
    </div>
  );
};

export default ProblemDefinitionForm;
