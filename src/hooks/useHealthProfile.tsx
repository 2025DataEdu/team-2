
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HealthProfile {
  ID: number;
  이름: string | null;
  나이: number | null;
  성별: string | null;
  '체중(kg)': number | null;
  '신장(cm)': number | null;
  '수축기 혈압': number | null;
  '이완기 혈압': number | null;
  '혈당(mg/dL)': number | null;
  '총콜레스테롤(mg/dL)': number | null;
  '진단 질병': string | null;
  '운동 빈도(회/주)': string | null;
  '주당 운동 시간(시간)': number | null;
  '음주 빈도(회/주)': string | null;
  '흡연 여부': string | null;
  혈액형: string | null;
}

export const useHealthProfile = () => {
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomHealthProfile = async () => {
      try {
        setIsLoading(true);
        
        // 전체 레코드 수 가져오기
        const { count } = await supabase
          .from('건강정보')
          .select('*', { count: 'exact', head: true });

        if (!count || count === 0) {
          throw new Error('건강정보 데이터가 없습니다.');
        }

        // 랜덤 오프셋 계산
        const randomOffset = Math.floor(Math.random() * count);

        // 랜덤 프로필 가져오기
        const { data, error } = await supabase
          .from('건강정보')
          .select('*')
          .range(randomOffset, randomOffset)
          .single();

        if (error) {
          throw error;
        }

        setHealthProfile(data);
      } catch (err) {
        console.error('Error fetching random health profile:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomHealthProfile();
  }, []);

  return { healthProfile, isLoading, error };
};
