import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Database, Loader2, FileArchive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';

const PromptDownloader = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingSource, setIsDownloadingSource] = useState(false);

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
- \`useRealPathData\`: 실제 산책로 데이터 관리
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

## Supabase 데이터베이스 스키마

### 건강정보 테이블
실제 사용자의 건강 데이터를 저장하는 테이블입니다.

\`\`\`sql
TABLE: 건강정보
COLUMNS:
- ID (bigint, Primary Key): 고유 식별자
- 이름 (text): 사용자 이름
- 나이 (bigint): 나이
- 성별 (text): 성별
- 체중(kg) (double precision): 체중
- 신장(cm) (double precision): 신장
- 수축기 혈압 (bigint): 수축기 혈압 수치
- 이완기 혈압 (bigint): 이완기 혈압 수치
- 혈당(mg/dL) (bigint): 혈당 수치
- 총콜레스테롤(mg/dL) (bigint): 총 콜레스테롤 수치
- 진단 질병 (text): 진단받은 질병 정보
- 운동 빈도(회/주) (text): 주간 운동 빈도
- 음주 빈도(회/주) (text): 주간 음주 빈도
- 흡연 여부 (text): 흡연 상태
- 혈액형 (text): 혈액형
\`\`\`

### 내주변산책로 테이블
실제 산책로 위치 및 정보를 저장하는 테이블입니다.

\`\`\`sql
TABLE: 내주변산책로
COLUMNS:
- CoursCode (text, Primary Key): 산책로 코드
- CoursName (text): 산책로 이름
- CorusDetailName (text): 산책로 상세 이름
- Address (text): 주소
- CoursLength (text): 코스 길이 (문자열)
- CoursDetailLength (double precision): 상세 코스 길이 (숫자)
- CoursTime (text): 예상 소요 시간
- CoursLv (text): 코스 난이도 레벨
- CoursRoute (text): 코스 경로 설명
- Latitude (double precision): 위도
- Longitude (double precision): 경도
- ADIT_DC (text): 추가 설명
- Option (text): 옵션 정보
- Toilet (text): 화장실 정보
- SIGNGU_NM (text): 시군구 이름
- CVNTL_NM (text): 편의시설 이름
\`\`\`

### 전통시장현황 테이블
주변 전통시장 정보를 저장하는 테이블입니다.

\`\`\`sql
TABLE: 전통시장현황
COLUMNS:
- 코드 (text, Primary Key): 시장 고유 코드
- 시장명 (text): 시장 이름
- 시장유형 (text): 시장 유형
- 시도 (text): 시도
- 시군구 (text): 시군구
- 도로명주소 (text): 도로명 주소
- 지번주소 (text): 지번 주소
- 정제도로명주소 (text): 정제된 도로명 주소
- 정제지번주소 (text): 정제된 지번 주소
- 경위도X좌표 (double precision): X 좌표 (경도)
- 경위도Y좌표 (double precision): Y 좌표 (위도)
- PNU (text): 고유번호
- 시장코드 (text): 시장 코드

편의시설 정보:
- 아케이드보유여부 (text): 아케이드 보유 여부
- 엘리베이터_에스컬레이터_보유여부 (text): 엘리베이터/에스컬레이터 보유 여부
- 고객지원센터보유여부 (text): 고객지원센터 보유 여부
- 스프링쿨러보유여부 (text): 스프링쿨러 보유 여부
- 화재감지기보유여부 (text): 화재감지기 보유 여부
- 유아놀이방_보유여부 (text): 유아놀이방 보유 여부
- 종합콜센터_보유여부 (text): 종합콜센터 보유 여부
- 고객휴게실_보유여부 (text): 고객휴게실 보유 여부
- 수유센터_보유여부 (text): 수유센터 보유 여부
- 물품보관함_보유여부 (text): 물품보관함 보유 여부
- 자전거보관함_보유여부 (text): 자전거보관함 보유 여부
- 체육시설_보유여부 (text): 체육시설 보유 여부
- 간이_도서관_보유여부 (text): 간이도서관 보유 여부
- 쇼핑카트_보유여부 (text): 쇼핑카트 보유 여부
- 외국인_안내센터_보유여부 (text): 외국인안내센터 보유 여부
- 고객동선통로_보유여부 (text): 고객동선통로 보유 여부
- 방송센터_보유여부 (text): 방송센터 보유 여부
- 문화교실_보유여부 (text): 문화교실 보유 여부
- 공동물류창고_보유여부 (text): 공동물류창고 보유 여부
- 시장전용고객주차장_보유여부 (text): 시장전용고객주차장 보유 여부
- 교육장_보유여부 (text): 교육장 보유 여부
- 회의실_보유여부 (text): 회의실 보유 여부
- 자동심장충격기_보유여부 (text): 자동심장충격기 보유 여부
\`\`\`

## Supabase 클라이언트 설정
\`\`\`typescript
// Supabase 프로젝트 정보
PROJECT_ID: mjnldbefvzmqwzljkgzu
SUPABASE_URL: https://mjnldbefvzmqwzljkgzu.supabase.co
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbmxkYmVmdnptcXd6bGprZ3p1Iiwicm9zZSI6ImFub24iLCJpYXQiOjE3NTA3MjU1NDgsImV4cCI6MjA2NjMwMTU0OH0.oRZpwXVMeOfTbV8ylWBYIdIBQyUTVnkwf1SAIZUiN2w

// 클라이언트 설정
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
\`\`\`

## 데이터베이스 훅스 사용법

### useHealthProfile 훅
\`\`\`typescript
// 랜덤 건강 프로필을 가져오는 훅
const { healthProfile, isLoading, error } = useHealthProfile();
\`\`\`

### useRealPathData 훅
\`\`\`typescript
// 실제 산책로 데이터를 가져오는 훅
const { paths, isLoading, error } = useRealPathData();
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
- 백엔드: Supabase (데이터베이스, 인증, API)

## AI 추천 로직
1. 사용자 프로필 분석 (나이, 체력, 건강상태, 목표)
2. Supabase 건강정보 테이블에서 유사한 프로필 검색
3. 건강 상태에 따른 경로 필터링 (무릎 통증 시 경사 제한)
4. 체력 수준에 따른 난이도 조정
5. 운동 목표별 맞춤형 추천 이유 생성
6. 위치 기반 접근성 고려 (내주변산책로 테이블 활용)
7. 개인별 운동 강도 및 심박수 가이드 제공

## 주요 기능 흐름
1. 앱 로딩 → 자동 프로필 생성 또는 수동 입력
2. 현재 위치 감지 및 AI 분석
3. Supabase 데이터베이스에서 맞춤형 산책로 추천 표시
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
2. Supabase 데이터베이스 연동 ✅
3. 위치 기반 서비스 연동 ✅
4. 지도 및 경로 시각화 ✅  
5. 사용자 인터페이스 완성 ✅
6. 음성 인터페이스 및 고급 기능 ✅
7. 성능 최적화 및 테스트

이 프롬프트를 바탕으로 건강 중심의 개인화된 AI 산책로 추천 애플리케이션을 개발해주세요.`;

  const convertToCSV = (data: any[], headers: string[]) => {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // CSV에서 쉼표와 따옴표를 처리
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadPrompt = () => {
    const blob = new Blob([promptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI_건강_산책로_추천앱_프롬프트_v3_with_supabase.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportSupabaseTables = async () => {
    setIsExporting(true);
    try {
      // 건강정보 테이블 데이터 가져오기
      const { data: healthData, error: healthError } = await supabase
        .from('건강정보')
        .select('*')
        .limit(1000);

      if (healthError) throw healthError;

      // 내주변산책로 테이블 데이터 가져오기
      const { data: pathData, error: pathError } = await supabase
        .from('내주변산책로')
        .select('*')
        .limit(1000);

      if (pathError) throw pathError;

      // 전통시장현황 테이블 데이터 가져오기
      const { data: marketData, error: marketError } = await supabase
        .from('전통시장현황')
        .select('*')
        .limit(1000);

      if (marketError) throw marketError;

      // 각 테이블에 대한 CSV 생성
      const healthHeaders = [
        'ID', '이름', '나이', '성별', '체중(kg)', '신장(cm)', 
        '수축기 혈압', '이완기 혈압', '혈당(mg/dL)', '총콜레스테롤(mg/dL)',
        '진단 질병', '운동 빈도(회/주)', '음주 빈도(회/주)', '흡연 여부', '혈액형'
      ];

      const pathHeaders = [
        'CoursCode', 'CoursName', 'CorusDetailName', 'Address', 'CoursLength',
        'CoursDetailLength', 'CoursTime', 'CoursLv', 'CoursRoute', 'Latitude',
        'Longitude', 'ADIT_DC', 'Option', 'Toilet', 'SIGNGU_NM', 'CVNTL_NM'
      ];

      const marketHeaders = [
        '코드', '시장명', '시장유형', '시도', '시군구', '도로명주소', '지번주소',
        '정제도로명주소', '정제지번주소', '경위도X좌표', '경위도Y좌표', 'PNU', '시장코드',
        '아케이드보유여부', '엘리베이터_에스컬레이터_보유여부', '고객지원센터보유여부',
        '스프링쿨러보유여부', '화재감지기보유여부', '유아놀이방_보유여부', '종합콜센터_보유여부',
        '고객휴게실_보유여부', '수유센터_보유여부', '물품보관함_보유여부', '자전거보관함_보유여부',
        '체육시설_보유여부', '간이_도서관_보유여부', '쇼핑카트_보유여부', '외국인_안내센터_보유여부',
        '고객동선통로_보유여부', '방송센터_보유여부', '문화교실_보유여부', '공동물류창고_보유여부',
        '시장전용고객주차장_보유여부', '교육장_보유여부', '회의실_보유여부', '자동심장충격기_보유여부'
      ];

      // CSV 파일 생성 및 다운로드
      const healthCSV = convertToCSV(healthData || [], healthHeaders);
      const pathCSV = convertToCSV(pathData || [], pathHeaders);
      const marketCSV = convertToCSV(marketData || [], marketHeaders);

      // 통합 ZIP 파일을 만들기 위해 각각 개별 다운로드
      const downloadCSV = (csvContent: string, filename: string) => {
        const BOM = '\uFEFF'; // UTF-8 BOM for proper Korean character display
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      // 각 테이블 개별 다운로드
      downloadCSV(healthCSV, '건강정보.csv');
      setTimeout(() => downloadCSV(pathCSV, '내주변산책로.csv'), 500);
      setTimeout(() => downloadCSV(marketCSV, '전통시장현황.csv'), 1000);

      console.log('CSV 파일 다운로드 완료:', {
        건강정보: `${healthData?.length || 0}개 레코드`,
        내주변산책로: `${pathData?.length || 0}개 레코드`,
        전통시장현황: `${marketData?.length || 0}개 레코드`
      });

    } catch (error) {
      console.error('CSV 익스포트 중 오류 발생:', error);
      alert('CSV 파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadSourceCode = async () => {
    setIsDownloadingSource(true);
    try {
      const zip = new JSZip();

      // 실제 프로젝트 파일들을 ZIP에 추가
      const actualSourceFiles = {
        'package.json': `{
  "name": "ai-walking-path-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@11labs/react": "^0.1.4",
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@supabase/supabase-js": "^2.50.1",
    "@tanstack/react-query": "^5.56.2",
    "@types/leaflet": "^1.9.19",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.3.0",
    "input-otp": "^1.2.4",
    "jszip": "^3.10.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-resizable-panels": "^2.1.3",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.15.0",
    "@typescript-eslint/parser": "^7.15.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.2.2",
    "vite": "^5.3.4"
  }
}`,

        'vite.config.ts': `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));`,

        'tsconfig.json': `{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ]
}`,

        'tailwind.config.ts': `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;`,

        'index.html': `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI 건강 맞춤형 산책로 추천</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

        'src/main.tsx': `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,

        'src/App.tsx': `import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;`,

        'src/index.css': `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-inter;
  }
}

.leaflet-container {
  font-family: inherit;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.leaflet-popup-content {
  font-family: inherit;
  margin: 8px 12px;
}

.leaflet-control-zoom a {
  border-radius: 4px;
}

.font-inter {
  font-family: 'Inter', sans-serif;
}`,

        'src/integrations/supabase/client.ts': `import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://mjnldbefvzmqwzljkgzu.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbmxkYmVmdnptcXd6bGprZ3p1Iiwicm9zZSI6ImFub24iLCJpYXQiOjE3NTA3MjU1NDgsImV4cCI6MjA2NjMwMTU0OH0.oRZpwXVMeOfTbV8ylWBYIdIBQyUTVnkwf1SAIZUiN2w"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)`,

        'src/lib/utils.ts': `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,

        'README.md': `# AI 건강 맞춤형 산책로 추천 앱

건강 정보와 위치 기반으로 개인화된 산책로를 추천하는 React 웹 애플리케이션입니다.

## 🌟 주요 기능

### 🏥 건강 프로필 기반 추천
- 나이, 체력 수준, 건강 상태, 운동 목표 분석
- Supabase 건강정보 데이터베이스 연동
- AI 기반 맞춤형 산책로 추천

### 📍 위치 기반 서비스
- 현재 위치 자동 감지
- 주변 산책로 실시간 검색
- 거리별 난이도 필터링

### 🗺️ 인터랙티브 지도
- Leaflet 기반 지도 시각화
- 실시간 경로 표시
- 상세 정보 모달

### 🎯 스마트 추천 시스템
- 건강 상태별 운동 강도 계산
- 개인별 심박수 목표 범위 설정
- 질병별 운동 주의사항 반영

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + Shadcn/ui
- **상태 관리**: TanStack Query
- **지도**: Leaflet
- **백엔드**: Supabase
- **빌드 도구**: Vite
- **아이콘**: Lucide React

## 📦 설치 및 실행

\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 미리보기
npm run preview
\`\`\`

## 🗄️ 데이터베이스 구조

### Supabase 테이블
- **건강정보**: 사용자 건강 프로필 데이터
- **내주변산책로**: 실제 산책로 위치 및 정보
- **전통시장현황**: 주변 편의시설 정보

## 🎨 주요 컴포넌트

### 페이지
- \`Index.tsx\`: 메인 페이지
- \`LoadingScreen\`: 로딩 화면
- \`NotFound\`: 404 페이지

### 핵심 기능
- \`WalkingPathRecommendations\`: AI 추천 산책로
- \`SmallMap\`: 지도 컴포넌트
- \`PathDetailModal\`: 경로 상세 정보

### UI 컴포넌트
- \`AppHeader\`: 앱 헤더
- \`NavigationButtons\`: 네비게이션
- \`VoiceInterface\`: 음성 인터페이스

## 🎯 AI 추천 로직

1. 사용자 프로필 분석
2. 건강 상태별 경로 필터링
3. 체력 수준별 난이도 조정
4. 위치 기반 접근성 고려
5. 맞춤형 추천 이유 생성

## 🌐 배포

이 앱은 Lovable 플랫폼에서 개발되었으며, 원클릭 배포를 지원합니다.

## 📱 반응형 디자인

모든 화면 크기에서 최적화된 사용자 경험을 제공합니다.

## 🔧 개발 참고사항

- 모든 인터페이스는 한국어로 제공
- 접근성을 고려한 UI/UX 설계
- 성능 최적화된 컴포넌트 구조

## 📄 라이선스

이 프로젝트는 개인 프로젝트용으로 개발되었습니다.`
      };

      // 파일들을 ZIP에 추가
      Object.entries(actualSourceFiles).forEach(([filePath, content]) => {
        zip.file(filePath, content);
      });

      // 프로젝트 설명 파일 추가
      zip.file('프로젝트_설명.md', `# AI 건강 맞춤형 산책로 추천 앱 소스코드

이 압축 파일에는 다음과 같은 파일들이 포함되어 있습니다:

## 주요 컴포넌트
- src/components/PromptDownloader.tsx: 프롬프트 및 데이터 다운로드 컴포넌트
- src/pages/Index.tsx: 메인 페이지
- src/components/ui/button.tsx: UI 버튼 컴포넌트

## 설정 파일
- package.json: 프로젝트 의존성
- tailwind.config.ts: Tailwind CSS 설정
- vite.config.ts: Vite 빌드 설정
- tsconfig.json: TypeScript 설정

## 개발 환경 설정
1. Node.js 18+ 설치
2. npm install 실행
3. npm run dev로 개발 서버 시작

## 주요 기능
- 건강 프로필 기반 AI 추천
- Supabase 데이터베이스 연동
- 실시간 위치 기반 서비스
- 반응형 웹 디자인

생성 날짜: ${new Date().toLocaleDateString('ko-KR')}
`);

      // ZIP 파일 생성 및 다운로드
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI_산책로_앱_소스코드_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('소스코드 압축 파일 다운로드 완료');

    } catch (error) {
      console.error('소스코드 다운로드 중 오류 발생:', error);
      alert('소스코드 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloadingSource(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📝 AI 프롬프트 다운로드 (v3 - Supabase 스키마 포함)
          </h3>
          <p className="text-gray-600 text-sm">
            현재 앱의 모든 기능과 구조, 그리고 Supabase 데이터베이스 테이블 스키마까지 포함한 완전한 AI 프롬프트를 다운로드하거나 CSV 파일로 데이터를 익스포트하고, 소스코드를 압축해서 다운로드할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={downloadPrompt}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            프롬프트 다운로드
          </Button>
          <Button 
            onClick={exportSupabaseTables}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {isExporting ? '익스포트 중...' : 'CSV 익스포트'}
          </Button>
          <Button 
            onClick={downloadSourceCode}
            disabled={isDownloadingSource}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {isDownloadingSource ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileArchive className="h-4 w-4" />
            )}
            {isDownloadingSource ? '압축 중...' : '소스코드 다운로드'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptDownloader;
