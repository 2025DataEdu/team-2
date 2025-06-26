
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Database, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PromptDownloader = () => {
  const [isExporting, setIsExporting] = useState(false);

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
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbmxkYmVmdnptcXd6bGprZ3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjU1NDgsImV4cCI6MjA2NjMwMTU0OH0.oRZpwXVMeOfTbV8ylWBYIdIBQyUTVnkwf1SAIZUiN2w

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

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📝 AI 프롬프트 다운로드 (v3 - Supabase 스키마 포함)
          </h3>
          <p className="text-gray-600 text-sm">
            현재 앱의 모든 기능과 구조, 그리고 Supabase 데이터베이스 테이블 스키마까지 포함한 완전한 AI 프롬프트를 다운로드하거나 CSV 파일로 데이터를 익스포트할 수 있습니다.
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
        </div>
      </div>
    </div>
  );
};

export default PromptDownloader;
