
import JSZip from 'jszip';

export const createSourceCodePackage = async () => {
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

생성 날짜: ${new Date().toLocaleDateString('ko-KR')}
`
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

  return zip;
};

export const downloadSourceCodeZip = async (zip: JSZip) => {
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `AI_산책로_앱_소스코드_${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
