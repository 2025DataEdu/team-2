
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const PromptDownloader = () => {
  const promptContent = `# AI 건강 맞춤형 산책로 추천 앱 생성 프롬프트

## 프로젝트 개요
건강 정보와 위치 기반으로 개인화된 산책로를 추천하는 웹 애플리케이션을 개발합니다. 
사용자의 나이, 체력 수준, 건강 상태, 운동 목표를 분석하여 AI가 맞춤형 산책로를 추천합니다.

## 핵심 기능

### 1. 건강 프로필 관리
- 사용자 기본 정보 (나이, 체력 수준, 선호 거리)
- 건강 상태 정보 (무릎 통증, 고혈압 등)
- 운동 목표 설정 (건강 증진, 체중 관리, 스트레스 해소, 여가 활동)
- 자동 프로필 생성 및 수동 편집 기능

### 2. 위치 기반 서비스  
- 현재 위치 자동 감지 (useLocation 훅)
- 위치 기반 접근성 고려
- 주변 산책로 검색 및 추천
- 거리별 난이도 필터링

### 3. AI 기반 맞춤 추천
- 건강 상태에 따른 운동 강도 계산
- 개인별 심박수 목표 범위 설정 (getWalkingSpeed 유틸리티)
- 걷기/조깅 속도 가이드 제공
- 질병별 운동 주의사항 반영 (무릎 통증 시 경사 제한 등)
- 운동 목표에 따른 맞춤형 추천 이유 생성

### 4. 산책로 정보 관리
- 경로별 상세 정보 (거리, 소요시간, 고도, 난이도)
- 편의시설 정보 (화장실, 편의점, 카페, 주차장)
- 주변 음식점 및 디저트 정보
- 지도 시각화 (Leaflet 기반 SmallMap)
- 실시간 경로 표시 및 상세 정보 모달

### 5. 사용자 인터페이스
- 로딩 스크린 및 단계별 네비게이션
- 음성 인터페이스 (VoiceInterface)
- 난이도 필터 팝오버 (DifficultyPopover)
- 반응형 디자인 및 한국어 인터페이스
- 런닝하는 사람 배경 이미지

## 주요 컴포넌트 구조

### 1. 페이지 컴포넌트
- \`Index.tsx\`: 메인 페이지, 상태 관리 및 단계 제어
- \`LoadingScreen\`: 로딩 화면
- \`NotFound\`: 404 페이지

### 2. 핵심 기능 컴포넌트
- \`WalkingPathRecommendations\`: AI 추천 산책로 목록
- \`AIRecommendedPathGrid\`: AI 추천 경로 그리드
- \`SelectedPathDetails\`: 선택된 경로 상세 정보
- \`PathDetailModal\`: 경로 상세 정보 모달
- \`SmallMap\`: 지도 컴포넌트 (Leaflet)

### 3. 사용자 인터페이스
- \`AppHeader\`: 앱 헤더
- \`NavigationButtons\`: 네비게이션 버튼
- \`InfoCards\`: 사용자 정보 카드
- \`AIAnalysisCard\`: AI 분석 결과 표시
- \`VoiceInterface\`: 음성 인터페이스
- \`DifficultyPopover\`: 난이도 선택 팝오버

### 4. 유틸리티 및 훅스
- \`useLocation\`: 위치 정보 관리
- \`useAIRecommendedPaths\`: AI 추천 경로 관리
- \`useHealthProfile\`: 건강 프로필 관리
- \`exerciseRecommendation.ts\`: 운동 강도 계산
- \`walkingPathGenerator.ts\`: 산책로 생성 유틸리티

## 데이터 구조

### UserProfile 인터페이스
\`\`\`typescript
interface UserProfile {
  age: number;
  fitnessLevel: string; // 'beginner' | 'intermediate' | 'advanced'
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string; // 'health' | 'weight' | 'stress' | 'leisure'
}
\`\`\`

### WalkingPath 인터페이스
\`\`\`typescript
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
\`\`\`

## 기술 스택
- Frontend: React + TypeScript + Tailwind CSS
- UI Components: Shadcn/ui
- 상태 관리: TanStack Query
- 지도: Leaflet
- 위치 서비스: Geolocation API
- 라우팅: React Router DOM
- 아이콘: Lucide React
- 빌드 도구: Vite

## AI 추천 로직
1. 사용자 프로필 분석 (나이, 체력, 건강상태, 목표)
2. 건강 상태에 따른 경로 필터링 (무릎 통증 시 경사 제한)
3. 체력 수준에 따른 난이도 조정
4. 운동 목표별 맞춤형 추천 이유 생성
5. 위치 기반 접근성 고려
6. 개인별 운동 강도 및 심박수 가이드 제공

## 주요 기능 흐름
1. 앱 로딩 → 자동 프로필 생성 또는 수동 입력
2. 현재 위치 감지 및 AI 분석
3. 맞춤형 산책로 추천 표시
4. 난이도 필터링 및 경로 선택
5. 상세 정보 모달 및 지도 표시
6. 음성 인터페이스 및 추가 기능

## 접근성 및 사용성
- 반응형 디자인 (모바일 우선)
- 한국어 인터페이스
- 시각적 피드백 및 로딩 상태
- 음성 인터페이스 지원
- 직관적인 네비게이션

## 개발 우선순위
1. 건강 프로필 및 AI 추천 시스템 구현 ✅
2. 위치 기반 서비스 연동 ✅
3. 지도 및 경로 시각화 ✅  
4. 사용자 인터페이스 완성 ✅
5. 음성 인터페이스 및 고급 기능 ✅
6. 성능 최적화 및 테스트

이 프롬프트를 바탕으로 건강 중심의 개인화된 AI 산책로 추천 애플리케이션을 개발해주세요.`;

  const downloadPrompt = () => {
    const blob = new Blob([promptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI_건강_산책로_추천앱_프롬프트_v2.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📝 AI 프롬프트 다운로드 (최신 버전)
          </h3>
          <p className="text-gray-600 text-sm">
            현재 앱의 모든 기능과 구조를 반영한 최신 AI 프롬프트를 다운로드할 수 있습니다.
          </p>
        </div>
        <Button 
          onClick={downloadPrompt}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          프롬프트 다운로드
        </Button>
      </div>
    </div>
  );
};

export default PromptDownloader;
