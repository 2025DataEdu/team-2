
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const PromptDownloader = () => {
  const promptContent = `# AI 건강 맞춤형 산책로 추천 앱 생성 프롬프트

## 프로젝트 개요
건강 정보와 위치 기반으로 개인화된 산책로를 추천하는 웹 애플리케이션을 개발합니다.

## 핵심 기능

### 1. 건강 프로필 관리
- 사용자 기본 정보 (나이, 성별, 체중, 신장)
- 건강 상태 정보 (혈압, 심박수, 진단 질병)
- 운동 습관 및 목표 설정
- 운동 강도 및 속도 맞춤 추천

### 2. 위치 기반 서비스
- 현재 위치 자동 감지
- 날씨 정보 연동
- 주변 산책로 검색 및 추천
- 거리별 난이도 필터링

### 3. AI 기반 맞춤 추천
- 건강 상태에 따른 운동 강도 계산
- 개인별 심박수 목표 범위 설정
- 걷기/조깅 속도 가이드 제공
- 질병별 운동 주의사항 안내

### 4. 산책로 정보 관리
- 경로별 상세 정보 (거리, 소요시간, 고도, 난이도)
- 편의시설 및 주변 음식점 정보
- 사용자 평점 및 리뷰 시스템
- 즐겨찾기 및 히스토리 관리

## 데이터베이스 스키마

### health_profiles 테이블
\`\`\`sql
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  이름 TEXT,
  나이 INTEGER,
  성별 TEXT,
  체중 DECIMAL,
  신장 DECIMAL,
  수축기_혈압 INTEGER,
  이완기_혈압 INTEGER,
  안정시_심박수 INTEGER,
  운동_빈도 INTEGER,
  진단_질병 TEXT,
  복용_약물 TEXT,
  운동_목표 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### walking_paths 테이블
\`\`\`sql
CREATE TABLE walking_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  distance DECIMAL NOT NULL,
  duration INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  elevation INTEGER,
  start_latitude DECIMAL,
  start_longitude DECIMAL,
  end_latitude DECIMAL,
  end_longitude DECIMAL,
  features TEXT[],
  amenities TEXT[],
  rating DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 주요 컴포넌트 구조

### 1. 사용자 인터페이스
- \`HealthProfileForm\`: 건강 정보 입력 폼
- \`LocationInfo\`: 현재 위치 및 날씨 정보
- \`PathRecommendations\`: AI 추천 산책로 목록
- \`PathDetailModal\`: 산책로 상세 정보 모달
- \`WalkingGuide\`: 맞춤형 운동 가이드

### 2. 비즈니스 로직
- \`exerciseRecommendation.ts\`: 운동 강도 계산 유틸리티
- \`healthAnalysis.ts\`: 건강 상태 분석 로직
- \`pathMatching.ts\`: 산책로 매칭 알고리즘

### 3. 데이터 훅스
- \`useHealthProfile\`: 건강 프로필 관리
- \`useLocation\`: 위치 정보 관리
- \`usePathRecommendations\`: 산책로 추천 로직
- \`useWeatherData\`: 날씨 정보 연동

## 기술 스택
- Frontend: React + TypeScript + Tailwind CSS
- UI Components: Shadcn/ui
- Backend: Supabase (인증, 데이터베이스, API)
- 상태 관리: TanStack Query
- 위치 서비스: Geolocation API
- 날씨 API: OpenWeatherMap
- 지도: Leaflet

## 개발 우선순위
1. 건강 프로필 기본 CRUD 구현
2. 위치 기반 산책로 데이터 연동
3. AI 추천 알고리즘 개발
4. 사용자 인터페이스 완성
5. 성능 최적화 및 테스트

## 보안 및 개인정보 보호
- Row Level Security (RLS) 정책 적용
- 건강 정보 암호화 저장
- GDPR 준수 개인정보 처리 방침
- 사용자 동의 기반 데이터 수집

## 접근성 및 사용성
- 반응형 디자인 (모바일 우선)
- 한국어 인터페이스
- 시각적 피드백 및 로딩 상태
- 오프라인 기본 기능 지원

이 프롬프트를 바탕으로 건강 중심의 개인화된 산책로 추천 애플리케이션을 개발해주세요.`;

  const downloadPrompt = () => {
    const blob = new Blob([promptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI_건강_산책로_추천앱_프롬프트.txt';
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
            📝 AI 프롬프트 다운로드
          </h3>
          <p className="text-gray-600 text-sm">
            이 앱을 생성한 AI 프롬프트를 텍스트 파일로 다운로드할 수 있습니다.
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
