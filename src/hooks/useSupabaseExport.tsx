
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { convertToCSV, downloadCSV } from '@/utils/csvExporter';

export const useSupabaseExport = () => {
  const [isExporting, setIsExporting] = useState(false);

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

  return {
    exportSupabaseTables,
    isExporting
  };
};
